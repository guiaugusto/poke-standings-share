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
  gender: 'M',
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

  it('puts sprite/item/ability/nature on the left and the move list on the right', () => {
    const { container } = render(<MonMovesCard mon={mon} />);
    const left = container.querySelector('.mon-card-left');
    const moveList = container.querySelector('.move-list');
    expect(left).toContainElement(screen.getByAltText('Incineroar'));
    expect(left).toContainElement(screen.getByText('Sitrus Berry'));
    expect(left).toContainElement(screen.getByText('Intimidate'));
    expect(left).toContainElement(screen.getByText('Careful'));
    expect(moveList).toContainElement(screen.getByText('Flare Blitz'));
  });

  it('renders an item icon alongside the item name', () => {
    render(<MonMovesCard mon={mon} />);
    const icon = screen.getByAltText('Sitrus Berry');
    expect(icon).toHaveAttribute(
      'src',
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/sitrus-berry.png',
    );
  });

  it('renders the Tera type as a type icon', () => {
    render(<MonMovesCard mon={mon} />);
    const icon = screen.getByAltText('Grass');
    expect(icon).toHaveAttribute(
      'src',
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-ix/scarlet-violet/small/12.png',
    );
  });

  it('renders each move with its type icon when the type is known', () => {
    render(<MonMovesCard mon={mon} />);
    expect(screen.getByText('Flare Blitz')).toBeInTheDocument();
    expect(screen.getAllByAltText('Fire')).toHaveLength(1);
    expect(screen.getByText('Fake Out')).toBeInTheDocument();
    expect(screen.getAllByAltText('Normal')).toHaveLength(1);
  });

  it('renders a move with no icon when its type is not in the table', () => {
    render(<MonMovesCard mon={mon} />);
    expect(screen.getByText('Not A Real Move')).toBeInTheDocument();
  });

  it('omits the Tera icon entirely when the Pokemon has no Tera type', () => {
    const monWithoutTera: ParsedPokemon = { ...mon, teraType: undefined };
    render(<MonMovesCard mon={monWithoutTera} />);
    expect(screen.queryByAltText('Grass')).not.toBeInTheDocument();
  });

  it('shows the gender marker next to the species name when known', () => {
    render(<MonMovesCard mon={mon} />);
    expect(screen.getByText('(M)')).toBeInTheDocument();
  });

  it('omits the gender marker when gender is not known', () => {
    const monWithoutGender: ParsedPokemon = { ...mon, gender: undefined };
    render(<MonMovesCard mon={monWithoutGender} />);
    expect(screen.queryByText('(M)')).not.toBeInTheDocument();
    expect(screen.queryByText('(F)')).not.toBeInTheDocument();
  });
});
