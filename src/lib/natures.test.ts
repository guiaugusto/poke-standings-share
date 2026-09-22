import { describe, it, expect } from 'vitest';
import { getNatureSign } from './natures';

describe('getNatureSign', () => {
  it('returns + for the stat a nature boosts', () => {
    expect(getNatureSign('Adamant', 'atk')).toBe('+');
  });

  it('returns - for the stat a nature reduces', () => {
    expect(getNatureSign('Adamant', 'spa')).toBe('-');
  });

  it('returns undefined for a stat the nature does not affect', () => {
    expect(getNatureSign('Adamant', 'def')).toBeUndefined();
  });

  it('returns undefined for HP, which no nature ever affects', () => {
    expect(getNatureSign('Adamant', 'hp')).toBeUndefined();
  });

  it('returns undefined for a neutral nature', () => {
    expect(getNatureSign('Hardy', 'atk')).toBeUndefined();
  });

  it('returns undefined when no nature is given', () => {
    expect(getNatureSign(undefined, 'atk')).toBeUndefined();
  });

  it('returns undefined for an unrecognized nature name', () => {
    expect(getNatureSign('NotANature', 'atk')).toBeUndefined();
  });
});
