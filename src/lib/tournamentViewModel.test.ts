import { describe, it, expect } from 'vitest';
import { buildTournamentViewModel } from './tournamentViewModel';
import type { Tournament } from './tournaments';

const tournament: Tournament = {
  slug: 'copa-primavera',
  name: 'Copa Primavera VGC',
  date: '2026-03-15',
  players: [
    {
      rank: 1,
      nick: 'Joseph Ugarte',
      wins: 6,
      losses: 1,
      ties: 0,
      points: 18,
      team: 'Incineroar @ Sitrus Berry\nAbility: Intimidate\nLevel: 50\nCareful Nature\n- Flare Blitz\n- Fake Out',
    },
  ],
};

describe('buildTournamentViewModel', () => {
  it('attaches a parsedTeam to every player', () => {
    const vm = buildTournamentViewModel(tournament);
    expect(vm.players[0].parsedTeam[0].species).toBe('Incineroar');
  });

  it('preserves the original player fields alongside parsedTeam', () => {
    const vm = buildTournamentViewModel(tournament);
    expect(vm.players[0].nick).toBe('Joseph Ugarte');
    expect(vm.players[0].points).toBe(18);
  });

  it('omits the raw team text from the player, keeping only parsedTeam', () => {
    const vm = buildTournamentViewModel(tournament);
    expect(vm.players[0]).not.toHaveProperty('team');
  });

  it('computes usageStats across all players parsed teams', () => {
    const vm = buildTournamentViewModel(tournament);
    expect(vm.usageStats.topSpecies).toEqual([{ species: 'Incineroar', count: 1 }]);
  });

  it('preserves tournament-level fields', () => {
    const vm = buildTournamentViewModel(tournament);
    expect(vm.name).toBe('Copa Primavera VGC');
    expect(vm.slug).toBe('copa-primavera');
  });
});
