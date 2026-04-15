import { describe, expect, it } from 'vitest';
import {
  extractYouTubeChannelId,
  extractYouTubeFeedUrlFromHtml,
  getConfiguredYouTubeSource,
  parseLatestYouTubeVideo,
  resolveYouTubeFeedUrl,
} from './youtube';

describe('youtube helpers', () => {
  it('reads the configured source from social youtube when no dedicated env exists', () => {
    expect(
      getConfiguredYouTubeSource({
        PUBLIC_SOCIAL_YOUTUBE: 'https://www.youtube.com/@ctvbarranquilla',
      }),
    ).toBe('https://www.youtube.com/@ctvbarranquilla');
  });

  it('extracts channel ids from channel urls', () => {
    expect(extractYouTubeChannelId('https://www.youtube.com/channel/UCabcdefghijk1234567890')).toBe(
      'UCabcdefghijk1234567890',
    );
  });

  it('converts uploads playlists into channel feeds', () => {
    expect(
      resolveYouTubeFeedUrl('https://www.youtube.com/playlist?list=UUabcdefghijk1234567890'),
    ).toBe('https://www.youtube.com/feeds/videos.xml?channel_id=UCabcdefghijk1234567890');
  });

  it('extracts the rss feed url from youtube html', () => {
    const html =
      '<link rel="alternate" type="application/rss+xml" title="RSS" href="https://www.youtube.com/feeds/videos.xml?channel_id=UCabc123&amp;foo=bar">';

    expect(extractYouTubeFeedUrlFromHtml(html)).toBe(
      'https://www.youtube.com/feeds/videos.xml?channel_id=UCabc123&foo=bar',
    );
  });

  it('parses the first entry from the youtube feed', () => {
    const xml = `
      <feed>
        <entry>
          <yt:videoId>dQw4w9WgXcQ</yt:videoId>
          <title>Ultimo video</title>
          <link rel="alternate" href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"/>
          <published>2026-04-15T10:00:00+00:00</published>
        </entry>
      </feed>
    `;

    expect(parseLatestYouTubeVideo(xml, 'https://www.youtube.com/feeds/videos.xml?channel_id=UCabc123')).toEqual({
      embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      feedUrl: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCabc123',
      publishedAt: '2026-04-15T10:00:00+00:00',
      title: 'Ultimo video',
      videoId: 'dQw4w9WgXcQ',
      watchUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    });
  });
});
