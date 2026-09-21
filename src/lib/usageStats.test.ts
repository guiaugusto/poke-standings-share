import { describe, it, expect } from 'vitest';
import { computeUsageStats } from './usageStats';
import type { ParsedPokemon } from './showdownParser';

function mon(species: string, item?: string): ParsedPokemon {
  return { species, item, moves: [] };
}

describe('computeUsageStats', () => {
  const teams: ParsedPokemon[][] = [
    [mon('Incineroar', 'Sitrus Berry'), mon('Salamence', 'Salamencite')],
    [mon('Incineroar', 'Sitrus Berry'), mon('Gholdengo', 'Life Orb')],
    [mon('Salamence', 'Safety Goggles'), mon('Gholdengo', 'Life Orb'), mon('Incineroar')],
  ];

  it('counts species usage across all teams, sorted descending', () => {
    const stats = computeUsageStats(teams);
    expect(stats.topSpecies[0]).toEqual({ species: 'Incineroar', count: 3 });
  });

  it('counts item usage, ignoring Pokemon with no item', () => {
    const stats = computeUsageStats(teams);
    const sitrus = stats.topItems.find((i) => i.item === 'Sitrus Berry');
    expect(sitrus).toEqual({ item: 'Sitrus Berry', count: 2 });
    expect(stats.topItems.some((i) => i.item === undefined)).toBe(false);
  });

  it('counts species pairs that co-occur within the same team', () => {
    const stats = computeUsageStats(teams);
    const pair = stats.topPairs.find(
      (p) => p.pair.includes('Incineroar') && p.pair.includes('Salamence'),
    );
    expect(pair?.count).toBe(2);
  });

  it('counts species trios that co-occur within the same team', () => {
    const stats = computeUsageStats(teams);
    const trio = stats.topTrios.find(
      (t) => t.trio.includes('Incineroar') && t.trio.includes('Salamence') && t.trio.includes('Gholdengo'),
    );
    expect(trio?.count).toBe(1);
  });

  it('returns empty arrays for an empty input', () => {
    const stats = computeUsageStats([]);
    expect(stats).toEqual({ topSpecies: [], topItems: [], topPairs: [], topTrios: [] });
  });
});
