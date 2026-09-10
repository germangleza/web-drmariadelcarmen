/**
 * ⚙️ CONFIGURACIÓN CENTRAL — VERTICAL SALUD
 * ÚNICO archivo a editar por proyecto. Todo el sitio se alimenta de aquí.
 *
 * ⚕️ Sitios de salud son YMYL (Your Money or Your Life): Google exige
 * señales E-E-A-T extra. Este config incluye los campos médicos necesarios.
 */

export const SITE = {
  // === Básicos ===
  name: 'Dra. María del Carmen Estética Dental',
  url: 'https://ejemplo.com',                // TODO: dominio final SIN slash al final
  title: 'Estética Dental en Tuxtla Gutiérrez | Dra. María del Carmen Juárez',
  description:
    'Carillas, resinas y diseño de sonrisa con el mínimo desgaste de tu diente. Ves el resultado en pantalla antes de empezar. Lunes a sábado en Col. Penipak, Tuxtla.',
  locale: 'es_MX',
  lang: 'es-MX',

  // === Marca ===
  logo: '/logo.png',                         // Subir a public/logo.png (si no existe se muestra el nombre en texto)
  ogImage: '/og-default.png',                // 1200x630
  themeColor: '#3B2A8E',

  // === Negocio médico (para schema MedicalClinic/Physician) ===
  business: {
    /**
     * Tipo de entidad médica según schema.org:
     * 'MedicalClinic'      → clínicas y consultorios
     * 'Physician'          → médico individual / consultorio personal
     * 'Dentist'            → dentistas
     * 'MedicalOrganization'→ hospitales, laboratorios, organizaciones grandes
     */
    type: 'Dentist' as 'MedicalClinic' | 'Physician' | 'Dentist' | 'MedicalOrganization',
    legalName: '',                           // Razón social (si aplica); vacío = se usa `name`
    email: '',
    phone: '+52 961 668 3790',
    /** Número de WhatsApp en formato internacional sin "+" ni espacios (wa.me) */
    whatsapp: '529616683790',
    /** Licencia sanitaria / aviso de funcionamiento COFEPRIS del establecimiento */
    cofepris: '2407012002A00236',
    /** Especialidades médicas (schema medicalSpecialty). Valores válidos:
     *  Cardiovascular, Dermatology, Pediatric, Psychiatric, PrimaryCare,
     *  Dentistry, Nutrition, Physiotherapy, PlasticSurgery, Gynecologic, etc. */
    specialties: ['Dentistry'] as string[],
    address: {
      street: '20 Poniente Sur 1195-D, entre 10 y 12 Sur',
      neighborhood: 'Col. Penipak',
      city: 'Tuxtla Gutiérrez',
      state: 'Chiapas',
      zip: '29060',
      country: 'MX',
    },
    geo: { lat: 16.748123, lng: -93.140493 }, // Clave para "cerca de mí"
    openingHours: ['Mo-Fr 09:00-20:30', 'Sa 10:00-16:30'],
    /** Enlace "Cómo llegar" (Google Maps / Google Business) */
    mapsUrl: 'https://share.google/uyT6LKYCROwN8vK83',
    /** URL del iframe de Google Maps (Compartir → Insertar un mapa) */
    mapsEmbedUrl:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7641.14684309689!2d-93.14049338811525!3d16.748123183967536!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85ecd92ceb051713%3A0x8d2176bc865df5de!2sDra%20Mar%C3%ADa%20del%20Carmen%20Estetica%20Dental!5e0!3m2!1ses-419!2smx!4v1789068606287!5m2!1ses-419!2smx',
    /** ¿Acepta pacientes nuevos? (aparece en resultados de Google) */
    acceptingNewPatients: true,
    priceRange: '$$',                        // $, $$, $$$
  },

  // === Equipo médico (E-E-A-T: Google necesita saber QUIÉN atiende) ===
  // Estos perfiles alimentan la página /equipo, la sección "La doctora" del inicio
  // y los bloques de autor del blog. El primer miembro es la doctora titular.
  medicalTeam: [
    {
      id: 'dra-maria-del-carmen',            // Se usa en frontmatter del blog: reviewedBy
      name: 'Dra. María del Carmen Juárez Farrera',
      title: 'Cirujano dentista',
      license: 'Céd. Prof. 5112969',         // Cédula profesional — señal de confianza clave
      licenseSpecialty: '',                  // Cédula de especialidad (si aplica)
      university: '',                        // TODO: universidad de egreso (dato real, no inventar)
      photo: '/team/dra-maria-del-carmen.jpg', // Subir a public/team/ — vertical 4:5, fondo claro
      bio: 'Hace tu valoración y tu diagnóstico. Si tu caso es estético, lo trabaja ella. Si necesitas un especialista (ortodoncia, endodoncia, implantes, cirugía o atención infantil), te canaliza con uno de los doctores de su equipo, en la misma clínica.',
      sameAs: [] as string[],                // LinkedIn, Doctoralia, etc. — refuerza E-E-A-T
    },
  ],

  // === Redes sociales ===
  socials: {
    twitter: '',
    instagram: 'clinica_dra_mariadelcarmen',
    facebook: '',
    linkedin: '',
    youtube: '',
    tiktok: '',
  },

  // === Blog ===
  blog: {
    title: 'Blog de salud dental',
    description: 'Información sobre estética y salud dental, revisada por la doctora.',
    postsPerPage: 10,
    defaultAuthor: 'Equipo de la clínica',
    /** Aviso mostrado al final de cada artículo (obligación ética + protección legal) */
    disclaimer:
      'Este contenido es informativo y no sustituye una valoración profesional. Si tienes dudas sobre tu salud dental, consulta a un profesional.',
  },

  // === Analytics ===
  analytics: {
    plausibleDomain: '',
    googleAnalyticsId: '',                   // G-XXXXXXXXXX
    /** Etiqueta de conversión de Google Ads (AW-XXXXXXXXX/XXXXXXXX) para clics a WhatsApp */
    googleAdsConversion: '',
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

/** Enlace a WhatsApp con mensaje prellenado opcional. */
export function whatsappUrl(message?: string): string {
  const base = `https://wa.me/${SITE.business.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
