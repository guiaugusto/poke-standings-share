import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { StandingsTable } from './StandingsTable';
import type { PlayerWithTeam } from '../lib/tournamentViewModel';

const players: PlayerWithTeam[] = [
  { rank: 2, nick: 'Ana Souza', wins: 5, losses: 2, ties: 0, points: 15, team: '', parsedTeam: [{ species: 'Gholdengo', moves: [] }] },
  { rank: 1, nick: 'Joseph Ugarte', wins: 6, losses: 1, ties: 0, points: 18, team: '', parsedTeam: [{ species: 'Incineroar', moves: [] }] },
];

describe('StandingsTable', () => {
  it('renders one row per player, sorted by rank ascending by default', () => {
    render(<StandingsTable players={players} onSelectPlayer={() => {}} />);
    const rows = screen.getAllByRole('row').slice(1); // skip header row
    expect(rows[0]).toHaveTextContent('Joseph Ugarte');
    expect(rows[1]).toHaveTextContent('Ana Souza');
  });

  it('filters players by nickname as the user types', () => {
    render(<StandingsTable players={players} onSelectPlayer={() => {}} />);
    fireEvent.change(screen.getByLabelText(/buscar/i), { target: { value: 'ana' } });
    expect(screen.getByText('Ana Souza')).toBeInTheDocument();
    expect(screen.queryByText('Joseph Ugarte')).not.toBeInTheDocument();
  });

  it('calls onSelectPlayer with the clicked player when the team thumbnail is clicked', () => {
    const onSelectPlayer = vi.fn();
    render(<StandingsTable players={players} onSelectPlayer={onSelectPlayer} />);
    fireEvent.click(screen.getByRole('button', { name: /ver time de joseph ugarte/i }));
    expect(onSelectPlayer).toHaveBeenCalledWith(players[1]);
  });
});
