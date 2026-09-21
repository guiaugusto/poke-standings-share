import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TopSpeciesGrid } from './TopSpeciesGrid';

const elevenSpecies = Array.from({ length: 11 }, (_, i) => ({
  species: `Species${i}`,
  count: 11 - i,
}));

describe('TopSpeciesGrid', () => {
  it('renders only the top 10 species, even when given more', () => {
    render(<TopSpeciesGrid species={elevenSpecies} totalPlayers={11} />);
    expect(screen.getByText('Species0')).toBeInTheDocument();
    expect(screen.getByText('Species9')).toBeInTheDocument();
    expect(screen.queryByText('Species10')).not.toBeInTheDocument();
  });

  it('shows each species usage as a one-decimal percentage of totalPlayers', () => {
    render(<TopSpeciesGrid species={[{ species: 'Incineroar', count: 5 }]} totalPlayers={8} />);
    expect(screen.getByText('62.5%')).toBeInTheDocument();
  });

  it('shows an empty-state message when there is no species data', () => {
    render(<TopSpeciesGrid species={[]} totalPlayers={0} />);
    expect(screen.getByText(/nenhum dado/i)).toBeInTheDocument();
  });
});
