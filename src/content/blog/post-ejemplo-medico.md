---
title: "Post de ejemplo médico: cómo publicar en este blog"
description: "Ejemplo de artículo de salud con revisión médica, fuentes y frontmatter completo. Duplica este archivo para crear posts nuevos."
pubDate: 2026-01-15
authorId: "dra-ejemplo"
reviewedBy: "dra-ejemplo"
reviewDate: 2026-01-15
tags: ["ejemplo"]
sources:
  - title: "Organización Mundial de la Salud"
    url: "https://www.who.int/es"
draft: false
---

## Cómo funciona este blog

1. Duplica este archivo en `src/content/blog/`
2. Llena el frontmatter — **`reviewedBy` y `reviewDate` son obligatorios** (el build falla sin ellos)
3. Los ids de `authorId`/`reviewedBy` deben existir en `medicalTeam` dentro de `site.config.ts`
4. Push → el bloque de "Revisado médicamente por", el schema MedicalWebPage, las fuentes y el disclaimer se generan solos

## Por qué es obligatoria la revisión médica

Google clasifica el contenido de salud como YMYL y exige señales E-E-A-T: quién escribió, quién revisó, con qué credenciales y cuándo. Este template lo fuerza a nivel técnico para que ningún artículo salga sin esas señales.

## Fuentes

Agrega URLs de estudios o instituciones en el campo `sources` del frontmatter. Aparecen como sección numerada al final y refuerzan la confianza (para Google, para los LLMs y para tus pacientes).
