import baseStatsData from '../data/base-stats.json';
import { slugify } from './sprites';
import type { StatKey } from './showdownParser';

// Static species -> base stat table, generated once from PokeAPI's GraphQL
// endpoint (same "no network I/O at build/render time" approach as
// pokemon-sprite-ids.json and move-types.json) and committed to the repo.
const BASE_STATS: Record<string, Partial<Record<StatKey, number>>> = baseStatsData;

// Mirrors getSpriteUrl's fallback chain in sprites.ts: a handful of species
// only have gendered entries in PokeAPI's table, no bare/gender-neutral one.
export function getBaseStats(species: string, gender?: 'M' | 'F'): Partial<Record<StatKey, number>> | undefined {
  const slug = slugify(species);
  return (
    BASE_STATS[slug] ??
    (gender ? BASE_STATS[`${slug}-${gender === 'F' ? 'female' : 'male'}`] : undefined) ??
    BASE_STATS[`${slug}-male`] ??
    BASE_STATS[`${slug}-female`]
  );
}
