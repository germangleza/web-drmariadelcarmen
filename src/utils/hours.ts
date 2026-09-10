/**
 * Convierte los horarios en formato schema.org ("Mo-Fr 09:00-20:30")
 * a filas legibles en español ("Lunes a viernes", "9:00 a. m. – 8:30 p. m.").
 * Los días no cubiertos se agregan como "Cerrado".
 */
const DAYS: Record<string, string> = {
  Mo: 'lunes', Tu: 'martes', We: 'miércoles', Th: 'jueves', Fr: 'viernes', Sa: 'sábado', Su: 'domingo',
};
const ORDER = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function time12(t: string): string {
  const [h, m] = t.split(':').map(Number);
  const suffix = h < 12 ? 'a. m.' : 'p. m.';
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${suffix}`;
}

export interface HoursRow { days: string; hours: string; }

export function formatOpeningHours(specs: readonly string[]): HoursRow[] {
  const covered = new Set<string>();
  const rows: HoursRow[] = specs.map((spec) => {
    const [dayPart, timePart] = spec.split(' ');
    const [from, to] = dayPart.split('-');
    const [open, close] = timePart.split('-');
    const i = ORDER.indexOf(from);
    const j = to ? ORDER.indexOf(to) : i;
    for (let k = i; k <= j; k++) covered.add(ORDER[k]);
    const days = to ? `${cap(DAYS[from])} a ${DAYS[to]}` : cap(DAYS[from]);
    return { days, hours: `${time12(open)} – ${time12(close)}` };
  });
  const closed = ORDER.filter((d) => !covered.has(d));
  if (closed.length) rows.push({ days: closed.map((d) => cap(DAYS[d])).join(', '), hours: 'Cerrado' });
  return rows;
}
