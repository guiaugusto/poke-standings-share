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

  it('colors the boosted and reduced stats by nature (red for boost, blue for reduce)', () => {
    const mon: ParsedPokemon = {
      species: 'Incineroar',
      moves: [],
      nature: 'Adamant', // +Atk -SpA
      evs: { atk: 32 },
    };
    const { container } = render(<MonStatsCard mon={mon} />);
    expect(container.querySelector('.stat-bar-value--boost')).toHaveTextContent('32');
    expect(container.querySelector('.stat-bar-value--reduce')).toHaveTextContent('0');
  });

  it('computes and renders the final stat from base stats + stat points + nature', () => {
    // Incineroar: hp 95 / atk 115 / def 90 / spa 80 / spd 90 / spe 60.
    const mon: ParsedPokemon = {
      species: 'Incineroar',
      moves: [],
      level: 50,
      nature: 'Adamant', // +Atk -SpA
      evs: { hp: 27, atk: 32 },
    };
    render(<MonStatsCard mon={mon} />);
    expect(screen.getByText('197')).toBeInTheDocument(); // HP final
    expect(screen.getByText('183')).toBeInTheDocument(); // Atk final, boosted
    expect(screen.getByText('90')).toBeInTheDocument(); // SpA final, reduced
  });

  it('renders an em dash for the final stat when the species has no base-stat entry', () => {
    const mon: ParsedPokemon = { species: 'Not A Real Species', moves: [], evs: { hp: 4 } };
    render(<MonStatsCard mon={mon} />);
    expect(screen.getAllByText('—').length).toBe(6);
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
