import { describe, it, expect } from 'vitest';
import { getTypeIconUrl } from './typeIcons';

describe('getTypeIconUrl', () => {
  it('resolves a known type to its PokeAPI type-icon URL', () => {
    expect(getTypeIconUrl('fire')).toBe(
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-ix/scarlet-violet/small/10.png',
    );
  });

  it('is case-insensitive', () => {
    expect(getTypeIconUrl('Water')).toBe(
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-ix/scarlet-violet/small/11.png',
    );
  });

  it('returns undefined for an unrecognized type instead of throwing', () => {
    expect(getTypeIconUrl('not-a-type')).toBeUndefined();
  });
});
