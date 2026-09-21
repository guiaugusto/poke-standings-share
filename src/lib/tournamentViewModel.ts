import { parseShowdownTeam, type ParsedPokemon } from './showdownParser';
import { computeUsageStats, type UsageStats } from './usageStats';
import type { Tournament, PlayerEntry } from './tournaments';

export interface PlayerWithTeam extends PlayerEntry {
  parsedTeam: ParsedPokemon[];
}

export interface TournamentViewModel extends Omit<Tournament, 'players'> {
  players: PlayerWithTeam[];
  usageStats: UsageStats;
}

export function buildTournamentViewModel(tournament: Tournament): TournamentViewModel {
  const players: PlayerWithTeam[] = tournament.players.map((player) => ({
    ...player,
    parsedTeam: parseShowdownTeam(player.team),
  }));

  const usageStats = computeUsageStats(players.map((p) => p.parsedTeam));

  return { ...tournament, players, usageStats };
}
