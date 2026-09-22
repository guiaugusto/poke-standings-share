import { describe, it, expect } from 'vitest';
import { getSpriteUrl, getUnknownSpriteUrl } from './sprites';

describe('getSpriteUrl', () => {
  it('resolves a species name to its PokeAPI sprite URL by id', () => {
    expect(getSpriteUrl('Incineroar')).toBe(
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/727.png',
    );
  });

  it('is case-insensitive and slugifies spaces to hyphens before looking up the id', () => {
    expect(getSpriteUrl('Tapu Koko')).toBe(
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/785.png',
    );
  });

  it('strips characters that are not letters, digits, or hyphens before lookup', () => {
    expect(getSpriteUrl("Sirfetch'd")).toBe(
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/865.png',
    );
  });

  it('resolves alternate forms (e.g. regional variants) using their own PokeAPI id', () => {
    expect(getSpriteUrl('Raichu-Alola')).toBe(
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10100.png',
    );
  });

  it('resolves species written without a form suffix to their Showdown-default form (e.g. Urshifu -> Single-Strike, Tornadus -> Incarnate)', () => {
    expect(getSpriteUrl('Urshifu')).toBe(
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/892.png',
    );
    expect(getSpriteUrl('Tornadus')).toBe(
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/641.png',
    );
  });

  it('falls back to the id-0 "unknown" placeholder sprite for a species not in the table, instead of throwing', () => {
    expect(getSpriteUrl('Not A Real Pokemon')).toBe(
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png',
    );
  });

  it('resolves a species with no gender-neutral entry using the given gender (e.g. Basculegion)', () => {
    expect(getSpriteUrl('Basculegion', 'M')).toBe(
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/902.png',
    );
    expect(getSpriteUrl('Basculegion', 'F')).toBe(
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10248.png',
    );
  });

  it('falls back to whichever gendered variant exists when the requested gender has none (e.g. Pyroar has no female entry)', () => {
    expect(getSpriteUrl('Pyroar', 'F')).toBe(
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/668.png',
    );
  });

  it('falls back to a gendered variant even when no gender was given, rather than 404ing needlessly', () => {
    expect(getSpriteUrl('Basculegion')).toBe(
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/902.png',
    );
  });
});

describe('getUnknownSpriteUrl', () => {
  it('returns the same id-0 "unknown" sprite URL that getSpriteUrl falls back to', () => {
    expect(getUnknownSpriteUrl()).toBe(
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png',
    );
  });
});
