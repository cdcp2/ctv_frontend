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
  /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/))([\w-]{11})/i;
const YOUTUBE_ID_PATTERN = /^[\w-]{11}$/;
const IFRAME_SRC_PATTERN = /<iframe[^>]+src=["']([^"']+)["']/i;

export const resolveVideoEmbedUrl = (url: string | null | undefined) => {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  const iframeMatch = trimmed.match(IFRAME_SRC_PATTERN);
  const source = iframeMatch?.[1]?.trim() || trimmed;
  if (!source) return null;
  if (
    source.includes('youtube.com/embed/') ||
    source.includes('youtube-nocookie.com/embed/')
  ) {
    return source;
  }
  if (YOUTUBE_ID_PATTERN.test(source)) {
    return `https://www.youtube.com/embed/${source}`;
  }
  const match = source.match(YOUTUBE_URL_PATTERN);
  if (match?.[1]) {
    return `https://www.youtube.com/embed/${match[1]}`;
  }
  try {
    const parsed = new URL(source);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.toString();
    }
  } catch (_) {}
  return null;
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
  const embedUrl = resolveVideoEmbedUrl(trimmed);
  return embedUrl ? { kind: 'embed', url: embedUrl } : null;
};
