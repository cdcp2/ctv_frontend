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

  it('extracts the src from youtube iframe code', () => {
    expect(
      resolveVideoEmbedUrl(
        '<iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ?si=test" allowfullscreen></iframe>',
      ),
    ).toBe('https://www.youtube.com/embed/dQw4w9WgXcQ?si=test');
  });

  it('converts youtube live links into embed urls', () => {
    expect(resolveVideoEmbedUrl('https://www.youtube.com/live/dQw4w9WgXcQ?feature=share')).toBe(
      'https://www.youtube.com/embed/dQw4w9WgXcQ',
    );
  });

  it('keeps valid non-youtube embed urls', () => {
    expect(resolveVideoEmbedUrl('https://player.vimeo.com/video/123456')).toBe(
      'https://player.vimeo.com/video/123456',
    );
  });

  it('ignores invalid embed values', () => {
    expect(resolveVideoEmbedUrl('sin-url-valida')).toBeNull();
  });

  it('detects hls sources', () => {
    expect(inferStreamSource('https://live.ctv.com/hls/channel/index.m3u8')).toEqual({
      kind: 'hls',
      url: 'https://live.ctv.com/hls/channel/index.m3u8',
    });
  });

  it('rejects invalid stream urls', () => {
    expect(inferStreamSource('canal-invalido')).toBeNull();
  });
});
