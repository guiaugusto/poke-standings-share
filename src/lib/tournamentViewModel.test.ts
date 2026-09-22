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

  it('does not trim topSpecies, since the Statistics tab needs the full list beyond the top 10', () => {
    const players = Array.from({ length: 12 }, (_, i) => ({
      rank: i + 1,
      nick: `Player ${i}`,
      wins: 0,
      losses: 0,
      ties: 0,
      points: 0,
      team: `Species${i} @ Focus Sash\nAbility: Levitate\nLevel: 50\nJolly Nature\n- Protect`,
    }));
    const manyTournament: Tournament = { ...tournament, players };
    const vm = buildTournamentViewModel(manyTournament);
    expect(vm.usageStats.topSpecies).toHaveLength(12);
  });

  it('does not trim topItems either, since the items search needs to find items beyond the top 10', () => {
    const players = Array.from({ length: 12 }, (_, i) => ({
      rank: i + 1,
      nick: `Player ${i}`,
      wins: 0,
      losses: 0,
      ties: 0,
      points: 0,
      team: `Pikachu @ Item${i}\nAbility: Static\nLevel: 50\nJolly Nature\n- Thunderbolt`,
    }));
    const manyTournament: Tournament = { ...tournament, players };
    const vm = buildTournamentViewModel(manyTournament);
    expect(vm.usageStats.topItems).toHaveLength(12);
  });

  it('preserves tournament-level fields', () => {
    const vm = buildTournamentViewModel(tournament);
    expect(vm.name).toBe('Copa Primavera VGC');
    expect(vm.slug).toBe('copa-primavera');
  });

  it('gives a player with no team (undefined) an empty parsedTeam instead of throwing', () => {
    const noTeamTournament: Tournament = {
      ...tournament,
      players: [
        {
          rank: 1,
          nick: 'No Team Player',
          wins: 0,
          losses: 0,
          ties: 0,
          points: 0,
          team: undefined,
        },
      ],
    };
    const vm = buildTournamentViewModel(noTeamTournament);
    expect(vm.players[0].parsedTeam).toEqual([]);
  });
});
