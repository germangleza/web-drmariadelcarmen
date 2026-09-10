# Instrucciones: transformar este template a la VERTICAL SEGUROS

> Este repo es una copia del template de la vertical SALUD (`maguey-web-salud`).
> Tu tarea es transformarlo en el template de la vertical **SEGUROS**, orientado a
> **agentes de seguros** y **promotorías** en México.
> El resultado debe replicar la estructura de https://www.magueystudio.mx/agente —
> el **Anexo** al final de este archivo contiene el copy completo de esa página:
> úsalo como copy placeholder por defecto del template, sustituyendo los datos de
> "Daniel Herrera" por los valores del config.
>
> Al terminar TODO (build verde incluido), **borra este archivo** y actualiza
> CLAUDE.md como se indica abajo.

## Contexto y decisiones ya tomadas (no re-decidir)

1. **Un solo template, dos modos.** `site.config.ts` tendrá `mode: 'agente' | 'promotoria'`.
   Comparten ~90% del sitio; el modo cambia: el JSON-LD, el copy (yo/nosotros) y
   la sección de **reclutamiento**, exclusiva del modo promotoría.
2. **Seguros también es YMYL** ("Your Money"): las señales E-E-A-T del template de
   salud NO se eliminan, se adaptan. La cédula profesional médica se convierte en
   **cédula de agente de seguros (CNSF, tipo A/B/C)**. El bloque de revisión médica
   se convierte en bloque de autor/asesor.
3. **Dos variantes de contacto, cada sitio usa UNA**, elegida por config
   (`contact.variant: 'form' | 'cta'`). Ambas se construyen. Ver sección 4.
4. La arquitectura NO cambia: `site.config.ts` sigue siendo el ÚNICO archivo de
   configuración, el blog sigue con validación Zod, y `robots.txt.ts`,
   `llms.txt.ts`, sitemap y RSS siguen dinámicos.
5. El copy narrativo (hero, "empieza aquí", proceso) vive en las páginas con el
   texto del Anexo como default. Todo dato de identidad (nombres, ciudad,
   teléfonos, años de experiencia, productos, FAQ, testimonios) sale del config.

## 1. `site.config.ts` — nueva forma

Reescribe el config manteniendo el patrón actual (objeto `SITE as const`, tipos
exportados, helpers). Estructura objetivo:

```ts
export const SITE = {
  // === Básicos === (igual que ahora: name, url, title, description, locale, lang)
  // === Marca === (igual: logo, ogImage, themeColor)

  // === Modo del sitio ===
  mode: 'agente' as 'agente' | 'promotoria',

  // === Negocio ===
  business: {
    legalName: '...',
    email: 'hola@ejemplo.mx',
    phone: '+52 55 0000 0000',
    whatsapp: '5255...',           // solo dígitos con lada país, para wa.me
    address: { street, city, state, zip, country },
    geo: { lat, lng },
    serviceArea: 'Atención en todo México',  // línea "Ciudad de México · Atención en todo México"
    openingHours: ['Mo-Fr 09:00-18:00'],
    priceRange: '$$',
  },

  // === Soluciones / productos (cada uno con su CTA propio) ===
  productos: [
    // { id: 'vida', name: 'Seguro de vida',
    //   tagline: 'Protección financiera para quienes más te importan',
    //   description: '...', ctaLabel: 'Calcular mi protección' }
    // Defaults del Anexo: vida, retiro (PPR), gmm, auto.
  ],

  // === Diferenciadores (grid bajo el hero, 4 items) ===
  valueProps: [
    // { title: 'Asesoría sin tecnicismos', description: 'Explicamos cada cobertura con claridad' }
    // Defaults: los 4 del Anexo.
  ],

  // === Aseguradoras que representa (señal de confianza clave) ===
  aseguradoras: [
    // { name: 'GNP Seguros', logo: '/aseguradoras/gnp.png' }
  ],

  // === Asesores (E-E-A-T: quién asesora) ===
  // En modo 'agente' normalmente hay 1; en 'promotoria', varios.
  team: [
    {
      id: 'asesor-ejemplo',        // se usa en frontmatter del blog: authorId/reviewedBy
      name: 'Nombre Ejemplo',
      title: 'Asesor de Seguros y Protección Financiera',
      license: 'Cédula CNSF 000000',  // tipo A/B/C — NUNCA inventarla; placeholder si falta
      photo: '/team/asesor-ejemplo.jpg',
      bio: '2-3 líneas: enfoque y acompañamiento.',
      sameAs: [] as string[],
    },
  ],

  // === Cifras/bullets de confianza del bloque "Conoce a tu asesor" ===
  stats: [
    // { value: '11+', label: 'años de experiencia' }
    // { label: 'Vida, retiro, gastos médicos y autos' }   // value opcional
  ],

  // === Testimonios ===
  testimonials: [
    // { quote: '...', author: 'Cliente', context: 'Seguro de vida', stars: 5 }
    // Mantener el aviso del Anexo: "Sustituir por testimonios reales con autorización del cliente."
  ],

  // === FAQ (alimenta la sección y el FAQSchema) ===
  faq: [
    // { q: '¿La asesoría tiene costo?', a: '...' }
    // Defaults: las 8 preguntas del Anexo (redactar respuestas breves y honestas).
  ],

  // === Quiz de orientación (sección "ORIENTACIÓN GRATUITA") ===
  quiz: { enabled: true },

  // === Contacto (ver sección 4) ===
  contact: {
    variant: 'form' as 'form' | 'cta',
    formAction: '',                // endpoint del form (Formspree o similar); placeholder
    whatsappMessage: 'Hola, me interesa una asesoría de seguros.',
    calendarUrl: '',               // Calendly o similar, para "Agendar una llamada"
    privacyUrl: '/aviso-de-privacidad',
  },

  // === Reclutamiento (SOLO se renderiza en mode: 'promotoria') ===
  recruitment: {
    enabled: true,
    headline: 'Únete como agente',
    pitch: 'Por qué desarrollarte con esta promotoría (2-3 líneas).',
    benefits: [] as string[],      // p.ej. 'Capacitación y cédula', 'Comisiones competitivas'
    ctaLabel: 'Quiero ser agente',
  },

  // === Redes sociales === (igual que ahora)
  // === Blog === (igual, con el disclaimer nuevo — ver sección 5)
  // === Analytics === (igual)
}
```

Elimina del config todo lo médico (`specialties`, `acceptingNewPatients`,
`medicalTeam`, cédulas de especialidad). Renombra el helper `getTeamMember` para
que lea de `team`.

## 2. Schema JSON-LD (`src/components/schema/`)

- El schema principal deja de ser MedicalClinic/Physician. En **ambos modos** emite
  **`InsuranceAgency`** (subtipo de LocalBusiness: conserva address, geo,
  openingHours, priceRange → SEO local intacto).
- En modo `agente`, emite además un **`Person`** enlazado (`employee`/`founder`)
  con `jobTitle` y su cédula en `hasCredential`.
- Renombra/reescribe: `MedicalArticleSchema` → consolidar en un solo
  `ArticleSchema` con author `Person`. El schema de organización médica se
  convierte en `InsuranceAgencySchema.astro`.
- `FAQSchema` ahora se alimenta de `SITE.faq`. Breadcrumb y WebSite igual.
- Regla intacta: JSON-LD solo desde estos componentes, nunca inline.

## 3. Home (`index.astro`) — secciones en este orden

Replica la estructura del Anexo (cada sección con su "eyebrow" en mayúsculas):

1. **Hero** — eyebrow "SEGUROS Y PROTECCIÓN FINANCIERA", H1, subtítulo, 2 CTAs
   ("Solicitar asesoría" → ancla a contacto; "Conocer soluciones" → ancla a
   soluciones), 4 bullets de confianza, foto del asesor con caption
   `{ciudad} · {serviceArea}`. En modo promotoría: foto/identidad de la promotoría.
2. **Diferenciadores** — grid de 4 desde `valueProps`.
3. **EMPIEZA AQUÍ** — bloque de empatía (copy del Anexo) + CTA "Quiero recibir
   asesoría". En modo promotoría, redactar en plural ("Nuestro trabajo es…").
4. **SOLUCIONES DE PROTECCIÓN** — cards desde `productos`: name, tagline,
   description y CTA propio (`ctaLabel`) que ancla a contacto (o abre WhatsApp
   con mensaje prellenado del producto, si `variant: 'cta'`).
5. **ORIENTACIÓN GRATUITA (quiz)** — solo si `quiz.enabled`. Ver sección 5.
6. **CONOCE A TU ASESOR / CONOCE A TU EQUIPO** (según modo) — foto, bio,
   bullets desde `stats`, CTA "Hablar con {nombre}". En promotoría lista los
   asesores de `team`.
7. **PROCESO** — 5 pasos (copy del Anexo, en plural si promotoría) + CTA.
8. **RECLUTAMIENTO** — **solo `mode: 'promotoria'`** y `recruitment.enabled`:
   headline, pitch, benefits, CTA (abre WhatsApp o el form con asunto
   reclutamiento).
9. **RESPALDO** — logos desde `aseguradoras` + la línea legal del Anexo
   ("Los productos y coberturas disponibles dependen de cada aseguradora…").
10. **OPINIONES** — testimonios con estrellas, cita y "— {author} · {context}".
11. **PREGUNTAS FRECUENTES** — acordeón desde `SITE.faq` + FAQSchema.
12. **CONTACTO** — renderiza UNA variante según `contact.variant` (sección 4).

Además:
- **Botones flotantes** WhatsApp y Llamar (visibles en móvil, como en el Anexo).
- **Footer**: nombre + título + ubicación, columnas "Soluciones" (links a
  productos) y "Contacto" (tel, email, WhatsApp, FAQ), los DOS párrafos legales
  del Anexo (condiciones de aseguradora + beneficios fiscales), copyright y
  crédito "Sitio desarrollado por Maguey Studio".
- **`equipo.astro`** → re-titular "Asesores" (o "Sobre mí" en modo agente);
  se genera desde `team`.
- **`MedicalReviewBlock.astro`** → **`AuthorBlock.astro`**: bloque visible de
  autor/asesor en posts, se renderiza solo desde el frontmatter.
- Crear **`/aviso-de-privacidad`** con placeholder claro de que debe
  sustituirse por el aviso real del cliente (requisito para el form).

## 4. Contacto — dos variantes, config elige una

Crear ambos componentes en `src/components/`; la sección de contacto del index
hace el switch por `SITE.contact.variant`. Ambos deben quedar terminados.

- **`ContactForm.astro`** (variant `'form'`) — eyebrow "CONTACTO", título
  "Recibe una asesoría personalizada". Campos (los del Anexo):
  - Nombre * · WhatsApp * · Correo * · Ciudad · Producto de interés (select
    desde `productos`) · Horario preferido · Mensaje (opcional)
  - Checkbox obligatorio: "He leído y acepto el aviso de privacidad" (link a
    `contact.privacyUrl`).
  - Submit "Enviar solicitud" con `action={SITE.contact.formAction}`, POST.
  - Debajo, la línea legal: "El envío del formulario no representa
    contratación, aprobación ni emisión de una póliza."
  - Si `formAction` está vacío, aviso visible en dev de que falta configurarlo.
- **`ContactCta.astro`** (variant `'cta'`) — bloque final tipo cierre:
  título "La mejor protección comienza con una buena decisión" + párrafo del
  Anexo + dos botones: **"Hablar con {nombre}"** → `https://wa.me/{whatsapp}?text={whatsappMessage}`
  (URL-encoded) y **"Agendar una llamada"** → `contact.calendarUrl` (ocultar
  este botón si `calendarUrl` está vacío). Teléfono visible como alternativa.

## 5. Quiz de orientación ("ORIENTACIÓN GRATUITA")

Wizard client-side (JS vanilla, sin dependencias) de 5 pasos: "Responde cinco
preguntas y recibe orientación personalizada sin costo ni compromiso."

- Paso 1 (del Anexo): "¿Qué deseas proteger?" → A mi familia si llegara a
  faltarme / Mi retiro y ahorro a largo plazo / Mi salud y la de mi familia /
  Mi automóvil. Cada opción mapea a un producto (vida/retiro/gmm/auto).
- Pasos 2-5: redactar preguntas simples de perfilamiento (etapa de vida,
  dependientes económicos, presupuesto mensual aproximado, urgencia). Sin
  pedir datos personales ni de salud.
- Resultado: recomienda el/los productos afines con 2-3 líneas y un CTA a la
  variante de contacto activa (WhatsApp con mensaje prellenado del producto, o
  ancla al form con el producto preseleccionado).
- Todo estático/client-side: no se envía nada a ningún servidor desde el quiz.

## 6. Blog y contenido (YMYL financiero)

- **`src/content.config.ts`**: mantener el esquema Zod estricto con estos cambios:
  `reviewedBy` y `reviewDate` pasan de obligatorios a **opcionales** (recomendados);
  `authorId` sigue opcional pero recomendado; `sources` se queda. Los ids deben
  existir en `team`.
- **Disclaimer** (en `blog.disclaimer` del config): sustituir el médico por uno
  financiero, p.ej.: "Este contenido es informativo y no constituye asesoría
  personalizada ni una oferta. Coberturas, condiciones y exclusiones se rigen por
  la póliza contratada. Consulta a un asesor con cédula vigente."
- Reemplaza el post de ejemplo médico por un post de ejemplo de seguros
  (p.ej. "¿Qué son deducible y coaseguro en gastos médicos mayores?") con
  frontmatter completo y `sources` institucionales (CONDUSEF, CNSF, AMIS).

## 7. Archivos raíz

- **`cliente.json`**: cambia `"vertical": "salud"` → `"vertical": "seguros"`.
- **`client-brief.md`**: misma estructura; la sección "Médicos revisores" se
  convierte en "Asesores / cédulas" (tabla: nombre, cédula CNSF, tipo, `id` en
  `team`). En SEO, ajusta ejemplos de keywords a seguros.
- **`package.json`**: renombra a `astro-template-seguros`.
- **`README.md`**: actualiza descripción a la vertical seguros.

## 8. Reescribir `CLAUDE.md`

Mantén la estructura del actual (Arquitectura / Reglas de posts / Flujo /
Setup de proyecto nuevo / NO hacer) adaptada a seguros. Puntos que deben quedar:

- `site.config.ts` único archivo de config; `mode` agente/promotoria; todo se
  alimenta de ahí.
- Posts: frontmatter con `authorId` recomendado, `reviewedBy`/`reviewDate`
  opcionales pero sugeridos; ids deben existir en `team`; preferir fuentes
  CONDUSEF/CNSF/AMIS/aseguradoras.
- Setup de proyecto nuevo: elegir `mode`, llenar config con datos reales
  (cédulas CNSF reales), elegir `contact.variant` y configurar
  `formAction`/`whatsapp`/`calendarUrl`, sustituir el aviso de privacidad
  placeholder por el real, llenar `cliente.json` y `client-brief.md`, poner el
  topic `maguey-cliente` al repo, fotos reales en `public/team/`, logos de
  aseguradoras en `public/aseguradoras/`, consistencia NAP con Google Business,
  y sustituir los testimonios placeholder por reales **con autorización del
  cliente**.
- NO hacer: no inventar cédulas CNSF ni credenciales; **no prometer rendimientos,
  ahorros ni beneficios fiscales garantizados**; no publicar primas/precios de
  aseguradoras sin fuente; no quitar las líneas legales (form, aseguradoras,
  footer); no publicar testimonios inventados como reales; no hardcodear datos
  fuera del config; no JSON-LD inline; no meta tags sueltos.

## 9. Verificación y cierre

1. `npm ci && npm run build` — debe pasar sin errores con el config placeholder.
2. Probar build en ambos modos (`mode: 'agente'` y `'promotoria'`) y ambas
   variantes de contacto; dejar por defecto: `mode: 'agente'`,
   `contact.variant: 'form'`.
3. Revisar que no quede NINGUNA referencia médica:
   `grep -ri "medic\|clínic\|paciente" src/` y limpiar lo que salga (excepto
   "gastos médicos mayores", que sí es de seguros).
4. Borrar este archivo (`INSTRUCCIONES-VERTICAL-SEGUROS.md`).
5. Commit y push.

---

## Anexo: copy de referencia (magueystudio.mx/agente)

Usar como copy placeholder por defecto. "Daniel Herrera", contactos y ciudad
son datos de ejemplo → salen del config.

### Hero
- Eyebrow: SEGUROS Y PROTECCIÓN FINANCIERA
- H1: Protege tu presente y construye tu futuro
- Sub: Recibe asesoría personalizada en seguros de vida, retiro, gastos médicos y autos para encontrar una solución adecuada para ti, tu familia y tu patrimonio.
- CTAs: [Solicitar asesoría] [Conocer soluciones]
- Bullets: Asesoría personalizada · Explicaciones claras · Opciones de distintas aseguradoras · Acompañamiento continuo
- Foto: "Daniel Herrera, asesor de seguros" — Caption: Ciudad de México · Atención en todo México

### Diferenciadores (grid 4)
- Asesoría sin tecnicismos — Explicamos cada cobertura con claridad
- Comparación de alternativas — Distintas opciones según tu perfil
- Seguimiento de renovaciones — Te avisamos antes de que venza tu póliza
- Apoyo en caso de siniestro — Te acompañamos en el proceso

### EMPIEZA AQUÍ
- H2: Tomar decisiones sobre tu futuro no debería sentirse complicado
- Texto: Ya sea que quieras proteger económicamente a tu familia, contar con respaldo ante un problema de salud o comenzar a construir patrimonio, elegir la estrategia adecuada requiere entender bien tus opciones. Mi trabajo es ayudarte a analizarlas y encontrar una solución de acuerdo con tus necesidades, etapa de vida y objetivos.
- CTA: [Quiero recibir asesoría]

### SOLUCIONES DE PROTECCIÓN
- H2: Seguros adaptados a tus necesidades
- Intro: Conoce alternativas para proteger a tu familia, cuidar tu patrimonio y prepararte para las distintas etapas de la vida.
- Seguro de vida — "Protección financiera para quienes más te importan" — Ayuda a proteger la estabilidad económica de tu familia si llegaras a faltar o enfrentaras una situación que afecte tus ingresos. — CTA: [Calcular mi protección]
- Plan Personal de Retiro — "Construye desde hoy el retiro que quieres" — Crea un ahorro de largo plazo para mantener tu calidad de vida cuando decidas dejar de trabajar. — CTA: [Proyectar mi retiro]
- Gastos médicos mayores — "Cuida tu salud sin poner en riesgo tu patrimonio" — Obtén respaldo ante enfermedades, accidentes, hospitalizaciones y procedimientos médicos cubiertos. — CTA: [Cotizar gastos médicos]
- Seguro de auto — "Conduce con respaldo ante cualquier imprevisto" — Protege tu automóvil ante accidentes, daños, robo y responsabilidad frente a terceros. — CTA: [Cotizar mi auto]

### ORIENTACIÓN GRATUITA (quiz)
- H2: Descubre qué protección necesitas
- Intro: Responde cinco preguntas y recibe orientación personalizada sin costo ni compromiso.
- Paso 1 de 5: ¿Qué deseas proteger? → A mi familia si llegara a faltarme / Mi retiro y ahorro a largo plazo / Mi salud y la de mi familia / Mi automóvil — [Siguiente →]

### CONOCE A TU ASESOR
- H2: Asesoría que continúa después de contratar
- Texto: Soy Daniel Herrera, asesor especializado en protección financiera. Mi trabajo es ayudarte a identificar tus principales riesgos, entender las diferentes alternativas y elegir una solución que tenga sentido para tus necesidades, objetivos y presupuesto. Te acompaño desde la primera asesoría hasta las renovaciones, actualizaciones de tu protección y procesos relacionados con el uso de tu seguro.
- Bullets: 11+ años de experiencia · Vida, retiro, gastos médicos y autos · Atención presencial y en línea · Seguimiento durante toda la vigencia
- CTA: [Hablar con Daniel]

### PROCESO
- H2: Así te ayudo a elegir una mejor protección
1. Conozco tus necesidades — Conversamos sobre tu situación, prioridades y objetivos.
2. Analizo alternativas — Reviso opciones según tu perfil y presupuesto.
3. Te explico con claridad — Coberturas, costos, exclusiones y condiciones sin tecnicismos.
4. Te acompaño en la contratación — Gestiono la solicitud y te oriento con la documentación.
5. Sigo contigo — Renovaciones, cambios, dudas y acompañamiento en siniestros.
- CTA: [Comenzar mi asesoría]

### RESPALDO
- H2: Opciones respaldadas por compañías reconocidas
- Intro: Trabajo con diferentes aseguradoras para ayudarte a conocer alternativas y encontrar una solución adecuada para tus necesidades.
- Logos (ejemplo): GNP Seguros · Mapfre · AXA · Metlife · Seguros BBVA · Allianz
- Legal: Los productos y coberturas disponibles dependen de cada aseguradora. La contratación está sujeta a aceptación por parte de la compañía correspondiente.

### OPINIONES
- H2: Confianza construida con asesoría y acompañamiento
- Nota interna: Sustituir por testimonios reales con autorización del cliente.
- ★★★★★ "Daniel me explicó las diferentes opciones con claridad y pude elegir una cobertura de acuerdo con lo que realmente necesitaba." — Cliente · Seguro de vida
- ★★★★★ "Recibí apoyo durante todo el proceso y también después de contratar. Cuando tuve un siniestro, Daniel me orientó paso a paso." — Cliente · Gastos médicos mayores
- ★★★★★ "Lo que más valoro es que nunca sentí que me quisieran vender algo. Me dieron información real para que yo decidiera." — Cliente · Plan Personal de Retiro

### PREGUNTAS FRECUENTES
- H2: Resuelve tus dudas antes de empezar
- ¿La asesoría tiene costo? · ¿Trabajas con diferentes aseguradoras? · ¿Qué información necesito para cotizar? · ¿Puedo contratar en línea? · ¿Cómo sé cuánto seguro de vida necesito? · ¿Qué beneficios fiscales puede tener un PPR? · ¿Qué son deducible y coaseguro? · ¿Me ayudas en caso de siniestro?

### CONTACTO — variante 'form'
- H2: Recibe una asesoría personalizada
- Campos: Nombre * · WhatsApp * · Correo * · Ciudad · Producto de interés · Horario preferido · Mensaje (opcional)
- Checkbox: He leído y acepto el aviso de privacidad.
- Submit: [Enviar solicitud]
- Legal: El envío del formulario no representa contratación, aprobación ni emisión de una póliza.

### CONTACTO — variante 'cta'
- H2: La mejor protección comienza con una buena decisión
- Texto: Recibe asesoría personalizada y conoce opciones para proteger a tu familia, tu salud, tu patrimonio y tu futuro.
- CTAs: [Hablar con Daniel] (WhatsApp) · [Agendar una llamada] (calendarUrl)

### Footer
- Daniel Herrera — Asesor de Seguros y Protección Financiera — Ciudad de México · Atención en todo México
- Legal 1: La información presentada es de carácter informativo. Las coberturas, costos, deducibles, coaseguros, exclusiones, periodos de espera y demás condiciones dependen de cada aseguradora y producto. La contratación está sujeta a evaluación, aceptación y emisión por parte de la aseguradora correspondiente.
- Legal 2: Los beneficios fiscales dependen de las características del producto, del cumplimiento de los requisitos legales aplicables y de la situación particular de cada persona. Se recomienda consultar a un especialista fiscal.
- Columna SOLUCIONES: Seguro de vida · Plan de Retiro · Gastos médicos · Seguro de auto
- Columna CONTACTO: teléfono · email · WhatsApp · Preguntas frecuentes
- © {año} {nombre}. {ciudad}. — Sitio desarrollado por Maguey Studio
- Botones flotantes: WhatsApp · Llamar
