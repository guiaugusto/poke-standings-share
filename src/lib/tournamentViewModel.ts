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

// Pairs and trios are only ever displayed as a top-10 list, so trimming
// those here keeps an oversized tournament's long tail out of the page
// payload. topSpecies and topItems are NOT trimmed: the Statistics tab
// shows a top-10 view of each plus a way to reach the rest (a carousel for
// species, a search box for items), so the full list is needed for both.
// Species/item + count pairs are small, so shipping the full lists —
// realistically well under a hundred entries even for a large tournament —
// doesn't reintroduce the payload-bloat problem trimming was originally
// added to solve (that was about duplicated raw multi-line team text, not
// small count records).
const MAX_USAGE_STATS_ENTRIES = 10;

function trimUsageStats(stats: UsageStats): UsageStats {
  return {
    topSpecies: stats.topSpecies,
    topItems: stats.topItems,
    topPairs: stats.topPairs.slice(0, MAX_USAGE_STATS_ENTRIES),
    topTrios: stats.topTrios.slice(0, MAX_USAGE_STATS_ENTRIES),
  };
}

export function buildTournamentViewModel(tournament: Tournament): TournamentViewModel {
  const players: PlayerWithTeam[] = tournament.players.map(({ team, ...rest }) => ({
    ...rest,
    parsedTeam: parseShowdownTeam(team ?? ''),
  }));

  const usageStats = trimUsageStats(computeUsageStats(players.map((p) => p.parsedTeam)));

  return { ...tournament, players, usageStats };
}
