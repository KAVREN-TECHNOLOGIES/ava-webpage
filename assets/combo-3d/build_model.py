"""Build AVA's studio model from CC0 anatomy and independently composable shapes."""
from pathlib import Path
import bpy, math, json
from mathutils import Vector

ROOT = Path(__file__).resolve().parent
SOURCE = ROOT / "source"
OUTPUT = ROOT.parents[1] / "public" / "media" / "combo-3d"
OUTPUT.mkdir(parents=True, exist_ok=True)
verts, groups, group = [], {}, ""
for line in (SOURCE / "base.obj").read_text().splitlines():
    fields=line.split()
    if not fields or fields[0].startswith("#"): continue
    if fields[0]=="v": verts.append(Vector(tuple(map(float,fields[1:4]))))
    elif fields[0]=="g": group=fields[1]
    elif fields[0]=="f": groups.setdefault(group,[]).append([int(v.split("/")[0])-1 for v in fields[1:]])

def add(points,name,weight):
    for line in (SOURCE/name).read_text().splitlines():
        f=line.split()
        if f and not f[0].startswith("#"): points[int(f[0])] += Vector(tuple(map(float,f[1:4])))*weight

def gauss(v,c,r): return math.exp(-((v-c)/r)**2)
def clamp(v): return max(0,min(1,v))
def smooth(v):
    v=clamp(v)
    return v*v*(3-2*v)

base=[v.copy() for v in verts]
for name,weight in [
    ("macrodetails/caucasian-female-young.target",.55),
    ("macrodetails/african-female-young.target",.45),
    ("macrodetails/universal-female-young-averagemuscle-averageweight.target",.75),
    ("macrodetails/universal-female-young-averagemuscle-maxweight.target",.25),
    ("breast/female-young-averagemuscle-averageweight-averagecup-maxfirmness.target",.6),
    ("breast/female-young-averagemuscle-averageweight-mincup-maxfirmness.target",.1),
    ("breast/breast-trans-down.target",.15)
]: add(base,name,weight)
for p in base:
    x,y,z=p
    if abs(x)<2.2 and -.2<y<3.2:
        p.z += .38*gauss(y,1.05,1.35)*gauss(x,0,1.35)*clamp((z+.1)/.6)

states={"Basis":base}
for name in ["bbl","liposuccion","abdominoplastia","aumento-de-pecho","levantamiento-de-pecho","reduccion-de-pecho"]:
    points=[p.copy() for p in base]
    if name=="aumento-de-pecho":
        add(points,"breast/female-young-averagemuscle-averageweight-maxcup-maxfirmness.target",.85)
    elif name=="reduccion-de-pecho":
        add(points,"breast/female-young-averagemuscle-averageweight-mincup-maxfirmness.target",1.9)
    elif name=="levantamiento-de-pecho":
        add(points,"breast/breast-trans-up.target",1.5)
        add(points,"breast/female-young-averagemuscle-averageweight-averagecup-maxfirmness.target",.25)
    else:
        for i,p in enumerate(points):
            x,y,z=base[i]
            if abs(x)>2.25 or not (-3<y<4.5): continue
            front=smooth((z+.05)/.6)
            if name=="bbl":
                posterior=smooth((-z+.05)/.65)
                p.z -= .55*gauss(y,.2,1.45)*gauss(x,0,1.65)*posterior
                p.x += math.copysign(.25*gauss(y,.2,1.25)*gauss(abs(x),1.4,.7),x)
            elif name=="liposuccion":
                side=gauss(abs(x),1.3,.7)*gauss(y,2.3,1.3)
                p.x -= math.copysign(.34*side,x)
                p.z -= .12*gauss(y,2,1)*gauss(x,0,1.55)*front
            else:
                belly=gauss(y,.95,1.15)*gauss(x,0,1.4)*front
                p.z -= .42*belly
                p.y += .06*belly
    states[name]=points

def pose(p,original):
    p=p.copy()
    sign=1 if original.x>0 else -1
    threshold=1.5+max(0,5.2-original.y)*.18
    weight=smooth((abs(original.x)-threshold)/.45)
    shoulder=Vector((sign*1.677,5.246,.146))
    offset=p-shoulder
    angle=math.radians(-22*sign)*weight
    p.x=shoulder.x+offset.x*math.cos(angle)-offset.y*math.sin(angle)
    p.y=shoulder.y+offset.x*math.sin(angle)+offset.y*math.cos(angle)
    return Vector((p.x*.1,-p.z*.1,p.y*.1+.85))

posed={name:[pose(p,verts[i]) for i,p in enumerate(points)] for name,points in states.items()}
scene=bpy.data.scenes.new("AVA_Combo_Studio")
bpy.context.window.scene=scene

def material(name,color,roughness):
    mat=bpy.data.materials.new(name)
    mat.diffuse_color=(*color,1)
    mat.use_nodes=True
    node=mat.node_tree.nodes.get("Principled BSDF")
    node.inputs["Base Color"].default_value=(*color,1)
    node.inputs["Roughness"].default_value=roughness
    return mat
skin=material("Warm_Clay",(.57,.35,.23),.82)
fabric=material("Aubergine_Fabric",(.038,.022,.027),.9)

def clipped_mesh(source_faces,low,high):
    # Clip in the rest shape and interpolate every morph with identical weights.
    points={name:[] for name in posed}; outfaces=[]; lookup={}
    def add_vertex(values):
        key=tuple(round(v,8) for v in values["Basis"])
        if key not in lookup:
            lookup[key]=len(points["Basis"])
            for name in points: points[name].append(values[name])
        return lookup[key]
    for face in source_faces:
        polygon=[{name:pts[i].copy() for name,pts in posed.items()} for i in face]
        for cut,above in [(low,True),(high,False)]:
            result=[]
            for a,b in zip(polygon,polygon[1:]+polygon[:1]):
                av,bv=a["Basis"].z,b["Basis"].z
                ina=av>=cut if above else av<=cut
                inb=bv>=cut if above else bv<=cut
                if ina: result.append(a)
                if ina!=inb:
                    t=(cut-av)/(bv-av)
                    result.append({name:a[name].lerp(b[name],t) for name in posed})
            polygon=result
            if not polygon: break
        if len(polygon)>=3: outfaces.append([add_vertex(v) for v in polygon])
    return points,outfaces

def largest_component(points,faces):
    adjacent={}
    for f in faces:
        for a,b in zip(f,f[1:]+f[:1]):
            adjacent.setdefault(a,set()).add(b);adjacent.setdefault(b,set()).add(a)
    unseen=set(adjacent);components=[]
    while unseen:
        todo=[unseen.pop()];found=set(todo)
        while todo:
            for v in adjacent[todo.pop()]:
                if v in unseen: unseen.remove(v);found.add(v);todo.append(v)
        components.append(found)
    keep=max(components,key=len)
    chosen=sorted(keep);remap={old:new for new,old in enumerate(chosen)}
    return {name:[p[i] for i in chosen] for name,p in points.items()},[[remap[i] for i in f] for f in faces if f[0] in keep]

def subdivide(points,faces):
    edges={};vf={};ve={}
    for fi,f in enumerate(faces):
        for i in f:vf.setdefault(i,[]).append(fi)
        for a,b in zip(f,f[1:]+f[:1]):
            edge=tuple(sorted((a,b)));edges.setdefault(edge,[]).append(fi)
            ve.setdefault(a,set()).add(edge);ve.setdefault(b,set()).add(edge)
    keys=list(edges);offset=len(points["Basis"]);ei={e:offset+i for i,e in enumerate(keys)}
    face_start=offset+len(keys)
    outfaces=[]
    for fi,f in enumerate(faces):
        for j,v in enumerate(f):outfaces.append([v,ei[tuple(sorted((v,f[(j+1)%len(f)])))],face_start+fi,ei[tuple(sorted((f[j-1],v)))]])
    output={}
    for name,pts in points.items():
        centers=[sum((pts[i] for i in f),Vector())/len(f) for f in faces]
        out=[]
        for i,p in enumerate(pts):
            border=[e for e in ve.get(i,[]) if len(edges[e])==1]
            if border:
                neighbors=[pts[b if a==i else a] for a,b in border]
                out.append(p*.75+sum(neighbors,Vector())*.25/len(neighbors))
            elif i in vf:
                n=len(vf[i]);f=sum((centers[j] for j in vf[i]),Vector())/n
                r=sum(((pts[a]+pts[b])/2 for a,b in ve[i]),Vector())/len(ve[i])
                out.append((f+2*r+(n-3)*p)/n)
            else:out.append(p.copy())
        for a,b in keys:
            fs=edges[(a,b)]
            out.append((pts[a]+pts[b]+sum((centers[i] for i in fs),Vector()))/(2+len(fs)) if len(fs)>1 else (pts[a]+pts[b])/2)
        output[name]=out+centers
    return output,outfaces

def normals(points,faces):
    ns=[Vector() for _ in points]
    for f in faces:
        n=(points[f[1]]-points[f[0]]).cross(points[f[2]]-points[f[0]])
        for i in f:ns[i]+=n
    return [n.normalized() for n in ns]

def author(name,points,faces,mat,shell=False):
    points,faces=subdivide(points,faces)
    if name=="AVA_Body":
        adjacent={}
        for f in faces:
            for a,b in zip(f,f[1:]+f[:1]):adjacent.setdefault(a,set()).add(b);adjacent.setdefault(b,set()).add(a)
        covered=[i for i,p in enumerate(points["Basis"]) if 1.12<p.z<1.34 and abs(p.x)<.21 and p.y<-.015]
        for state,pts in points.items():
            for _ in range(18):
                changes={i:pts[i].lerp(sum((pts[j] for j in adjacent[i]),Vector())/len(adjacent[i]),.48) for i in covered}
                for i,p in changes.items():pts[i]=p
    if shell:
        # Separate outer/inner surfaces with closed 2 mm hems.
        n=len(points["Basis"])
        edges={}
        for f in faces:
            for a,b in zip(f,f[1:]+f[:1]):edges.setdefault(tuple(sorted((a,b))),[]).append((a,b))
        bounds=(1.135,1.253) if name=="AVA_Bandeau" else (.70,.945)
        hems_vertices={i for edge,uses in edges.items() if len(uses)==1 for i in edge}
        snaps={i:min(bounds,key=lambda z:abs(points["Basis"][i].z-z)) for i in hems_vertices}
        snaps={i:z for i,z in snaps.items() if abs(points["Basis"][i].z-z)<.018}
        rest=[p.copy() for p in points["Basis"]]
        for state,pts in list(points.items()):
            ns=normals(pts,faces)
            if name=="AVA_Shorts":
                ns=[Vector((p.x-math.copysign(.085*smooth((.92-p.z)/.17),p.x),p.y+.015,0)).normalized() for p in pts]
            outer=.014 if name=="AVA_Shorts" else .009
            points[state]=[p+no*outer for p,no in zip(pts,ns)]+[p+no*(outer-.002) for p,no in zip(pts,ns)]
            for i,z in snaps.items():points[state][i].z=points[state][i+n].z=z+pts[i].z-rest[i].z

        inner=[[i+n for i in reversed(f)] for f in faces]
        hems=[[b,a,a+n,b+n] for uses in edges.values() if len(uses)==1 for a,b in uses]
        faces=faces+inner+hems
    mesh=bpy.data.meshes.new(name+"_Mesh")
    mesh.from_pydata(points["Basis"],[],faces);mesh.update()
    obj=bpy.data.objects.new(name,mesh);scene.collection.objects.link(obj)
    mesh.materials.append(mat)
    for polygon in mesh.polygons:polygon.use_smooth=True
    for state,pts in points.items():
        key=obj.shape_key_add(name=state)
        for i,p in enumerate(pts):key.data[i].co=p
    return obj

body_faces=[f for f in groups["body"] if all(-4.9<verts[i].y<6.3 for i in f)]
used=sorted(set(i for f in body_faces for i in f));remap={old:new for new,old in enumerate(used)}
body=author("AVA_Body",{name:[pts[i] for i in used] for name,pts in posed.items()},[[remap[i] for i in f] for f in body_faces],skin)

top_points={name:[] for name in posed};top_faces=[]
RINGS,SIDES=28,96
for name,pts in posed.items():
    dimensions=[]
    for row in range(RINGS):
        height=1.135+.118*row/(RINGS-1)
        nearby=[p for i,p in enumerate(pts) if abs(p.z-height)<.012 and abs(verts[i].x)<1.8 and i<13380]
        front=min(p.y for p in nearby)-.008;back=max(p.y for p in nearby)+.008
        dimensions.append(Vector((max(abs(p.x) for p in nearby)+.004,(front+back)/2,(back-front)/2)))
    for _ in range(7):
        before=[p.copy() for p in dimensions]
        for row in range(1,RINGS-1):dimensions[row]=before[row]*.5+(before[row-1]+before[row+1])*.25
    for row,(rx,center,ry) in enumerate(dimensions):
        height=1.135+.118*row/(RINGS-1)
        for col in range(SIDES):
            c,s=math.cos(col*math.tau/SIDES),math.sin(col*math.tau/SIDES)
            top_points[name].append(Vector((rx*math.copysign(abs(c)**.50,c),center+ry*math.copysign(abs(s)**.50,s),height)))
for row in range(RINGS-1):
    for col in range(SIDES):
        nxt=(col+1)%SIDES
        top_faces.append([row*SIDES+col,row*SIDES+nxt,(row+1)*SIDES+nxt,(row+1)*SIDES+col])
top=author("AVA_Bandeau",top_points,top_faces,fabric,True)
# Pants are a clean bifurcated garment surface, independent of genital detail.
# The continuous torso ring divides into two leg openings at a shared crotch seam.
pants={name:[] for name in posed};pants_faces=[];vertex_lookup={}
N,UPPER,LOWER=96,15,12
def pants_vertex(values):
    key=tuple(round(x,8) for x in values["Basis"])
    if key not in vertex_lookup:
        vertex_lookup[key]=len(pants["Basis"])
        for name in pants:pants[name].append(values[name])
    return vertex_lookup[key]
def section(name,height,side=0):
    candidates=[p for i,p in enumerate(posed[name]) if i<13380 and abs(p.z-height)<.018 and abs(verts[i].x)<2.5 and (not side or p.x*side>.025)]
    xmin,xmax=min(p.x for p in candidates),max(p.x for p in candidates)
    front,back=min(p.y for p in candidates)-.012,max(p.y for p in candidates)+.012
    return ((xmin+xmax)/2,(xmax-xmin)/2+.012,(front+back)/2,(back-front)/2)
dimensions={}
for name in posed:
    rows=[Vector(section(name,.945-(.945-.795)*r/(UPPER-1))) for r in range(UPPER)]
    for _ in range(8):
        prev=[v.copy() for v in rows]
        for r in range(1,UPPER-1):rows[r]=prev[r]*.5+(prev[r-1]+prev[r+1])*.25
    dimensions[name]=rows
trunk=[]
for row in range(UPPER):
    ring=[]
    height=.945-(.945-.795)*row/(UPPER-1)
    for col in range(N):
        c,si=math.cos(col*math.tau/N),math.sin(col*math.tau/N)
        values={}
        for name in pants:
            center,rx,depth,ry=dimensions[name][row]
            values[name]=Vector((center+rx*math.copysign(abs(c)**.55,c),depth+ry*math.copysign(abs(si)**.55,si),height))
        ring.append(pants_vertex(values))
    trunk.append(ring)
for upper,lower in zip(trunk,trunk[1:]):
    for col in range(N):
        nxt=(col+1)%N;pants_faces.append([upper[col],lower[col],lower[nxt],upper[nxt]])
for side in [-1,1]:
    bottom_dimensions={name:section(name,.70,side) for name in pants}
    rings=[]
    for row in range(LOWER):
        amount=row/(LOWER-1);height=.795-(.795-.70)*amount
        ring=[]
        for col in range(N):
            c,si=math.cos(col*math.tau/N),math.sin(col*math.tau/N)
            values={}
            for name in pants:
                center,rx,depth,ry=dimensions[name][-1]
                top_point=Vector((center+rx*math.copysign(abs(c)**.55,c) if c*side>=-1e-7 else center,
                            depth+ry*math.copysign(abs(si)**.55,si),.795))
                lx,lr,ly,ld=bottom_dimensions[name]
                bottom=Vector((lx+lr*math.copysign(abs(c)**.65,c),ly+ld*math.copysign(abs(si)**.65,si),.70))
                values[name]=top_point.lerp(bottom,amount)
            ring.append(pants_vertex(values))
        rings.append(ring)
    for upper,lower in zip(rings,rings[1:]):
        for col in range(N):
            nxt=(col+1)%N;pants_faces.append([upper[col],lower[col],lower[nxt],upper[nxt]])
shorts=author("AVA_Shorts",pants,pants_faces,fabric,True)

scene.render.engine="CYCLES";scene.cycles.samples=24;scene.cycles.use_denoising=True
scene.render.resolution_x=768;scene.render.resolution_y=960;scene.render.resolution_percentage=100
scene.render.image_settings.file_format="PNG";scene.render.film_transparent=True
scene.view_settings.view_transform="AgX"
scene.world=bpy.data.worlds.new("AVA_Studio_World");scene.world.use_nodes=True
scene.world.node_tree.nodes["Background"].inputs[0].default_value=(.79,.72,.65,1)
scene.world.node_tree.nodes["Background"].inputs[1].default_value=.55
def area(name,location,power,size,color):
    data=bpy.data.lights.new(name,"AREA");data.energy=power;data.shape="DISK";data.size=size;data.color=color
    obj=bpy.data.objects.new(name,data);scene.collection.objects.link(obj);obj.location=location
    obj.rotation_euler=(Vector((0,0,1.05))-obj.location).to_track_quat("-Z","Y").to_euler()
area("Key_Softbox",(-2.4,-3,3.8),330,3.5,(1,.9,.8))
area("Fill_Softbox",(2.5,-1,2),180,3,(.85,.9,1))
area("Rim_Softbox",(0,2.2,2.8),400,2,(1,.85,.7))
camera_data=bpy.data.cameras.new("Editorial_Camera");camera=bpy.data.objects.new("Editorial_Camera",camera_data)
scene.collection.objects.link(camera);camera.location=(-2.2,-4.2,.91)
camera.rotation_euler=(Vector((0,0,.91))-camera.location).to_track_quat("-Z","Y").to_euler()
camera_data.type="ORTHO";camera_data.ortho_scale=.98;scene.camera=camera
bpy.ops.object.select_all(action="DESELECT")
for obj in [body,top,shorts]:obj.select_set(True)
bpy.context.view_layer.objects.active=body
bpy.ops.export_scene.gltf(filepath=str(OUTPUT/"body.glb"),export_format="GLB",use_selection=True,use_active_scene=True,export_morph=True,export_morph_normal=True,export_animations=False,export_apply=False)
bpy.context.preferences.filepaths.save_version=0
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/"ava-combo.blend"))
metrics={k.name:round(max((p.co-b.co).length for p,b in zip(k.data,body.data.shape_keys.key_blocks[0].data)),5) for k in list(body.data.shape_keys.key_blocks)[1:]}
(ROOT/"metrics.json").write_text(json.dumps({"vertices":sum(len(o.data.vertices) for o in [body,top,shorts]),"maximum_displacement_m":metrics},indent=2))
scene.render.filepath=str(OUTPUT/"base.png");bpy.ops.render.render(write_still=True)
print("AVA_COMBO_READY",json.dumps(metrics))
