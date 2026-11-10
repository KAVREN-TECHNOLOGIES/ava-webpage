from pathlib import Path
import bpy,json,math
root=Path(__file__).resolve().parent
scene=bpy.data.scenes["Mannequin_Studio"];bpy.context.window.scene=scene
body=bpy.data.objects["AVA_Mannequin"];rig=bpy.data.objects["AVA_Pose_Rig"]
scene.frame_set(1);bpy.context.view_layer.update()
mesh=body.evaluated_get(bpy.context.evaluated_depsgraph_get()).data
rest_error=max((v.co-body.data.vertices[i].co).length for i,v in enumerate(mesh.vertices))
assert rest_error<.00001,("Bind pose changed",rest_error)
assert max(len(v.groups) for v in body.data.vertices)<=4
assert all(abs(sum(g.weight for g in v.groups)-1)<.0001 for v in body.data.vertices)
arm_mask=body.data.attributes["ArmMask"]
assert all(arm_mask.data[v.index].value>.999 for v in body.data.vertices if abs(v.co.x)>.215 and .74<v.co.z<1.00),"Hand vertices must follow the arm"
edges=[tuple(e.vertices) for e in body.data.edges]
base_lengths=[(body.data.vertices[a].co-body.data.vertices[b].co).length for a,b in edges]
results={}
for frame in [1,31,61,91]:
 scene.frame_set(frame);bpy.context.view_layer.update()
 mesh=body.evaluated_get(bpy.context.evaluated_depsgraph_get()).data
 pts=[body.matrix_world@v.co for v in mesh.vertices]
 assert all(math.isfinite(c) for p in pts for c in p)
 minimum=min(p.z for p in pts)
 assert minimum>-.0001,(frame,minimum)
 if frame==31:
  torso_error=max((pts[i]-v.co).length for i,v in enumerate(body.data.vertices) if abs(v.co.x)<.12 and 1.05<v.co.z<1.30)
  assert torso_error<.001,("Arm pose altered the torso",torso_error)
 ratios=[(pts[a]-pts[b]).length/l for (a,b),l in zip(edges,base_lengths) if l>.00001]
 extreme=sum(r>3 or r<.1 for r in ratios)
 results[frame]={"min_z":round(minimum,7),"extreme_edge_fraction":round(extreme/len(ratios),6)}
 assert extreme/len(ratios)<.01,(frame,extreme/len(ratios))
scene.frame_set(1)
for key in list(body.data.shape_keys.key_blocks)[1:]:
 key.value=1
 bpy.context.view_layer.update()
 pts=[v.co.copy() for v in body.evaluated_get(bpy.context.evaluated_depsgraph_get()).data.vertices]
 assert all(math.isfinite(c) for p in pts for c in p)
 key.value=0
for name in ["bbl","liposuccion","aumento-de-pecho"]:body.data.shape_keys.key_blocks[name].value=1
bpy.context.view_layer.update()
assert all(math.isfinite(c) for v in body.evaluated_get(bpy.context.evaluated_depsgraph_get()).data.vertices for c in v.co)
for key in list(body.data.shape_keys.key_blocks)[1:]:key.value=0
bpy.context.view_layer.update()
bpy.ops.file.pack_all()
bpy.context.preferences.filepaths.save_version=0
bpy.ops.wm.save_as_mainfile(filepath=str(root/"ava-mannequin-study.blend"),compress=True)
report={"bind_pose_maximum_error_m":rest_error,"max_vertex_influences":4,"pose_checks":results,"morphs_and_three_region_combo":"pass"}
(root/"validation.json").write_text(json.dumps(report,indent=2))
print("VALIDATION_PASS",json.dumps(report))
