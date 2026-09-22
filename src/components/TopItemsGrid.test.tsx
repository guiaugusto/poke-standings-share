import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TopItemsGrid } from './TopItemsGrid';

const fifteenItems = Array.from({ length: 15 }, (_, i) => ({
  item: `Item${i}`,
  count: 15 - i,
}));

describe('TopItemsGrid', () => {
  it('shows the top 10 items by default', () => {
    render(<TopItemsGrid items={fifteenItems} totalPlayers={15} />);
    expect(screen.getByText('Item0')).toBeInTheDocument();
    expect(screen.getByText('Item9')).toBeInTheDocument();
    expect(screen.queryByText('Item10')).not.toBeInTheDocument();
  });

  it('renders an item icon and usage percentage for each card', () => {
    render(<TopItemsGrid items={fifteenItems} totalPlayers={15} />);
    const icon = screen.getByAltText('Item0');
    expect(icon).toHaveAttribute(
      'src',
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/item0.png',
    );
    // Item0 has count 15 out of 15 players => 100.0%
    expect(screen.getByText('100.0%')).toBeInTheDocument();
  });

  it('searches across all items, not just the top 10, and shows matches instead of the default top 10', () => {
    render(<TopItemsGrid items={fifteenItems} totalPlayers={15} />);
    fireEvent.change(screen.getByLabelText(/search item/i), { target: { value: 'Item14' } });

    expect(screen.getByText('Item14')).toBeInTheDocument();
    expect(screen.queryByText('Item0')).not.toBeInTheDocument();
  });

  it('shows a not-found message when no item matches the search', () => {
    render(<TopItemsGrid items={fifteenItems} totalPlayers={15} />);
    fireEvent.change(screen.getByLabelText(/search item/i), { target: { value: 'not a real item' } });
    expect(screen.getByText(/no item found/i)).toBeInTheDocument();
  });

  it('returns to the default top 10 when the search is cleared', () => {
    render(<TopItemsGrid items={fifteenItems} totalPlayers={15} />);
    const input = screen.getByLabelText(/search item/i);
    fireEvent.change(input, { target: { value: 'Item14' } });
    fireEvent.change(input, { target: { value: '' } });

    expect(screen.getByText('Item0')).toBeInTheDocument();
    expect(screen.queryByText('Item14')).not.toBeInTheDocument();
  });

  it('shows the empty-state message when there is no item data at all', () => {
    render(<TopItemsGrid items={[]} totalPlayers={0} />);
    expect(screen.getByText(/no usage data/i)).toBeInTheDocument();
  });
});
