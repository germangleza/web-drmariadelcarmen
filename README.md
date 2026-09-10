# ⚕️ Astro Template — Salud (SEO + GEO + E-E-A-T listo)

Template para clínicas, consultorios, dentistas y sitios médicos. Preconfigurado para los requisitos **YMYL** que Google exige a contenido de salud.

## ¿Qué incluye además del SEO base?

| Feature | Por qué importa en salud |
|---|---|
| **Schema médico** | MedicalClinic / Physician / Dentist con especialidades, geo, horarios y equipo |
| **MedicalWebPage + reviewedBy** | Cada artículo lleva schema de revisión médica con credenciales |
| **Bloque "Revisado médicamente por..."** | Señal E-E-A-T visible con foto, cédula profesional y fecha de revisión |
| **Revisión médica OBLIGATORIA** | El build FALLA si un post no tiene `reviewedBy` + `reviewDate` |
| **Fuentes citadas** | Sección de referencias autogenerada desde el frontmatter |
| **Disclaimer médico** | Aviso automático al final de cada artículo |
| **Página /equipo** | Perfiles con cédulas y schema Physician, generada desde el config |
| **SEO local** | Geo + horarios + isAcceptingNewPatients (clave para "cerca de mí") |
| **GEO** | llms.txt, FAQPage schema y robots.txt con crawlers de IA permitidos |

Más todo lo del template base: sitemap, RSS, Open Graph, canonical, breadcrumbs, CI.

## Setup (5 minutos)

1. "Use this template" en GitHub → nuevo repo → clonar → `npm install`
2. Editar `src/config/site.config.ts`:
   - Datos del negocio (tipo de entidad médica, dirección, geo, horarios)
   - **`medicalTeam`**: cada médico con nombre, cédula profesional, foto y bio
3. Subir fotos del equipo a `public/team/`
4. Sustituir `favicon.svg`, `logo.png`, `og-default.png`
5. Conectar a Vercel/Netlify/Cloudflare Pages

## Escribir un artículo médico

```markdown
---
title: "Título (máx 70 chars)"
description: "Description para Google (50-160 chars)"
pubDate: 2026-07-23
authorId: "dra-ejemplo"        # id en medicalTeam
reviewedBy: "dra-ejemplo"      # OBLIGATORIO — id en medicalTeam
reviewDate: 2026-07-23         # OBLIGATORIO
sources:
  - title: "OMS — Nombre del recurso"
    url: "https://www.who.int/..."
---

Contenido en Markdown...
```

Push → bloque de revisión, schema MedicalWebPage, fuentes, disclaimer, sitemap, RSS y llms.txt se actualizan solos.

## Checklist YMYL antes de lanzar

- [ ] Todos los médicos en `medicalTeam` con cédula profesional real
- [ ] Fotos reales del equipo (no stock) en `/public/team/`
- [ ] Página /equipo revisada
- [ ] Coordenadas geo correctas (Google Maps → clic derecho → copiar coordenadas)
- [ ] Perfil de Google Business vinculado al mismo dominio, teléfono y dirección (NAP consistente)
- [ ] Validar schema en [Rich Results Test](https://search.google.com/test/rich-results)
- [ ] Search Console + sitemap enviado
