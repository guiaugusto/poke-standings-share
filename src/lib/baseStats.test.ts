import { describe, it, expect } from 'vitest';
import { getBaseStats } from './baseStats';

describe('getBaseStats', () => {
  it('returns the base stat spread for a known species', () => {
    expect(getBaseStats('Pikachu')).toEqual({ hp: 35, atk: 55, def: 40, spa: 50, spd: 50, spe: 90 });
  });

  it('is case-insensitive and space-tolerant, matching the sprite slug scheme', () => {
    expect(getBaseStats('pikachu')).toBeDefined();
  });

  it('resolves a gendered-only species using the parsed gender', () => {
    expect(getBaseStats('Basculegion', 'M')).toBeDefined();
  });

  it('returns undefined for a species not in the table', () => {
    expect(getBaseStats('Not A Real Species')).toBeUndefined();
  });
});
