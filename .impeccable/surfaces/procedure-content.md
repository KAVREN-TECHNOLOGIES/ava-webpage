# Contenido de procedimientos — 11 de noviembre de 2026

El usuario solicita ampliar cada ficha con tratamiento y beneficios, orientados al cliente y a la consulta, e investigar la competencia. Se conserva el sistema editorial aprobado: introducción con fotografía y llamada a consulta, seguida de filas de lectura abiertas. No se cambian imágenes, estilos, rutas, formulario ni datos de la empresa.

`src/data/procedures.ts` contiene ahora siete bloques originales por procedimiento en español e inglés: introducción, beneficios, proceso, elección/evaluación, recuperación, resultado y decisión/riesgos. Los nueve procedimientos tienen aproximadamente 370–400 palabras en español y 300–345 en inglés. La sección compartida se titula «Beneficios y tratamiento»; se retira la antigua nota genérica porque cada ficha ya contiene sus consideraciones específicas. Los resúmenes del carrusel y del directorio no se amplían.

La investigación y el criterio de adaptación están en [procedure-research.md](../../docs/procedure-research.md). A&E, Avana y 305 informan cobertura y lenguaje comercial; ASPS y FDA contrastan el contenido médico. La orientación comercial se apoya en beneficios posibles y objetivos concretos, sin garantías ni credenciales trasladadas de otras clínicas.

## Verificación

Se completaron una revisión de cobertura y fuentes, una revisión editorial de diferencias entre procedimientos y traducciones, y una comprobación del resultado renderizado. Los 59 tests existentes pasan. La compilación y la verificación SEO de las 50 páginas pasan. Una inspección del HTML de las 18 fichas confirma una introducción y seis filas de contenido en cada idioma, un único h1 y ausencia de párrafos repetidos dentro de cada página.

Los controles del navegador cubren liposucción en escritorio (1440×1000), aumento en inglés en escritorio (1440×1000), BBL en tablet (1024×1366), rinoplastia en móvil (390×844) y reducción en inglés en móvil (390×844). No se detectaron desbordamiento horizontal ni párrafos recortados. Capturas, métricas y el copy renderizado se guardan en `.impeccable/review/procedure-expansion/`. Se retiró la configuración temporal de tamaño del navegador al terminar.
