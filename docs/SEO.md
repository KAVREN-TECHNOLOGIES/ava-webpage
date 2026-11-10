# SEO y rutas bilingües de AVA

Dominio confirmado: **https://avacosmetic.com**. Español conserva las rutas originales; inglés utiliza `/en` y nombres traducidos, por ejemplo `/procedimientos/liposuccion` y `/en/procedures/liposuction`.

## Mantenimiento

- `src/data/routes.ts`: 25 páginas con URL, título y descripción en cada idioma. Los nueve procedimientos toman su contenido de `src/data/procedures.ts` y tienen un slug inglés explícito.
- `src/data/site.ts`: dominio, nombre público y locales de las tarjetas sociales.
- `src/data/company.ts`: dirección proporcionada por la empresa. No completar teléfonos, horarios, coordenadas ni credenciales con datos estimados.
- `src/lib/seo.ts`: canonical, hreflang recíprocos `es`/`en`/`x-default`, Open Graph, Twitter y JSON-LD. La metadata de navegación y la del HTML inicial utilizan el mismo generador.
- `src/lib/LocalizedRouting.tsx`: enlaces internos y cambio al equivalente traducido. El idioma procede de la URL; consultas, fragmentos y valores del formulario se conservan al cambiarlo.
- `src/lib/searchParams.ts`: aplica combos y filtros después de hidratar el HTML canónico, evitando discrepancias al abrir enlaces con parámetros.

## Compilación y comprobación

Ejecutar `npm run build`, después `npm run check:seo`. Ejecutar `npm test` para comprobar navegación, metadata, formularios y la hidratación de enlaces con parámetros.

El build produce 50 páginas HTML completas en `dist`, además de `robots.txt`, `sitemap.xml` y dos páginas 404 con `noindex`. El bundle de renderizado y el manifiesto de comprobación quedan fuera de `dist`, en `.prerender`.

`npm run preview` permite comprobar las URLs limpias y las respuestas HTTP locales. `vercel.json` configura URLs sin `.html`, sin barra final y la redirección permanente de `/variante-apollo`. En otro alojamiento se debe servir cada ruta desde su archivo HTML correspondiente y responder 404 a las rutas desconocidas; una redirección general al HTML de inicio anularía el prerenderizado por página.

## Datos estructurados y GEO

La entidad `MedicalClinic` mantiene el mismo identificador en ambos idiomas, el nombre público de AVA y su dirección. Los procedimientos publicados incluyen `Service`, `MedicalProcedure` y `MedicalWebPage`, con texto y fuente médica ya presentes en la página. El FAQ de recursos utiliza sus seis preguntas y respuestas visibles. No se añaden reseñas, precios, certificaciones, autores médicos ni horarios sin verificar.

El contenido está disponible como HTML legible y conectado mediante enlaces y entidades coherentes. Esto sigue las [pautas de Google para búsqueda con IA](https://developers.google.com/search/docs/appearance/ai-features) y sus [recomendaciones para versiones localizadas](https://developers.google.com/search/docs/specialty/international/localized-versions). No garantiza posiciones, citas en IA ni resultados enriquecidos.

Esta preparación es local. No publica el sitio, cambia DNS ni verifica o envía la propiedad a Search Console.
