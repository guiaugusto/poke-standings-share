import { describe, it, expect } from 'vitest';
import { getSpriteUrl } from './sprites';

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

  it('falls back to a 404-ing placeholder id for a species not in the table, instead of throwing', () => {
    expect(getSpriteUrl('Not A Real Pokemon')).toBe(
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png',
    );
  });
});
