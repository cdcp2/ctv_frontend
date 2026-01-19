export const normalizeUploadsPath = (value: string) =>
  value.replace(/\/uploads\/uploads(\/|$)/g, '/uploads$1');

export const resolveMediaUrl = (url: string | null | undefined, apiBase: string) => {
  if (!url) return null;
  const normalized = normalizeUploadsPath(url);
  if (normalized.startsWith('http')) return normalized;
  if (normalized.startsWith('/')) return `${apiBase}${normalized}`;
  return normalized;
};
