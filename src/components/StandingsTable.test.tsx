import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { StandingsTable } from './StandingsTable';
import type { PlayerWithTeam } from '../lib/tournamentViewModel';

const players: PlayerWithTeam[] = [
  { rank: 2, nick: 'Ana Souza', wins: 5, losses: 2, ties: 0, points: 15, parsedTeam: [{ species: 'Gholdengo', moves: [] }] },
  { rank: 1, nick: 'Joseph Ugarte', wins: 6, losses: 1, ties: 0, points: 18, parsedTeam: [{ species: 'Incineroar', moves: [] }] },
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
    fireEvent.change(screen.getByLabelText(/search/i), { target: { value: 'ana' } });
    expect(screen.getByText('Ana Souza')).toBeInTheDocument();
    expect(screen.queryByText('Joseph Ugarte')).not.toBeInTheDocument();
  });

  it('also filters players by a Pokemon in their team', () => {
    render(<StandingsTable players={players} onSelectPlayer={() => {}} />);
    fireEvent.change(screen.getByLabelText(/search/i), { target: { value: 'gholdengo' } });
    expect(screen.getByText('Ana Souza')).toBeInTheDocument();
    expect(screen.queryByText('Joseph Ugarte')).not.toBeInTheDocument();
  });

  it('calls onSelectPlayer with the clicked player when the team thumbnail is clicked', () => {
    const onSelectPlayer = vi.fn();
    render(<StandingsTable players={players} onSelectPlayer={onSelectPlayer} />);
    fireEvent.click(screen.getByRole('button', { name: /joseph ugarte's team/i }));
    expect(onSelectPlayer).toHaveBeenCalledWith(players[1]);
  });

  it('sorts by points ascending when the Points header is clicked, and toggles to descending on a second click', () => {
    render(<StandingsTable players={players} onSelectPlayer={() => {}} />);

    fireEvent.click(screen.getByRole('button', { name: /points/i }));
    let rows = screen.getAllByRole('row').slice(1);
    expect(rows[0]).toHaveTextContent('Ana Souza'); // 15 points
    expect(rows[1]).toHaveTextContent('Joseph Ugarte'); // 18 points

    fireEvent.click(screen.getByRole('button', { name: /points/i }));
    rows = screen.getAllByRole('row').slice(1);
    expect(rows[0]).toHaveTextContent('Joseph Ugarte'); // 18 points, now descending
    expect(rows[1]).toHaveTextContent('Ana Souza'); // 15 points
  });

  it('sorts by wins when the W-L-T header is clicked', () => {
    render(<StandingsTable players={players} onSelectPlayer={() => {}} />);

    fireEvent.click(screen.getByRole('button', { name: /w-l-t/i }));
    const rows = screen.getAllByRole('row').slice(1);
    expect(rows[0]).toHaveTextContent('Ana Souza'); // 5 wins
    expect(rows[1]).toHaveTextContent('Joseph Ugarte'); // 6 wins
  });

  it('shows 6 placeholder slots instead of a clickable team button when a player has no parsed team', () => {
    const playerWithNoTeam: PlayerWithTeam = {
      rank: 3,
      nick: 'No Team Player',
      wins: 0,
      losses: 0,
      ties: 0,
      points: 0,
      parsedTeam: [],
    };
    render(<StandingsTable players={[...players, playerWithNoTeam]} onSelectPlayer={() => {}} />);

    expect(screen.queryByRole('button', { name: /no team player's team/i })).not.toBeInTheDocument();
    const row = screen.getByText('No Team Player').closest('tr')!;
    expect(within(row).getAllByText('?')).toHaveLength(6);
  });

  it('does not call onSelectPlayer when clicking a placeholder slot for a player with no team', () => {
    const playerWithNoTeam: PlayerWithTeam = {
      rank: 3,
      nick: 'No Team Player',
      wins: 0,
      losses: 0,
      ties: 0,
      points: 0,
      parsedTeam: [],
    };
    const onSelectPlayer = vi.fn();
    render(<StandingsTable players={[...players, playerWithNoTeam]} onSelectPlayer={onSelectPlayer} />);

    const row = screen.getByText('No Team Player').closest('tr')!;
    fireEvent.click(within(row).getAllByText('?')[0]);
    expect(onSelectPlayer).not.toHaveBeenCalled();
  });
});
