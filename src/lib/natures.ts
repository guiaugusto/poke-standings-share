import type { StatKey } from './showdownParser';

interface NatureEffect {
  boost?: StatKey;
  reduce?: StatKey;
}

// The 5 "neutral" natures (Hardy, Docile, Serious, Bashful, Quirky) boost and
// reduce the same stat, netting no change, so they're just omitted here —
// an unrecognized/missing nature name falls back to the same no-op effect.
const NATURES: Record<string, NatureEffect> = {
  Lonely: { boost: 'atk', reduce: 'def' },
  Brave: { boost: 'atk', reduce: 'spe' },
  Adamant: { boost: 'atk', reduce: 'spa' },
  Naughty: { boost: 'atk', reduce: 'spd' },
  Bold: { boost: 'def', reduce: 'atk' },
  Relaxed: { boost: 'def', reduce: 'spe' },
  Impish: { boost: 'def', reduce: 'spa' },
  Lax: { boost: 'def', reduce: 'spd' },
  Timid: { boost: 'spe', reduce: 'atk' },
  Hasty: { boost: 'spe', reduce: 'def' },
  Jolly: { boost: 'spe', reduce: 'spa' },
  Naive: { boost: 'spe', reduce: 'spd' },
  Modest: { boost: 'spa', reduce: 'atk' },
  Mild: { boost: 'spa', reduce: 'def' },
  Quiet: { boost: 'spa', reduce: 'spe' },
  Rash: { boost: 'spa', reduce: 'spd' },
  Calm: { boost: 'spd', reduce: 'atk' },
  Gentle: { boost: 'spd', reduce: 'def' },
  Sassy: { boost: 'spd', reduce: 'spe' },
  Careful: { boost: 'spd', reduce: 'spa' },
};

// HP is never affected by nature, so callers never ask for a sign on it, but
// guarding here keeps this safe to call with any StatKey anyway.
export function getNatureSign(nature: string | undefined, stat: StatKey): '+' | '-' | undefined {
  if (!nature || stat === 'hp') return undefined;
  const effect = NATURES[nature];
  if (!effect) return undefined;
  if (effect.boost === stat) return '+';
  if (effect.reduce === stat) return '-';
  return undefined;
}

export function getNatureMultiplier(nature: string | undefined, stat: StatKey): number {
  const sign = getNatureSign(nature, stat);
  if (sign === '+') return 1.1;
  if (sign === '-') return 0.9;
  return 1;
}
