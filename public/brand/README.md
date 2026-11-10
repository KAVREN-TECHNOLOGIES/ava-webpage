# AVA · Archivos de marca

Los trazados originales proceden de la página 6 de `AVABrandBook.pdf`, facilitado por el usuario. Se extrajeron como vectores, sin sustituir la tipografía ni alterar la composición del logotipo.

- `ava-lockup.svg`: espresso para fondos claros.
- `ava-lockup-ivory.svg`: marfil para fondos oscuros.
- `ava-lockup-bronze.svg`: bronce para fondos espresso o cacao.
- `../favicon.svg`: la A original del documento sobre espresso.

Los tres lockups conservan el descriptor **COSMETIC SURGERY · MIAMI** y tienen fondo transparente. Se preservan como archivos maestros originales.

La cabecera y el pie utilizan `src/components/BrandLogo.tsx`: conserva los trazados exactos de AVA de `src/data/brand.ts` y adapta el descriptor a dos líneas para su lectura en pantalla. **COSMETIC SURGERY** se presenta en Jost Medium a 12 px y **MIAMI** a 10 px, sin reducirse en móvil. Las letras de gran formato del pie también reutilizan los trazados originales, sin sustituirlos por tipografía.
