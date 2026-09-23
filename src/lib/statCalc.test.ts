import { describe, it, expect } from 'vitest';
import { computeFinalStat, DEFAULT_IV, DEFAULT_LEVEL } from './statCalc';

describe('computeFinalStat', () => {
  it('computes HP with 0 stat points at level 50 and a perfect IV', () => {
    expect(computeFinalStat('hp', 100, { iv: 31, statPoints: 0, level: 50 })).toBe(175);
  });

  it('computes HP with stat points invested (plugged in directly, not divided by 4)', () => {
    expect(computeFinalStat('hp', 100, { iv: 31, statPoints: 32, level: 50 })).toBe(191);
  });

  it('computes a non-HP stat with a neutral nature (multiplier 1)', () => {
    expect(computeFinalStat('atk', 100, { iv: 31, statPoints: 0, level: 50, natureMultiplier: 1 })).toBe(120);
  });

  it('applies a +10% nature multiplier', () => {
    expect(computeFinalStat('atk', 100, { iv: 31, statPoints: 0, level: 50, natureMultiplier: 1.1 })).toBe(132);
  });

  it('applies a -10% nature multiplier', () => {
    expect(computeFinalStat('atk', 100, { iv: 31, statPoints: 0, level: 50, natureMultiplier: 0.9 })).toBe(108);
  });

  it('scales with level', () => {
    expect(computeFinalStat('hp', 100, { iv: 31, statPoints: 0, level: 100 })).toBe(341);
    expect(computeFinalStat('atk', 100, { iv: 31, statPoints: 0, level: 100, natureMultiplier: 1 })).toBe(236);
  });

  it('falls back to default IV, 0 stat points, and default level when none are given', () => {
    expect(computeFinalStat('hp', 100)).toBe(
      computeFinalStat('hp', 100, { iv: DEFAULT_IV, statPoints: 0, level: DEFAULT_LEVEL }),
    );
  });

  it('pins a 1-base-stat species (Shedinja) at exactly 1 HP regardless of stat points or level', () => {
    expect(computeFinalStat('hp', 1, { iv: 31, statPoints: 32, level: 100 })).toBe(1);
  });
});
