export const COLOMBIA_TIME_ZONE = 'America/Bogota';

const bogotaDateTimeFormatter = new Intl.DateTimeFormat('es-CO', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: COLOMBIA_TIME_ZONE,
});

export function formatBogotaDateTime(value?: string | Date | null, fallback = '—') {
  if (!value) return fallback;

  const parsed = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(parsed.getTime())) return fallback;

  return bogotaDateTimeFormatter.format(parsed);
}
