"""AVA mannequin studies: user-supplied mesh, six morphs and four editable poses."""
from pathlib import Path
import bpy,bmesh,math,json,hashlib,struct,sys,heapq
from mathutils import Vector,Matrix

ROOT=Path(__file__).resolve().parent
SOURCE=ROOT/"source/mannequin-original.glb"
RENDERS=ROOT/"renders";RENDERS.mkdir(exist_ok=True)
bpy.ops.object.select_all(action="SELECT");bpy.ops.object.delete(use_global=False)
bpy.ops.import_scene.gltf(filepath=str(SOURCE))
body=next(o for o in bpy.context.scene.objects if o.type=="MESH")
world=body.matrix_world.copy();body.parent=None;body.matrix_world=Matrix.Identity(4);body.data.transform(world)
bounds=[v.co.copy() for v in body.data.vertices]
low=Vector(tuple(min(p[a] for p in bounds) for a in range(3)));high=Vector(tuple(max(p[a] for p in bounds) for a in range(3)))
center=(low+high)/2;scale=1.75/(high.z-low.z)
for v in body.data.vertices:v.co=Vector(((v.co.x-center.x)*scale,(v.co.y-center.y)*scale,(v.co.z-low.z)*scale))
for o in list(bpy.context.scene.objects):
    if o!=body:bpy.data.objects.remove(o,do_unlink=True)
bm=bmesh.new();bm.from_mesh(body.data)
bmesh.ops.remove_doubles(bm,verts=list(bm.verts),dist=.000003)
bmesh.ops.recalc_face_normals(bm,faces=list(bm.faces));bm.to_mesh(body.data);bm.free();body.data.update()
body.name="AVA_Mannequin";body.data.name="User_Mannequin_Study"
for polygon in body.data.polygons:polygon.use_smooth=True
body.data.materials.clear()

def material(name,color,roughness=.7):
    mat=bpy.data.materials.new(name);mat.diffuse_color=(*color,1);mat.use_nodes=True
    node=mat.node_tree.nodes.get("Principled BSDF");node.inputs["Base Color"].default_value=(*color,1);node.inputs["Roughness"].default_value=roughness
    return mat
stone=material("AVA_Warm_Stone",(.52,.40,.29),.66)
ink=material("AVA_Espresso",(.017,.011,.008),.9)
emission=ink.node_tree.nodes.new("ShaderNodeEmission");emission.inputs[0].default_value=(.017,.011,.008,1)
ink.node_tree.links.new(emission.outputs[0],ink.node_tree.nodes.get("Material Output").inputs["Surface"])
ivory=material("AVA_Ivory",(.72,.68,.61),.92)
body.data.materials.append(stone)
base=[v.co.copy() for v in body.data.vertices]
def g(v,c,r):return math.exp(-((v-c)/r)**2)
def clamp(v):return max(0,min(1,v))
def smooth(v):
    v=clamp(v);return v*v*(3-2*v)
ids=["bbl","liposuccion","abdominoplastia","aumento-de-pecho","levantamiento-de-pecho","reduccion-de-pecho"]
body.shape_key_add(name="Basis")
metrics={}
for name in ids:
    key=body.shape_key_add(name=name);maximum=0
    for i,p in enumerate(base):
        x,y,z=p;co=p.copy()
        torso=1-smooth((abs(x)-.155)/.035)
        front=smooth((-y-.035)/.055)
        if name=="bbl":
            posterior=smooth((y-.02)/.055)
            bulk=g(z,.945,.10)*g(x,0,.145)*posterior*torso
            co.y+=.045*bulk
            co.x+=math.copysign(.014*g(z,.94,.095)*g(abs(x),.13,.05)*torso,x)
        elif name=="liposuccion":
            waist=g(z,1.125,.105)*torso
            co.x-=math.copysign(.017*waist*g(abs(x),.108,.052),x)
            co.y+=.010*waist*g(x,0,.13)*front
        elif name=="abdominoplastia":
            belly=g(z,1.055,.10)*g(x,0,.105)*front*torso
            co.y+=.025*belly;co.z+=.003*belly
        else:
            chest=(g(x,.074,.062)+g(x,-.074,.062))*g(z,1.316,.065)*front*torso
            if name=="aumento-de-pecho":
                co.y-=.046*chest
                co.x+=math.copysign(.005*chest,x)
            elif name=="levantamiento-de-pecho":
                lift=(g(x,.074,.080)+g(x,-.074,.080))*g(z,1.316,.100)*front*torso
                co.z+=.025*lift
                co.y-=.003*lift*g(z,1.34,.055)
            else:
                reduction=smooth((chest-.02)/.38)
                co.y+=max(0,-.107-y)*.72*reduction
                co.x-=math.copysign(.004*chest,x)
        key.data[i].co=co;maximum=max(maximum,(co-p).length)
    key.slider_min=0;key.slider_max=1;metrics[name]=round(maximum,5)

# Compact human rig fitted to the supplied neutral anatomy.
armature=bpy.data.armatures.new("AVA_Study_Skeleton")
rig=bpy.data.objects.new("AVA_Pose_Rig",armature);bpy.context.scene.collection.objects.link(rig)
bpy.context.view_layer.objects.active=rig;rig.select_set(True);body.select_set(False)
bpy.ops.object.mode_set(mode="EDIT")
definitions=[
("pelvis",(0,.035,.91),(0,.028,1.025),None),
("spine",(0,.028,1.025),(0,.028,1.23),"pelvis"),
("chest",(0,.028,1.23),(0,.027,1.425),"spine"),
("neck",(0,.027,1.425),(0,.028,1.545),"chest"),
("head",(0,.028,1.545),(0,.025,1.73),"neck")]
for side,sign in [("L",1),("R",-1)]:
    definitions += [
    ("clavicle."+side,(0,.027,1.425),(sign*.148,.025,1.43),"chest"),
    ("upper_arm."+side,(sign*.148,.025,1.43),(sign*.216,.044,1.168),"clavicle."+side),
    ("forearm."+side,(sign*.216,.044,1.168),(sign*.246,.002,.958),"upper_arm."+side),
    ("hand."+side,(sign*.246,.002,.958),(sign*.253,-.023,.845),"forearm."+side),
    ("thigh."+side,(sign*.085,.035,.915),(sign*.09,.014,.495),"pelvis"),
    ("shin."+side,(sign*.09,.014,.495),(sign*.09,.036,.10),"thigh."+side),
    ("foot."+side,(sign*.09,.036,.10),(sign*.09,-.105,.043),"shin."+side)]
for name,head,tail,parent in definitions:
    bone=armature.edit_bones.new(name);bone.head=head;bone.tail=tail
    if parent:bone.parent=armature.edit_bones[parent]
bpy.ops.object.mode_set(mode="OBJECT")
# Anatomical region weights prevent arm motion leaking into the abdomen.
body.parent=rig;body.matrix_parent_inverse=Matrix.Identity(4)
modifier=body.modifiers.new("Study_Skin","ARMATURE");modifier.object=rig
body.vertex_groups.clear()
vertex_groups={name:body.vertex_groups.new(name=name) for name,_,_,_ in definitions}
segments={name:(Vector(head),Vector(tail)) for name,head,tail,_ in definitions}
def kernel(point,name):
    a,b=segments[name];edge=b-a
    t=clamp((point-a).dot(edge)/edge.length_squared)
    d=(point-(a+edge*t)).length_squared
    return 1/(d+.0009)**2
def distribution(point,names):
    values={name:kernel(point,name) for name in names};total=sum(values.values())
    return {name:value/total for name,value in values.items()}
# Geodesic masks follow mesh connectivity instead of projecting limb weights
# across the small air gap between the arms and torso.
adjacent=[[] for _ in body.data.vertices]
for edge in body.data.edges:
    a,b=edge.vertices;distance=(body.data.vertices[a].co-body.data.vertices[b].co).length
    adjacent[a].append((b,distance));adjacent[b].append((a,distance))
def geodesic(seeds):
    distances=[math.inf]*len(adjacent);queue=[]
    for index in seeds:distances[index]=0;queue.append((0,index))
    heapq.heapify(queue)
    while queue:
        distance,index=heapq.heappop(queue)
        if distance!=distances[index]:continue
        for other,length in adjacent[index]:
            next_distance=distance+length
            if next_distance<distances[other]:distances[other]=next_distance;heapq.heappush(queue,(next_distance,other))
    return distances
arm_seeds=[v.index for v in body.data.vertices if (.70<v.co.z<1.12 and abs(v.co.x)>.215) or (1.12<=v.co.z<1.36 and abs(v.co.x)>.183)]
trunk_seeds=[v.index for v in body.data.vertices if abs(v.co.x)<.105 or (v.co.z<.77 and abs(v.co.x)<.19) or v.co.z>1.53]
arm_distance=geodesic(arm_seeds);trunk_distance=geodesic(trunk_seeds)
arm_attribute=body.data.attributes.new("ArmMask","FLOAT","POINT")
for vertex in body.data.vertices:
    point=vertex.co;x,y,z=point
    da,dt=arm_distance[vertex.index],trunk_distance[vertex.index]
    arm=smooth((dt-da+.025)/.10) if math.isfinite(da) and math.isfinite(dt) else (1 if math.isfinite(da) or (.70<z<1.38 and abs(x)>.18) else 0)
    arm_attribute.data[vertex.index].value=arm
    leg=(1-arm)*(1-smooth((z-.83)/.155))
    torso=1-arm-leg;weights={}
    side="L" if x>0 else "R"
    if arm:
        for name,value in distribution(point,["upper_arm."+side,"forearm."+side,"hand."+side]).items():weights[name]=arm*value
    if torso:
        for name,value in distribution(point,["pelvis","spine","chest","neck","head"]).items():weights[name]=weights.get(name,0)+torso*value
    if leg:
        left=smooth((x+.035)/.07)
        for side,amount in [("L",left),("R",1-left)]:
            if amount:
                for name,value in distribution(point,["thigh."+side,"shin."+side,"foot."+side]).items():weights[name]=weights.get(name,0)+leg*amount*value
    chosen=sorted(weights.items(),key=lambda item:item[1],reverse=True)[:4]
    total=sum(value for _,value in chosen)
    for name,value in chosen:vertex_groups[name].add([vertex.index],value/total,"REPLACE")
unweighted=sum(not v.groups for v in body.data.vertices)
if unweighted:raise RuntimeError("Unbound mannequin vertices")
rig.show_in_front=True;armature.display_type="OCTAHEDRAL"

# FK studies preserve the bind pose exactly and avoid IK pole-induced rolling.
from mathutils import Quaternion
for pb in rig.pose.bones:pb.rotation_mode="QUATERNION"
scene=bpy.context.scene;scene.name="Mannequin_Studio";scene.frame_start=1;scene.frame_end=91
def rotate_global(name,axis,degrees):
    pb=rig.pose.bones[name]
    local=pb.bone.matrix_local.to_3x3().inverted()@Vector(axis)
    pb.rotation_quaternion=Quaternion(local,math.radians(degrees))@pb.rotation_quaternion
def orient_bone(name,head,direction):
    pb=rig.pose.bones[name]
    rest=pb.bone.matrix_local.to_3x3()
    rest_direction=(pb.bone.tail_local-pb.bone.head_local).normalized()
    swing=rest_direction.rotation_difference(Vector(direction).normalized())
    pb.matrix=Matrix.Translation(Vector(head))@(swing.to_matrix()@rest).to_4x4()
def hand_on_hip(side):
    upper=rig.pose.bones["upper_arm."+side];forearm=rig.pose.bones["forearm."+side]
    shoulder=upper.head.copy();wrist=Vector((.215,-.04,1.09))
    delta=wrist-shoulder;distance=delta.length;direction=delta.normalized()
    length_a=upper.bone.length;length_b=forearm.bone.length
    along=(length_a**2-length_b**2+distance**2)/(2*distance)
    height=math.sqrt(max(0,length_a**2-along**2))
    outward=Vector((1,.10,0));outward=(outward-direction*outward.dot(direction)).normalized()
    elbow=shoulder+direction*along+outward*height
    orient_bone("upper_arm."+side,shoulder,elbow-shoulder);bpy.context.view_layer.update()
    orient_bone("forearm."+side,elbow,wrist-elbow);bpy.context.view_layer.update()
    orient_bone("hand."+side,wrist,(-.015,-.012,-.113));bpy.context.view_layer.update()
poses=[(1,"Original"),(31,"Brazos abiertos"),(61,"Contrapposto"),(91,"Mano en cintura")]
for frame,label in poses:
    scene.frame_set(frame)
    rig.location=(0,0,0)
    for pb in rig.pose.bones:pb.matrix_basis=Matrix.Identity(4)
    if frame==31:
        rotate_global("upper_arm.L",(0,1,0),-20)
        rotate_global("upper_arm.R",(0,1,0),20)
    if frame in (61,91):
        rig.pose.bones["pelvis"].location=(.025,0,-.012)
        rotate_global("pelvis",(0,1,0),6)
        rotate_global("spine",(0,1,0),-4)
        rotate_global("chest",(0,1,0),-2)
        rotate_global("thigh.L",(0,1,0),-6)
        rotate_global("thigh.R",(0,1,0),-3)
        rotate_global("thigh.R",(1,0,0),-9)
        rotate_global("shin.R",(1,0,0),14)
        rotate_global("foot.R",(1,0,0),4)
        rotate_global("head",(0,0,1),-7)
    bpy.context.view_layer.update()
    if frame==91:hand_on_hip("L")
    bpy.context.view_layer.update()
    evaluated=body.evaluated_get(bpy.context.evaluated_depsgraph_get())
    minimum=min((rig.matrix_world@v.co).z for v in evaluated.data.vertices)
    rig.location.z-=minimum
    bpy.context.view_layer.update()
    for pb in rig.pose.bones:
        pb.keyframe_insert(data_path="location",frame=frame)
        pb.keyframe_insert(data_path="rotation_quaternion",frame=frame)
    rig.keyframe_insert(data_path="location",frame=frame)
    scene.timeline_markers.new(label,frame=frame)
if rig.animation_data and rig.animation_data.action:rig.animation_data.action.name="AVA_Pose_Studies"
for action in bpy.data.actions:
    try:
        for layer in action.layers:
            for strip in layer.strips:
                for slot in action.slots:
                    bag=strip.channelbag(slot)
                    if bag:
                        for curve in bag.fcurves:
                            for key in curve.keyframe_points:key.interpolation="CONSTANT"
    except (AttributeError,RuntimeError):pass
scene.frame_set(1);bpy.context.view_layer.update()
body["source_file"]=SOURCE.name
body["source_sha256"]=hashlib.sha256(SOURCE.read_bytes()).hexdigest()
rig["study_frames"]="1 Original | 31 Brazos abiertos | 61 Contrapposto | 91 Mano en cintura"
rig["controls"]="FK bones in Pose Mode; Shape Keys on AVA_Mannequin control the six body studies."

def setup_world(scene):
    scene.render.engine="CYCLES";scene.cycles.samples=24;scene.cycles.use_denoising=True
    scene.render.image_settings.file_format="PNG";scene.render.resolution_percentage=100
    scene.view_settings.view_transform="Standard"
    world=bpy.data.worlds.new(scene.name+"_World");world.use_nodes=True
    nodes=world.node_tree.nodes;links=world.node_tree.links
    ambient=nodes.get("Background");ambient.inputs[0].default_value=(.72,.68,.61,1);ambient.inputs[1].default_value=.45
    backdrop=nodes.new("ShaderNodeBackground");backdrop.inputs[0].default_value=(.913,.879,.823,1);backdrop.inputs[1].default_value=1
    path=nodes.new("ShaderNodeLightPath");mix=nodes.new("ShaderNodeMixShader")
    links.new(path.outputs["Is Camera Ray"],mix.inputs[0]);links.new(ambient.outputs[0],mix.inputs[1]);links.new(backdrop.outputs[0],mix.inputs[2])
    links.new(mix.outputs[0],nodes.get("World Output").inputs[0]);scene.world=world

def light(scene,name,position,power,size,look=(0,0,1.1)):
    data=bpy.data.lights.new(name,"AREA");data.energy=power*.45;data.shape="DISK";data.size=size
    obj=bpy.data.objects.new(name,data);scene.collection.objects.link(obj);obj.location=position
    obj.rotation_euler=(Vector(look)-obj.location).to_track_quat("-Z","Y").to_euler()
def camera(scene,center,width,position=None):
    data=bpy.data.cameras.new(scene.name+"_Camera");obj=bpy.data.objects.new(data.name,data);scene.collection.objects.link(obj)
    obj.location=position or (center[0],-7,center[2])
    obj.rotation_euler=(Vector(center)-obj.location).to_track_quat("-Z","Y").to_euler()
    data.type="ORTHO";data.ortho_scale=width;scene.camera=obj
    return obj
setup_world(scene)
light(scene,"Studio_Key",(-3,-4,5),500,4)
light(scene,"Studio_Fill",(3,-2,3),220,4)
light(scene,"Studio_Rim",(1,3,4),360,3)
cam=camera(scene,(0,0,.89),1.97,(2.6,-5,1.1))
scene.render.resolution_x=900;scene.render.resolution_y=1000
# Export only the user's rigged body and six morphs.
bpy.ops.object.select_all(action="DESELECT");body.select_set(True);rig.select_set(True)
bpy.context.view_layer.objects.active=rig
bpy.ops.export_scene.gltf(filepath=str(ROOT/"ava-mannequin-study.glb"),export_format="GLB",use_selection=True,export_morph=True,export_morph_normal=True,export_animations=True,export_frame_range=True,export_force_sampling=True)
raw=SOURCE.read_bytes();chunklen=struct.unpack_from("<I",raw,12)[0];metadata=json.loads(raw[20:20+chunklen])
report={"source_sha256":body["source_sha256"],"source_metadata":metadata["asset"],"height_m":1.75,"vertices":len(body.data.vertices),"bones":len(armature.bones),"unweighted_vertices":unweighted,"morph_maximum_displacement_m":metrics,"poses":dict((str(f),label) for f,label in poses)}
(ROOT/"study.json").write_text(json.dumps(report,indent=2,ensure_ascii=False),encoding="utf-8")

def bake(name,frame=1,selected=None,crop=False):
    bpy.context.window.scene=scene;scene.frame_set(frame)
    for key in list(body.data.shape_keys.key_blocks)[1:]:key.value=1 if key.name==selected else 0
    bpy.context.view_layer.update()
    graph=bpy.context.evaluated_depsgraph_get()
    mesh=bpy.data.meshes.new_from_object(body.evaluated_get(graph),depsgraph=graph)
    if crop:
        bm=bmesh.new();bm.from_mesh(mesh)
        for point,normal in [((0,0,.72),(0,0,-1)),((0,0,1.49),(0,0,1))]:
            bmesh.ops.bisect_plane(bm,geom=list(bm.verts)+list(bm.edges)+list(bm.faces),dist=.000001,plane_co=point,plane_no=normal,clear_outer=True)
        boundary=[e for e in bm.edges if e.is_boundary]
        if boundary:bmesh.ops.holes_fill(bm,edges=boundary,sides=0)
        bmesh.ops.recalc_face_normals(bm,faces=list(bm.faces));bm.to_mesh(mesh);bm.free()
    obj=bpy.data.objects.new(name,mesh)
    for poly in mesh.polygons:poly.use_smooth=True
    return obj
try:font=bpy.data.fonts.load(str(ROOT.parents[1]/"node_modules/@fontsource/jost/files/jost-latin-400-normal.woff"))
except RuntimeError:font=bpy.data.fonts.load("C:/Windows/Fonts/segoeui.ttf")
def text(scene,label,x,z,size=.055):
    data=bpy.data.curves.new(label,"FONT");data.body=label;data.size=size;data.font=font
    data.materials.append(ink);data.align_x="CENTER"
    obj=bpy.data.objects.new(label,data);scene.collection.objects.link(obj);obj.location=(x,-.42,z);obj.rotation_euler=(math.pi/2,0,0)
    return obj
boards=[]
for name,title,cases in [
    ("Body_Deformations","Cuerpo",[(None,"Base"),("bbl","BBL"),("liposuccion","Liposucción"),("abdominoplastia","Abdominoplastia")]),
    ("Breast_Deformations","Pecho",[(None,"Base"),("aumento-de-pecho","Aumento"),("levantamiento-de-pecho","Levantamiento"),("reduccion-de-pecho","Reducción")])]:
    board=bpy.data.scenes.new(name);setup_world(board)
    light(board,name+"_Key",(-3,-4,6),850,5,look=(0,0,1.65));light(board,name+"_Fill",(4,-2,4),400,5,look=(0,0,1.65))
    camera(board,(0,0,1.64),2.95);board.render.resolution_x=2300;board.render.resolution_y=1700
    text(board,title,0,2.66,.085)
    for row in [0,1]:
        for col,(selected,label) in enumerate(cases):
            obj=bake(label+("_Front" if row==0 else "_Side"),selected=selected,crop=True)
            board.collection.objects.link(obj);obj.location=((col-1.5)*.67,0,.94 if row==0 else 0)
            obj.rotation_euler.z=0 if row==0 else math.pi/2
            text(board,label,(col-1.5)*.67,2.50 if row==0 else 1.56,.047)
    text(board,"Frente", -1.30,2.30,.032);text(board,"Perfil",-1.30,1.32,.032)
    board.render.filepath=str(RENDERS/("deformations-body.png" if name=="Body_Deformations" else "deformations-breast.png"))
    boards.append(board)
poseboard=bpy.data.scenes.new("Pose_Studies");setup_world(poseboard)
light(poseboard,"Pose_Key",(-3,-4,6),750,5);light(poseboard,"Pose_Fill",(4,-2,4),400,5);light(poseboard,"Pose_Rim",(0,3,4),400,4)
camera(poseboard,(0,0,1.04),3.3);poseboard.render.resolution_x=2600;poseboard.render.resolution_y=1800
text(poseboard,"Estudios de pose",0,2.04,.085)
for col,(frame,label) in enumerate(poses):
    obj=bake("Pose_"+label,frame=frame);poseboard.collection.objects.link(obj)
    obj.location.x=(col-1.5)*.74;obj.rotation_euler.z=-.18
    text(poseboard,label,(col-1.5)*.74,1.86,.049)
poseboard.render.filepath=str(RENDERS/"poses.png");boards.append(poseboard)
# Return the editable studio to the original pose and zero morphs.
bpy.context.window.scene=scene;scene.frame_set(1)
for key in list(body.data.shape_keys.key_blocks)[1:]:key.value=0
bpy.context.view_layer.update()
bpy.ops.object.select_all(action="DESELECT");body.select_set(True);bpy.context.view_layer.objects.active=body
for screen in bpy.data.screens:
    for area in screen.areas:
        if area.type=="VIEW_3D":
            area.spaces.active.region_3d.view_distance=2.4;area.spaces.active.region_3d.view_location=Vector((0,0,.9))
            area.spaces.active.shading.color_type="MATERIAL"
bpy.context.preferences.filepaths.save_version=0
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/"ava-mannequin-study.blend"))
print("STUDY_READY",json.dumps(report),flush=True)
for board in boards:
    if "--poses-only" in sys.argv and board.name!="Pose_Studies":continue
    bpy.context.window.scene=board
    bpy.ops.render.render(write_still=True,scene=board.name)
print("RENDERS_COMPLETE",flush=True)
