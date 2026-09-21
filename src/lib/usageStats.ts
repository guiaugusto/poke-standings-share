import type { ParsedPokemon } from './showdownParser';

export interface UsageStats {
  topSpecies: { species: string; count: number }[];
  topItems: { item: string; count: number }[];
  topPairs: { pair: [string, string]; count: number }[];
  topTrios: { trio: [string, string, string]; count: number }[];
}

function countBy<T>(items: T[], key: (item: T) => string | undefined): { value: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const item of items) {
    const k = key(item);
    if (!k) continue;
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count);
}

function combinations<T>(items: T[], size: number): T[][] {
  if (size > items.length) return [];
  if (size === 0) return [[]];
  const [first, ...rest] = items;
  const withFirst = combinations(rest, size - 1).map((combo) => [first, ...combo]);
  const withoutFirst = combinations(rest, size);
  return [...withFirst, ...withoutFirst];
}

function countCombinations(teams: ParsedPokemon[][], size: number): { combo: string[]; count: number }[] {
  const counts = new Map<string, string[]>();
  const tally = new Map<string, number>();

  for (const team of teams) {
    const speciesList = team.map((mon) => mon.species);
    for (const combo of combinations(speciesList, size)) {
      const key = [...combo].sort().join('|');
      counts.set(key, combo);
      tally.set(key, (tally.get(key) ?? 0) + 1);
    }
  }

  return [...tally.entries()]
    .map(([key, count]) => ({ combo: counts.get(key)!, count }))
    .sort((a, b) => b.count - a.count);
}

export function computeUsageStats(teams: ParsedPokemon[][]): UsageStats {
  const allMons = teams.flat();

  const topSpecies = countBy(allMons, (mon) => mon.species).map(({ value, count }) => ({
    species: value,
    count,
  }));

  const topItems = countBy(allMons, (mon) => mon.item).map(({ value, count }) => ({
    item: value,
    count,
  }));

  const topPairs = countCombinations(teams, 2).map(({ combo, count }) => ({
    pair: combo as [string, string],
    count,
  }));

  const topTrios = countCombinations(teams, 3).map(({ combo, count }) => ({
    trio: combo as [string, string, string],
    count,
  }));

  return { topSpecies, topItems, topPairs, topTrios };
}
