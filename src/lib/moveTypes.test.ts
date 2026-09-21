import { describe, it, expect } from 'vitest';
import { getMoveType } from './moveTypes';

describe('getMoveType', () => {
  it('resolves a known move to its type', () => {
    expect(getMoveType('Flare Blitz')).toBe('fire');
  });

  it('is case-insensitive and slugifies spaces to hyphens before lookup', () => {
    expect(getMoveType('Fake Out')).toBe('normal');
  });

  it('strips characters that are not letters, digits, or hyphens before lookup', () => {
    expect(getMoveType('U-turn')).toBe('bug');
  });

  it('returns undefined for a move not in the table, instead of throwing', () => {
    expect(getMoveType('Not A Real Move')).toBeUndefined();
  });
});
