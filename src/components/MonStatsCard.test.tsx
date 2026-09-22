import { describe, it, expect } from 'vitest';
import { render, screen, getAllByTestId } from '@testing-library/react';
import { MonStatsCard } from './MonStatsCard';
import type { ParsedPokemon } from '../lib/showdownParser';

describe('MonStatsCard', () => {
  it('renders the species name and a bar with its EV value for each of the 6 stats', () => {
    const mon: ParsedPokemon = {
      species: 'Incineroar',
      moves: [],
      evs: { hp: 27, atk: 19, def: 20 },
    };
    render(<MonStatsCard mon={mon} />);
    expect(screen.getByText('Incineroar')).toBeInTheDocument();
    expect(screen.getByText('HP')).toBeInTheDocument();
    expect(screen.getByText('27')).toBeInTheDocument();
    expect(screen.getByText('Atk')).toBeInTheDocument();
    expect(screen.getByText('19')).toBeInTheDocument();
    expect(screen.getByText('SpA')).toBeInTheDocument();
    // spa wasn't set in the EVs above, so it should render as 0, not be omitted.
    const spaValue = screen.getAllByText('0');
    expect(spaValue.length).toBeGreaterThan(0);
  });

  it('renders all bars at 0 when the Pokemon has no EVs at all', () => {
    const mon: ParsedPokemon = { species: 'Gholdengo', moves: [] };
    const { container } = render(<MonStatsCard mon={mon} />);
    const fills = getAllByTestId(container, 'stat-bar-fill');
    expect(fills).toHaveLength(6);
    for (const fill of fills) {
      expect(fill).toHaveStyle({ width: '0%' });
    }
  });
});
