import { resolveVideoEmbedUrl } from './media';

export type LatestYouTubeVideo = {
  embedUrl: string;
  feedUrl: string;
  publishedAt: string | null;
  title: string;
  videoId: string;
  watchUrl: string;
};

const CHANNEL_ID_PATTERN = /\b(UC[\w-]{20,})\b/;
const UPLOADS_PLAYLIST_PATTERN = /[?&]list=(UU[\w-]{20,})/i;
const RSS_LINK_PATTERN =
  /<link[^>]+type=["']application\/rss\+xml["'][^>]+href=["']([^"']+)["'][^>]*>/i;

function decodeHtmlEntities(value: string) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function withHttps(value: string) {
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith('@')) return `https://www.youtube.com/${value}`;
  if (value.startsWith('youtube.com/')) return `https://${value}`;
  return value;
}

export function getConfiguredYouTubeSource(env: Record<string, string | undefined>) {
  const raw =
    env.PUBLIC_YOUTUBE_FEED_URL ||
    env.YOUTUBE_FEED_URL ||
    env.PUBLIC_YOUTUBE_CHANNEL_ID ||
    env.YOUTUBE_CHANNEL_ID ||
    env.PUBLIC_YOUTUBE_CHANNEL_URL ||
    env.YOUTUBE_CHANNEL_URL ||
    env.PUBLIC_SOCIAL_YOUTUBE ||
    '';

  const trimmed = raw.trim();
  return trimmed ? withHttps(trimmed) : null;
}

export function extractYouTubeChannelId(value: string) {
  const direct = value.match(CHANNEL_ID_PATTERN);
  if (direct?.[1]) return direct[1];

  const uploads = value.match(UPLOADS_PLAYLIST_PATTERN);
  if (uploads?.[1]) {
    return `UC${uploads[1].slice(2)}`;
  }

  return null;
}

export function resolveYouTubeFeedUrl(value: string) {
  const trimmed = withHttps(value.trim());
  if (!trimmed) return null;
  if (trimmed.includes('/feeds/videos.xml')) return trimmed;

  const channelId = extractYouTubeChannelId(trimmed);
  if (channelId) {
    return `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
  }

  return null;
}

export function extractYouTubeFeedUrlFromHtml(html: string) {
  const rssMatch = html.match(RSS_LINK_PATTERN);
  if (rssMatch?.[1]) {
    return decodeHtmlEntities(rssMatch[1]);
  }

  const channelId = extractYouTubeChannelId(html);
  if (channelId) {
    return `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
  }

  return null;
}

export function parseLatestYouTubeVideo(xml: string, feedUrl: string): LatestYouTubeVideo | null {
  const entry = xml.match(/<entry>([\s\S]*?)<\/entry>/i)?.[1];
  if (!entry) return null;

  const videoId = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/i)?.[1]?.trim();
  if (!videoId) return null;

  const watchUrl =
    entry.match(/<link[^>]+href=["']([^"']+)["'][^>]*\/?>/i)?.[1]?.trim() ||
    `https://www.youtube.com/watch?v=${videoId}`;
  const embedUrl = resolveVideoEmbedUrl(watchUrl);
  if (!embedUrl) return null;

  const rawTitle = entry.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim() || 'Video';
  const publishedAt = entry.match(/<published>([^<]+)<\/published>/i)?.[1]?.trim() || null;

  return {
    embedUrl,
    feedUrl,
    publishedAt,
    title: decodeHtmlEntities(rawTitle),
    videoId,
    watchUrl,
  };
}
