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
    fireEvent.change(screen.getByLabelText(/buscar torneio/i), { target: { value: 'primavera' } });
    expect(screen.getByText('Copa Primavera VGC')).toBeInTheDocument();
    expect(screen.queryByText('Copa Outono VGC')).not.toBeInTheDocument();
  });

  it('shows a not-found message when no tournament matches the query', () => {
    render(<TournamentSearch tournaments={tournaments} />);
    fireEvent.change(screen.getByLabelText(/buscar torneio/i), { target: { value: 'não existe' } });
    expect(screen.getByText(/nenhum torneio encontrado/i)).toBeInTheDocument();
  });
});
