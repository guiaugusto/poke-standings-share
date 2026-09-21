import { describe, it, expect } from 'vitest';
import { getItemIconUrl } from './itemIcons';

describe('getItemIconUrl', () => {
  it('slugifies the item name and builds the PokeAPI item-sprite URL', () => {
    expect(getItemIconUrl('Life Orb')).toBe(
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/life-orb.png',
    );
  });

  it('lowercases and strips characters that are not letters, digits, or hyphens', () => {
    expect(getItemIconUrl('Focus Sash')).toBe(
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/focus-sash.png',
    );
  });
});
