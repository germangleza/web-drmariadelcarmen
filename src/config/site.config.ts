/**
 * ⚙️ CONFIGURACIÓN CENTRAL — VERTICAL SALUD
 * ÚNICO archivo a editar por proyecto. Todo el sitio se alimenta de aquí.
 *
 * ⚕️ Sitios de salud son YMYL (Your Money or Your Life): Google exige
 * señales E-E-A-T extra. Este config incluye los campos médicos necesarios.
 */

export const SITE = {
  // === Básicos ===
  name: 'Clínica Ejemplo',
  url: 'https://ejemplo.com',                // Dominio final SIN slash al final
  title: 'Clínica Ejemplo — Especialidad en una frase',
  description: 'Descripción del sitio en 150-160 caracteres. Aparece en Google y redes.',
  locale: 'es_MX',
  lang: 'es',

  // === Marca ===
  logo: '/logo.png',
  ogImage: '/og-default.png',                // 1200x630
  themeColor: '#0e7490',

  // === Negocio médico (para schema MedicalClinic/Physician) ===
  business: {
    /**
     * Tipo de entidad médica según schema.org:
     * 'MedicalClinic'      → clínicas y consultorios
     * 'Physician'          → médico individual / consultorio personal
     * 'Dentist'            → dentistas
     * 'MedicalOrganization'→ hospitales, laboratorios, organizaciones grandes
     */
    type: 'MedicalClinic' as 'MedicalClinic' | 'Physician' | 'Dentist' | 'MedicalOrganization',
    legalName: 'Clínica Ejemplo S.A. de C.V.',
    email: 'contacto@ejemplo.com',
    phone: '+52 55 0000 0000',
    /** Especialidades médicas (schema medicalSpecialty). Valores válidos:
     *  Cardiovascular, Dermatology, Pediatric, Psychiatric, PrimaryCare,
     *  Dentistry, Nutrition, Physiotherapy, PlasticSurgery, Gynecologic, etc. */
    specialties: ['PrimaryCare'] as string[],
    address: {
      street: 'Av. Ejemplo 123, Col. Centro',
      city: 'Ciudad de México',
      state: 'CDMX',
      zip: '06000',
      country: 'MX',
    },
    geo: { lat: 19.4326, lng: -99.1332 },    // Clave para "cerca de mí"
    openingHours: ['Mo-Fr 09:00-19:00', 'Sa 09:00-14:00'],
    /** ¿Acepta pacientes nuevos? (aparece en resultados de Google) */
    acceptingNewPatients: true,
    priceRange: '$$',                        // $, $$, $$$
  },

  // === Equipo médico (E-E-A-T: Google necesita saber QUIÉN atiende) ===
  // Estos perfiles alimentan la página /equipo y los bloques de autor del blog.
  medicalTeam: [
    {
      id: 'dra-ejemplo',                     // Se usa en frontmatter del blog: reviewedBy
      name: 'Dra. Nombre Ejemplo',
      title: 'Médico Cirujano, Especialista en Medicina Interna',
      license: 'Céd. Prof. 0000000',         // Cédula profesional — señal de confianza clave
      licenseSpecialty: 'Céd. Esp. 0000000', // Cédula de especialidad (si aplica)
      university: 'UNAM',
      photo: '/team/dra-ejemplo.jpg',
      bio: 'Breve biografía profesional de 2-3 líneas con años de experiencia y enfoque.',
      sameAs: [] as string[],                // LinkedIn, Doctoralia, etc. — refuerza E-E-A-T
    },
  ],

  // === Redes sociales ===
  socials: {
    twitter: '',
    instagram: '',
    facebook: '',
    linkedin: '',
    youtube: '',
    tiktok: '',
  },

  // === Blog ===
  blog: {
    title: 'Blog de salud',
    description: 'Información médica confiable, revisada por especialistas.',
    postsPerPage: 10,
    defaultAuthor: 'Equipo Médico',
    /** Aviso mostrado al final de cada artículo (obligación ética + protección legal) */
    disclaimer:
      'Este contenido es informativo y no sustituye una consulta médica. Si tienes síntomas o dudas sobre tu salud, consulta a un profesional.',
  },

  // === Analytics ===
  analytics: {
    plausibleDomain: '',
    googleAnalyticsId: '',
  },
} as const;

export type SiteConfig = typeof SITE;
export type TeamMember = (typeof SITE.medicalTeam)[number];

export function socialUrls(): string[] {
  const s = SITE.socials;
  return [
    s.twitter && `https://twitter.com/${s.twitter}`,
    s.instagram && `https://instagram.com/${s.instagram}`,
    s.facebook && `https://facebook.com/${s.facebook}`,
    s.linkedin && `https://linkedin.com/company/${s.linkedin}`,
    s.youtube && `https://youtube.com/@${s.youtube}`,
    s.tiktok && `https://tiktok.com/@${s.tiktok}`,
  ].filter(Boolean) as string[];
}

export function getTeamMember(id: string): TeamMember | undefined {
  return SITE.medicalTeam.find((m) => m.id === id);
}
