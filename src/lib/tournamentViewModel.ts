import { parseShowdownTeam, type ParsedPokemon } from './showdownParser';
import { computeUsageStats, type UsageStats } from './usageStats';
import type { Tournament, PlayerEntry } from './tournaments';

// Omits the raw `team` field: it's the multi-line Showdown export text used
// only to produce `parsedTeam` at build time. Keeping it here would mean
// every team's raw text gets serialized into the page twice (once raw, once
// parsed) — the client-side island only ever needs the parsed form.
export interface PlayerWithTeam extends Omit<PlayerEntry, 'team'> {
  parsedTeam: ParsedPokemon[];
}

export interface TournamentViewModel extends Omit<Tournament, 'players'> {
  players: PlayerWithTeam[];
  usageStats: UsageStats;
}

// Usage stats are only ever displayed as a top-10 list (see
// UsageStatsChart's `.slice(0, 10)` calls), so trimming each list here keeps
// an oversized tournament's long tail out of the page payload that gets
// shipped to the client.
const MAX_USAGE_STATS_ENTRIES = 10;

function trimUsageStats(stats: UsageStats): UsageStats {
  return {
    topSpecies: stats.topSpecies.slice(0, MAX_USAGE_STATS_ENTRIES),
    topItems: stats.topItems.slice(0, MAX_USAGE_STATS_ENTRIES),
    topPairs: stats.topPairs.slice(0, MAX_USAGE_STATS_ENTRIES),
    topTrios: stats.topTrios.slice(0, MAX_USAGE_STATS_ENTRIES),
  };
}

export function buildTournamentViewModel(tournament: Tournament): TournamentViewModel {
  const players: PlayerWithTeam[] = tournament.players.map(({ team, ...rest }) => ({
    ...rest,
    parsedTeam: parseShowdownTeam(team),
  }));

  const usageStats = trimUsageStats(computeUsageStats(players.map((p) => p.parsedTeam)));

  return { ...tournament, players, usageStats };
}
