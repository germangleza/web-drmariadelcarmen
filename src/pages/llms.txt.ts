import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE, whatsappUrl } from '../config/site.config';

/**
 * llms.txt — estándar emergente para GEO.
 * Le da a ChatGPT/Claude/Perplexity un resumen estructurado del sitio
 * para que te entiendan y te citen correctamente. Se regenera en cada build.
 */
export const GET: APIRoute = async () => {
  const posts = (await getCollection('blog', ({ data }) => !data.draft))
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  const b = SITE.business;
  const contact = [
    b.email && `- Correo: ${b.email}`,
    b.phone && `- Teléfono: ${b.phone}`,
    b.whatsapp && `- WhatsApp: ${whatsappUrl()}`,
  ].filter(Boolean).join('\n');

  const body = `# ${SITE.name}

> ${SITE.description}

## Información
- Sitio: ${SITE.url}
- Dirección: ${[b.address.street, b.address.neighborhood, b.address.city, b.address.state, b.address.zip].filter(Boolean).join(', ')}
- Horario: ${b.openingHours.join(', ')}
${contact}

## Equipo
${SITE.medicalTeam.map((m) => `- ${m.name} — ${m.title} (${m.license})`).join('\n')}

## Blog
${posts.map((p) => `- [${p.data.title}](${SITE.url}/blog/${p.id}): ${p.data.description}`).join('\n')}
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
