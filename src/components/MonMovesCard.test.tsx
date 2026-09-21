import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MonMovesCard } from './MonMovesCard';
import type { ParsedPokemon } from '../lib/showdownParser';

const mon: ParsedPokemon = {
  species: 'Incineroar',
  item: 'Sitrus Berry',
  ability: 'Intimidate',
  nature: 'Careful',
  teraType: 'Grass',
  moves: ['Flare Blitz', 'Fake Out', 'Not A Real Move'],
};

describe('MonMovesCard', () => {
  it('renders species, item, ability, and nature as plain text', () => {
    render(<MonMovesCard mon={mon} />);
    expect(screen.getByText('Incineroar')).toBeInTheDocument();
    expect(screen.getByText('Sitrus Berry')).toBeInTheDocument();
    expect(screen.getByText('Intimidate')).toBeInTheDocument();
    expect(screen.getByText('Careful')).toBeInTheDocument();
  });

  it('renders the Tera type as a colored type badge', () => {
    render(<MonMovesCard mon={mon} />);
    expect(screen.getByText('Grass')).toHaveStyle({ backgroundColor: '#78C850' });
  });

  it('renders each move with its type badge when the type is known', () => {
    render(<MonMovesCard mon={mon} />);
    expect(screen.getByText('Flare Blitz')).toBeInTheDocument();
    expect(screen.getByText('Fire')).toHaveStyle({ backgroundColor: '#F08030' });
    expect(screen.getByText('Fake Out')).toBeInTheDocument();
    expect(screen.getByText('Normal')).toHaveStyle({ backgroundColor: '#A8A878' });
  });

  it('renders a move with no badge when its type is not in the table', () => {
    render(<MonMovesCard mon={mon} />);
    expect(screen.getByText('Not A Real Move')).toBeInTheDocument();
  });

  it('omits the Tera badge entirely when the Pokemon has no Tera type', () => {
    const monWithoutTera: ParsedPokemon = { ...mon, teraType: undefined };
    render(<MonMovesCard mon={monWithoutTera} />);
    expect(screen.queryByText('Grass')).not.toBeInTheDocument();
  });
});
