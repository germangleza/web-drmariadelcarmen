# Instrucciones para Claude Code

Este es un sitio Astro de la **vertical SALUD**, basado en un template estandarizado con SEO/GEO y señales E-E-A-T preconfiguradas. Google trata sitios médicos como YMYL: las reglas de abajo existen por eso y no deben saltarse.

## Arquitectura

- **`src/config/site.config.ts`** — ÚNICO archivo de configuración. Datos del negocio médico (tipo de entidad, especialidades, geo, horarios), equipo médico (`medicalTeam`), redes, blog. Todo el sitio se alimenta de aquí. Cuando el usuario pida cambiar datos, edita este archivo.
- **`medicalTeam` en el config** — Cada médico tiene un `id` que se usa en el frontmatter de los posts (`authorId`, `reviewedBy`). Para agregar un médico nuevo, se agrega aquí, no en las páginas.
- **`src/content/blog/`** — Posts en Markdown con validación Zod estricta (`src/content.config.ts`).
- **`src/components/schema/`** — JSON-LD médico (MedicalClinic/Physician, MedicalWebPage, FAQ, Breadcrumb). Reutilizar, no escribir JSON-LD inline.
- **`src/components/MedicalReviewBlock.astro`** — Bloque visible "Revisado médicamente por...". Se renderiza solo desde el frontmatter.
- **`src/pages/equipo.astro`** — Se genera desde `medicalTeam`. No editar médicos aquí.
- **`robots.txt.ts` y `llms.txt.ts`** — Dinámicos. No crear versiones estáticas.

## Reglas OBLIGATORIAS para posts médicos (el build falla si no se cumplen)

```yaml
---
title: "Máximo 70 caracteres"
description: "Entre 50 y 160 caracteres"
pubDate: 2026-01-15
authorId: "id-del-medico"      # opcional, debe existir en medicalTeam
reviewedBy: "id-del-medico"    # OBLIGATORIO — debe existir en medicalTeam
reviewDate: 2026-01-15         # OBLIGATORIO
sources:                       # muy recomendado: estudios/instituciones
  - title: "Nombre de la fuente"
    url: "https://..."
---
```

- **NUNCA crear un post sin `reviewedBy` y `reviewDate`.** Si el usuario pide un post y no dice quién lo revisa, preguntar o usar un médico existente de `medicalTeam` y avisarle.
- Verificar que los ids de `authorId`/`reviewedBy` existan en `medicalTeam` antes de commitear.
- Al actualizar contenido médico, actualizar también `reviewDate` y `updatedDate`.
- Preferir fuentes institucionales (OMS, NIH, secretarías de salud, papers) en `sources`.
- No hacer afirmaciones médicas absolutas en el contenido; el disclaimer se agrega solo.

## Flujo de trabajo

1. Antes de cualquier commit: `npm run build`.
2. Deploy automático al hacer push a main.

## Al configurar un proyecto nuevo desde este template

1. Editar `site.config.ts`: tipo de entidad médica correcto (MedicalClinic/Physician/Dentist/MedicalOrganization), dirección y geo reales, horarios, y `medicalTeam` con cédulas profesionales reales.
2. Llenar `cliente.json` (datos del cliente: nombre, vertical, dominio, estatus, inicio) y `client-brief.md` (brief completo: negocio, audiencia, posicionamiento, SEO y médicos revisores). Ambos están en la raíz con valores placeholder.
3. Ponerle al repo el topic `maguey-cliente` en GitHub.
4. Recordar al usuario: fotos reales del equipo en `public/team/` (no stock), favicon, logo, og-default.png (1200x630).
5. Recordar consistencia NAP: mismo nombre, dirección y teléfono que en Google Business.

## NO hacer

- No crear posts sin revisión médica (frontmatter incompleto).
- No hardcodear datos del negocio o médicos en páginas — todo sale de `site.config.ts`.
- No agregar meta tags sueltos — usar props del BaseLayout.
- No inventar cédulas profesionales ni credenciales: si faltan datos reales, dejar el placeholder y avisar al usuario.
