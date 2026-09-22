import { describe, it, expect } from 'vitest';
import { computeFinalStat, DEFAULT_IV, DEFAULT_LEVEL } from './statCalc';

describe('computeFinalStat', () => {
  it('computes HP with 0 EVs at level 50 and a perfect IV', () => {
    expect(computeFinalStat('hp', 100, { iv: 31, ev: 0, level: 50 })).toBe(175);
  });

  it('computes HP with EVs invested', () => {
    expect(computeFinalStat('hp', 100, { iv: 31, ev: 252, level: 50 })).toBe(207);
  });

  it('computes a non-HP stat with a neutral nature (multiplier 1)', () => {
    expect(computeFinalStat('atk', 100, { iv: 31, ev: 0, level: 50, natureMultiplier: 1 })).toBe(120);
  });

  it('applies a +10% nature multiplier', () => {
    expect(computeFinalStat('atk', 100, { iv: 31, ev: 0, level: 50, natureMultiplier: 1.1 })).toBe(132);
  });

  it('applies a -10% nature multiplier', () => {
    expect(computeFinalStat('atk', 100, { iv: 31, ev: 0, level: 50, natureMultiplier: 0.9 })).toBe(108);
  });

  it('scales with level', () => {
    expect(computeFinalStat('hp', 100, { iv: 31, ev: 0, level: 100 })).toBe(341);
    expect(computeFinalStat('atk', 100, { iv: 31, ev: 0, level: 100, natureMultiplier: 1 })).toBe(236);
  });

  it('falls back to default IV, EV, and level when none are given', () => {
    expect(computeFinalStat('hp', 100)).toBe(computeFinalStat('hp', 100, { iv: DEFAULT_IV, ev: 0, level: DEFAULT_LEVEL }));
  });

  it('pins a 1-base-stat species (Shedinja) at exactly 1 HP regardless of EVs or level', () => {
    expect(computeFinalStat('hp', 1, { iv: 31, ev: 252, level: 100 })).toBe(1);
  });
});
