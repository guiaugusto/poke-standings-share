import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MonCard } from './MonCard';
import type { ParsedPokemon } from '../lib/showdownParser';

const mon: ParsedPokemon = {
  species: 'Incineroar',
  gender: 'M',
  teraType: 'Grass',
  moves: [],
};

describe('MonCard', () => {
  it('renders the header, left info column, and the children as the rest of the body', () => {
    render(
      <MonCard mon={mon}>
        <div data-testid="right-panel">content</div>
      </MonCard>,
    );
    expect(screen.getByText('Incineroar')).toBeInTheDocument();
    expect(screen.getByText('(M)')).toBeInTheDocument();
    expect(screen.getByAltText('Grass')).toBeInTheDocument();
    expect(screen.getByAltText('Incineroar')).toBeInTheDocument();
    expect(screen.getByTestId('right-panel')).toBeInTheDocument();
  });

  it('applies an extra class name to the body when given', () => {
    const { container } = render(
      <MonCard mon={mon} bodyClassName="mon-card-body--stats">
        <div />
      </MonCard>,
    );
    const body = container.querySelector('.mon-card-body')!;
    expect(body).toHaveClass('mon-card-body--stats');
  });
});
