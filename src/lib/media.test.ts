import { describe, expect, it } from 'vitest';
import { inferStreamSource, normalizeUploadsPath, resolveMediaUrl, resolveVideoEmbedUrl } from './media';

describe('media helpers', () => {
  it('normalizes duplicated uploads prefixes', () => {
    expect(normalizeUploadsPath('/uploads/uploads/banner.jpg')).toBe('/uploads/banner.jpg');
  });

  it('resolves relative media urls against the API base', () => {
    expect(resolveMediaUrl('/uploads/banner.jpg', 'https://api.ctv.com')).toBe(
      'https://api.ctv.com/uploads/banner.jpg',
    );
  });

  it('converts youtube share links into embed urls', () => {
    expect(resolveVideoEmbedUrl('https://youtu.be/dQw4w9WgXcQ')).toBe(
      'https://www.youtube.com/embed/dQw4w9WgXcQ',
    );
  });

  it('converts bare youtube ids into embed urls', () => {
    expect(resolveVideoEmbedUrl('dQw4w9WgXcQ')).toBe(
      'https://www.youtube.com/embed/dQw4w9WgXcQ',
    );
  });

  it('detects hls sources', () => {
    expect(inferStreamSource('https://live.ctv.com/hls/channel/index.m3u8')).toEqual({
      kind: 'hls',
      url: 'https://live.ctv.com/hls/channel/index.m3u8',
    });
  });
});
