import { describe, expect, it } from 'vitest';
import { formatBogotaDateTime } from './datetime';

describe('frontend datetime helpers', () => {
  it('formats article timestamps in Colombia time', () => {
    expect(formatBogotaDateTime('2026-04-04T15:45:00.000Z')).toContain('10:45');
  });

  it('returns the fallback for invalid values', () => {
    expect(formatBogotaDateTime('bad-date')).toBe('—');
    expect(formatBogotaDateTime(null, 'sin fecha')).toBe('sin fecha');
  });
});
