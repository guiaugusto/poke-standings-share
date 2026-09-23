import type { StatKey } from './showdownParser';

// VGC-specific default: a missing "Level:" line means the paste just
// omitted the (redundant, always-50) line for this format, not that the
// mon is actually level 100.
export const DEFAULT_LEVEL = 50;

// Default when an "IVs:" line (or one of its per-stat values) is omitted:
// competitive teams are assumed perfect (31) unless stated otherwise.
export const DEFAULT_IV = 31;

// Pokémon Champions replaced the classic 0-252 EV system with directly
// allocatable Stat Points, 0-32 per stat — this shop's tournament data
// records that new scale directly (e.g. "EVs: 27 HP / 19 Def / 20 SpD"
// really means 27/19/20 Stat Points, not raw EVs). Unlike classic EVs,
// each Stat Point adds exactly +1 to the final stat, not scaled down by
// level/100 the way the base+IV term is — that scaling only applies to
// the "0 Stat Points" baseline. Nature's ±10% then applies to that whole
// total (baseline + points), not just to the baseline on its own.
export function computeFinalStat(
  key: StatKey,
  base: number,
  { iv = DEFAULT_IV, statPoints = 0, level = DEFAULT_LEVEL, natureMultiplier = 1 } = {},
): number {
  if (key === 'hp' && base <= 1) return 1; // Shedinja-style: always exactly 1 HP.

  const core = Math.floor(((2 * base + iv) * level) / 100);
  if (key === 'hp') return core + level + 10 + statPoints;

  const baseline = core + 5;
  return Math.floor((baseline + statPoints) * natureMultiplier);
}
