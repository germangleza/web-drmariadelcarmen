import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Blog de salud con frontmatter tipado + campos E-E-A-T obligatorios.
 * ⚕️ reviewedBy es OBLIGATORIO: en contenido médico, todo artículo debe
 * estar revisado por un profesional (build falla si falta).
 */
const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string().max(70, 'Máx 70 caracteres para SEO'),
    description: z.string().min(50).max(160, 'Description entre 50-160 caracteres'),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    /** id del autor en medicalTeam (site.config.ts) */
    authorId: z.string().optional(),
    /** id del médico revisor en medicalTeam — OBLIGATORIO (YMYL/E-E-A-T) */
    reviewedBy: z.string({ required_error: '⚕️ Todo artículo médico necesita reviewedBy (id de medicalTeam)' }),
    /** Fecha de la última revisión médica */
    reviewDate: z.coerce.date(),
    image: z.string().optional(),
    tags: z.array(z.string()).default([]),
    /** Fuentes citadas (URLs a estudios/instituciones) — refuerza E-E-A-T y GEO */
    sources: z.array(z.object({ title: z.string(), url: z.string().url() })).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
