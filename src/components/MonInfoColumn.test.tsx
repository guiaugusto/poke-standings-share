import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MonInfoColumn } from './MonInfoColumn';
import type { ParsedPokemon } from '../lib/showdownParser';

const mon: ParsedPokemon = {
  species: 'Incineroar',
  item: 'Sitrus Berry',
  ability: 'Intimidate',
  nature: 'Careful',
  gender: 'M',
  moves: [],
};

describe('MonInfoColumn', () => {
  it('renders the sprite, ability, item (with icon), and nature as plain text', () => {
    render(<MonInfoColumn mon={mon} />);
    expect(screen.getByAltText('Incineroar')).toBeInTheDocument();
    expect(screen.getByText('Intimidate')).toBeInTheDocument();
    expect(screen.getByText('Sitrus Berry')).toBeInTheDocument();
    expect(screen.getByAltText('Sitrus Berry')).toBeInTheDocument();
    expect(screen.getByText('Careful')).toBeInTheDocument();
  });

  it('omits ability, item, and nature paragraphs when unknown', () => {
    const bare: ParsedPokemon = { species: 'Gholdengo', moves: [] };
    render(<MonInfoColumn mon={bare} />);
    expect(screen.queryByText('Careful')).not.toBeInTheDocument();
  });
});
