import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TournamentSearch } from './TournamentSearch';

const tournaments = [
  { slug: 'copa-primavera', name: 'Copa Primavera VGC', date: '2026-03-15', format: 'VGC Reg I' },
  { slug: 'copa-outono', name: 'Copa Outono VGC', date: '2025-06-01' },
];

describe('TournamentSearch', () => {
  it('renders every tournament when the search field is empty', () => {
    render(<TournamentSearch tournaments={tournaments} />);
    expect(screen.getByText('Copa Primavera VGC')).toBeInTheDocument();
    expect(screen.getByText('Copa Outono VGC')).toBeInTheDocument();
  });

  it('filters tournaments by name as the user types, case-insensitively', () => {
    render(<TournamentSearch tournaments={tournaments} />);
    fireEvent.change(screen.getByLabelText(/search tournament/i), { target: { value: 'primavera' } });
    expect(screen.getByText('Copa Primavera VGC')).toBeInTheDocument();
    expect(screen.queryByText('Copa Outono VGC')).not.toBeInTheDocument();
  });

  it('shows a not-found message when no tournament matches the query', () => {
    render(<TournamentSearch tournaments={tournaments} />);
    fireEvent.change(screen.getByLabelText(/search tournament/i), { target: { value: 'does not exist' } });
    expect(screen.getByText(/no tournament found/i)).toBeInTheDocument();
  });

  it('shows only the first 30 tournaments per page, with pagination controls', () => {
    const manyTournaments = Array.from({ length: 45 }, (_, i) => ({
      slug: `tournament-${i}`,
      name: `Tournament ${i}`,
      date: '2026-01-01',
    }));
    render(<TournamentSearch tournaments={manyTournaments} />);

    expect(screen.getByText('Tournament 0')).toBeInTheDocument();
    expect(screen.getByText('Tournament 29')).toBeInTheDocument();
    expect(screen.queryByText('Tournament 30')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    expect(screen.getByText('Tournament 30')).toBeInTheDocument();
    expect(screen.getByText('Tournament 44')).toBeInTheDocument();
    expect(screen.queryByText('Tournament 0')).not.toBeInTheDocument();
  });

  it('does not show pagination controls when everything fits on one page', () => {
    render(<TournamentSearch tournaments={tournaments} />);
    expect(screen.queryByRole('button', { name: /next/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /previous/i })).not.toBeInTheDocument();
  });

  it('resets to the first page when the search query changes', () => {
    const manyTournaments = Array.from({ length: 45 }, (_, i) => ({
      slug: `tournament-${i}`,
      name: `Tournament ${i}`,
      date: '2026-01-01',
    }));
    render(<TournamentSearch tournaments={manyTournaments} />);

    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    expect(screen.getByText('Tournament 30')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/search tournament/i), { target: { value: 'Tournament 1' } });
    // Back on page 1 of the filtered results, showing matches from the start again.
    expect(screen.getByText('Tournament 1')).toBeInTheDocument();
  });
});
