import type { StatKey } from './showdownParser';

// VGC-specific default: Showdown's own generic default is level 100 when no
// "Level:" line is present, but every VGC export always states "Level: 50"
// explicitly — a missing line on this site means the paste just omitted the
// (redundant, always-50) line, not that the mon is actually level 100.
export const DEFAULT_LEVEL = 50;

// Showdown's own default when an "IVs:" line (or one of its per-stat values)
// is omitted: competitive teams are assumed perfect (31) unless stated
// otherwise.
export const DEFAULT_IV = 31;

// The standard stat formulas from the main series games.
export function computeFinalStat(
  key: StatKey,
  base: number,
  { iv = DEFAULT_IV, ev = 0, level = DEFAULT_LEVEL, natureMultiplier = 1 } = {},
): number {
  if (key === 'hp' && base <= 1) return 1; // Shedinja-style: always exactly 1 HP.

  const core = Math.floor(((2 * base + iv + Math.floor(ev / 4)) * level) / 100);
  if (key === 'hp') return core + level + 10;
  return Math.floor((core + 5) * natureMultiplier);
}
