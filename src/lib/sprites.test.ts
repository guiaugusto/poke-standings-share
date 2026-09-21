import { describe, it, expect } from 'vitest';
import { getSpriteUrl } from './sprites';

describe('getSpriteUrl', () => {
  it('lowercases the species name', () => {
    expect(getSpriteUrl('Incineroar')).toBe('https://play.pokemonshowdown.com/sprites/gen5/incineroar.png');
  });

  it('replaces spaces with hyphens', () => {
    expect(getSpriteUrl('Tapu Koko')).toBe('https://play.pokemonshowdown.com/sprites/gen5/tapu-koko.png');
  });

  it('strips characters that are not letters, digits, or hyphens', () => {
    expect(getSpriteUrl("Sirfetch'd")).toBe('https://play.pokemonshowdown.com/sprites/gen5/sirfetchd.png');
  });
});
