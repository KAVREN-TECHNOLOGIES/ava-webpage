# Estudios del maniquí AVA

El archivo editable es ava-mannequin-study.blend. La escena principal es Mannequin_Studio.

## Deformaciones
Seleccionar AVA_Mannequin y abrir Shape Keys. Los seis controles van de 0 a 1:
- bbl
- liposuccion
- abdominoplastia
- aumento-de-pecho
- levantamiento-de-pecho
- reduccion-de-pecho

Se pueden combinar las zonas de cuerpo con una opción de pecho.

## Poses
La línea de tiempo mantiene cuatro poses:
- Fotograma 1: original.
- Fotograma 31: brazos abiertos.
- Fotograma 61: contrapposto.
- Fotograma 91: mano en cintura.

El esqueleto AVA_Pose_Rig tiene 19 huesos editables en Pose Mode.

Las otras tres escenas contienen las comparativas renderizadas. Las imágenes están en renders/.
ava-mannequin-study.glb incluye el esqueleto, los seis morph targets y el clip AVA_Pose_Studies.

## Regeneración
Ejecutar build_study.py con Blender 5.2 en segundo plano y configuración de fábrica.
El argumento --poses-only regenera únicamente la imagen de poses, además de actualizar los archivos 3D.
validate_study.py comprueba la pose original, los pesos, las cuatro poses, las seis deformaciones y un combo de tres zonas. También empaqueta las fuentes y comprime el archivo Blender.

La copia del modelo recibido está en source/. study.json conserva la huella SHA-256 y los metadatos originales.
