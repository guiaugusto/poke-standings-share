import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { OtherSpeciesCarousel } from './OtherSpeciesCarousel';

const twentyFiveSpecies = Array.from({ length: 25 }, (_, i) => ({
  species: `Species${i}`,
  count: 25 - i,
}));

describe('OtherSpeciesCarousel', () => {
  it('renders only species beyond the top 10, up to 10 per page', () => {
    render(<OtherSpeciesCarousel species={twentyFiveSpecies} totalPlayers={25} />);
    expect(screen.queryByText('Species0')).not.toBeInTheDocument();
    expect(screen.queryByText('Species9')).not.toBeInTheDocument();
    expect(screen.getByText('Species10')).toBeInTheDocument();
    expect(screen.getByText('Species19')).toBeInTheDocument();
    expect(screen.queryByText('Species20')).not.toBeInTheDocument();
  });

  it('shows a full-size (not shrunk) sprite for each row', () => {
    render(<OtherSpeciesCarousel species={twentyFiveSpecies} totalPlayers={25} />);
    const sprite = screen.getByAltText('Species10');
    expect(sprite).toHaveAttribute('width', '40');
    expect(sprite).toHaveAttribute('height', '40');
  });

  it('shows the one-decimal usage percentage next to each species', () => {
    render(<OtherSpeciesCarousel species={twentyFiveSpecies} totalPlayers={25} />);
    // Species10 has count 15 out of 25 players => 60.0%
    expect(screen.getByText('60.0%')).toBeInTheDocument();
  });

  it('advances to the next page of others when Next is clicked, and back with Previous', () => {
    render(<OtherSpeciesCarousel species={twentyFiveSpecies} totalPlayers={25} />);
    fireEvent.click(screen.getByRole('button', { name: /next/i }));

    expect(screen.queryByText('Species10')).not.toBeInTheDocument();
    expect(screen.getByText('Species20')).toBeInTheDocument();
    expect(screen.getByText('Species24')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /previous/i }));
    expect(screen.getByText('Species10')).toBeInTheDocument();
    expect(screen.queryByText('Species20')).not.toBeInTheDocument();
  });

  it('disables Previous on the first page and Next on the last page', () => {
    render(<OtherSpeciesCarousel species={twentyFiveSpecies} totalPlayers={25} />);
    expect(screen.getByRole('button', { name: /previous/i })).toBeDisabled();

    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    expect(screen.getByRole('button', { name: /next/i })).toBeDisabled();
  });

  it('advances the page on a left swipe and goes back on a right swipe', () => {
    render(<OtherSpeciesCarousel species={twentyFiveSpecies} totalPlayers={25} />);
    const carousel = screen.getByTestId('species-carousel');

    fireEvent.touchStart(carousel, { touches: [{ clientX: 300 }] });
    fireEvent.touchEnd(carousel, { changedTouches: [{ clientX: 200 }] }); // swiped left by 100px
    expect(screen.getByText('Species20')).toBeInTheDocument();

    fireEvent.touchStart(carousel, { touches: [{ clientX: 200 }] });
    fireEvent.touchEnd(carousel, { changedTouches: [{ clientX: 300 }] }); // swiped right by 100px
    expect(screen.getByText('Species10')).toBeInTheDocument();
  });

  it('does not show pagination controls when everything fits on one page', () => {
    const fifteenSpecies = twentyFiveSpecies.slice(0, 15); // 5 "others"
    render(<OtherSpeciesCarousel species={fifteenSpecies} totalPlayers={15} />);
    expect(screen.queryByRole('button', { name: /next/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /previous/i })).not.toBeInTheDocument();
  });

  it('renders nothing when there are 10 or fewer species total', () => {
    const { container } = render(
      <OtherSpeciesCarousel species={twentyFiveSpecies.slice(0, 10)} totalPlayers={10} />,
    );
    expect(container).toBeEmptyDOMElement();
  });
});
