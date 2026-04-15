export const normalizeUploadsPath = (value: string) =>
  value.replace(/\/uploads\/uploads(\/|$)/g, '/uploads$1');

export const resolveMediaUrl = (url: string | null | undefined, apiBase: string) => {
  if (!url) return null;
  const normalized = normalizeUploadsPath(url);
  if (normalized.startsWith('http')) return normalized;
  if (normalized.startsWith('/')) return `${apiBase}${normalized}`;
  return normalized;
};

const YOUTUBE_URL_PATTERN =
  /(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/))([\w-]{11})/i;
const YOUTUBE_ID_PATTERN = /^[\w-]{11}$/;

export const resolveVideoEmbedUrl = (url: string | null | undefined) => {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  if (trimmed.includes('youtube.com/embed/')) return trimmed;
  if (YOUTUBE_ID_PATTERN.test(trimmed)) {
    return `https://www.youtube.com/embed/${trimmed}`;
  }
  const match = trimmed.match(YOUTUBE_URL_PATTERN);
  if (match?.[1]) {
    return `https://www.youtube.com/embed/${match[1]}`;
  }
  return trimmed;
};

export type StreamSource =
  | { kind: 'hls'; url: string }
  | { kind: 'file'; url: string }
  | { kind: 'embed'; url: string };

export const inferStreamSource = (url: string | null | undefined): StreamSource | null => {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  if (/\.m3u8(\?|$)/i.test(trimmed)) {
    return { kind: 'hls', url: trimmed };
  }
  if (/\.(mp4|webm|ogg)(\?|$)/i.test(trimmed)) {
    return { kind: 'file', url: trimmed };
  }
  return { kind: 'embed', url: resolveVideoEmbedUrl(trimmed) ?? trimmed };
};
