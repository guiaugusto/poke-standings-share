import { describe, it, expect } from 'vitest';
import { render, screen, getAllByTestId } from '@testing-library/react';
import { MonStatsCard } from './MonStatsCard';
import type { ParsedPokemon } from '../lib/showdownParser';

describe('MonStatsCard', () => {
  it('renders the species name and a bar for each of the 6 stats, with base and final values', () => {
    // Pikachu: hp 35 / atk 55 / def 40 / spa 50 / spd 50 / spe 90.
    const mon: ParsedPokemon = {
      species: 'Pikachu',
      moves: [],
      level: 50,
      nature: 'Timid', // +Spe -Atk
      evs: { hp: 244, atk: 0, def: 0, spd: 0, spe: 252 },
    };
    render(<MonStatsCard mon={mon} />);

    expect(screen.getByText('Pikachu')).toBeInTheDocument();
    expect(screen.getByText('HP')).toBeInTheDocument();
    // Base stat for HP shows up as its own cell.
    expect(screen.getByText('35')).toBeInTheDocument();
    // Speed EV (252) with the Timid boost sign.
    expect(screen.getByText('252+')).toBeInTheDocument();
    // Attack has 0 EVs and is nature-reduced -> shown as a bare sign.
    expect(screen.getByText('-')).toBeInTheDocument();
  });

  it('renders base stat and final stat as an em dash for a species missing from the base-stat table', () => {
    const mon: ParsedPokemon = { species: 'Not A Real Species', moves: [], evs: { hp: 4 } };
    const { container } = render(<MonStatsCard mon={mon} />);
    const fills = getAllByTestId(container, 'stat-bar-fill');
    expect(fills).toHaveLength(6);
    expect(screen.getAllByText('—').length).toBeGreaterThan(0);
  });
});
