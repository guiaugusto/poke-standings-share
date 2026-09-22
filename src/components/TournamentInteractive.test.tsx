import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TournamentInteractive from './TournamentInteractive';
import type { PlayerWithTeam } from '../lib/tournamentViewModel';
import type { UsageStats } from '../lib/usageStats';

const players: PlayerWithTeam[] = [
  { rank: 1, nick: 'Ana Souza', wins: 6, losses: 1, ties: 0, points: 18, parsedTeam: [{ species: 'Gholdengo', moves: [] }] },
  { rank: 2, nick: 'Joseph Ugarte', wins: 5, losses: 2, ties: 0, points: 15, parsedTeam: [{ species: 'Gholdengo', moves: [] }] },
  { rank: 3, nick: 'No Team Player', wins: 0, losses: 0, ties: 0, points: 0, parsedTeam: [] },
];

const usageStats: UsageStats = {
  topSpecies: [{ species: 'Gholdengo', count: 2 }],
  topItems: [],
  topPairs: [],
  topTrios: [],
};

describe('TournamentInteractive', () => {
  it('computes usage percentages against players who actually submitted a team, not everyone', () => {
    render(<TournamentInteractive players={players} usageStats={usageStats} />);
    fireEvent.click(screen.getByRole('tab', { name: /statistics/i }));

    // 2 of 2 team-submitting players used Gholdengo -> 100.0%, not 2/3 = 66.7%.
    expect(screen.getAllByText('100.0%').length).toBeGreaterThan(0);
    expect(screen.queryByText('66.7%')).not.toBeInTheDocument();
  });
});
