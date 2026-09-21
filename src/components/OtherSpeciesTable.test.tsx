import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { OtherSpeciesTable } from './OtherSpeciesTable';

const elevenSpecies = Array.from({ length: 11 }, (_, i) => ({
  species: `Species${i}`,
  count: 11 - i,
}));

describe('OtherSpeciesTable', () => {
  it('renders only species beyond the top 10', () => {
    render(<OtherSpeciesTable species={elevenSpecies} totalPlayers={11} />);
    expect(screen.queryByText('Species0')).not.toBeInTheDocument();
    expect(screen.queryByText('Species9')).not.toBeInTheDocument();
    expect(screen.getByText('Species10')).toBeInTheDocument();
  });

  it('shows the one-decimal usage percentage next to each species', () => {
    render(<OtherSpeciesTable species={elevenSpecies} totalPlayers={11} />);
    // Species10 has count 1 out of 11 players => 9.1%
    expect(screen.getByText('9.1%')).toBeInTheDocument();
  });

  it('renders nothing when there are 10 or fewer species total', () => {
    const { container } = render(
      <OtherSpeciesTable species={elevenSpecies.slice(0, 10)} totalPlayers={10} />,
    );
    expect(container).toBeEmptyDOMElement();
  });
});
