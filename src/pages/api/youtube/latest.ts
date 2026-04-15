import type { APIRoute } from 'astro';
import {
  extractYouTubeFeedUrlFromHtml,
  getConfiguredYouTubeSource,
  parseLatestYouTubeVideo,
  resolveYouTubeFeedUrl,
} from '../../../lib/youtube';

export const prerender = false;

async function fetchText(url: string) {
  const response = await fetch(url, {
    headers: {
      Accept: 'text/html,application/xml,text/xml;q=0.9,*/*;q=0.8',
      'User-Agent': 'CTVBarranquillaFrontend/1.0',
    },
  });

  if (!response.ok) {
    throw new Error(`Fetch failed (${response.status})`);
  }

  return response.text();
}

export const GET: APIRoute = async () => {
  try {
    const source = getConfiguredYouTubeSource(import.meta.env);
    if (!source) {
      return new Response(JSON.stringify({ video: null, reason: 'youtube_not_configured' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': 'public, max-age=60',
        },
      });
    }

    let feedUrl = resolveYouTubeFeedUrl(source);
    if (!feedUrl) {
      const html = await fetchText(source);
      feedUrl = extractYouTubeFeedUrlFromHtml(html);
    }

    if (!feedUrl) {
      return new Response(JSON.stringify({ video: null, reason: 'feed_not_found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': 'public, max-age=60',
        },
      });
    }

    const xml = await fetchText(feedUrl);
    const video = parseLatestYouTubeVideo(xml, feedUrl);

    if (!video) {
      return new Response(JSON.stringify({ video: null, reason: 'feed_empty' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': 'public, max-age=60',
        },
      });
    }

    return new Response(JSON.stringify({ video }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=300',
      },
    });
  } catch (_error) {
    return new Response(JSON.stringify({ video: null, reason: 'youtube_fetch_failed' }), {
      status: 502,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=60',
      },
    });
  }
};
