import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TopItemsList } from './TopItemsList';

const elevenItems = Array.from({ length: 11 }, (_, i) => ({
  item: `Item${i}`,
  count: 11 - i,
}));

describe('TopItemsList', () => {
  it('renders only the top 10 items, even when given more', () => {
    render(<TopItemsList items={elevenItems} totalPlayers={11} />);
    expect(screen.getByText(/Item0/)).toBeInTheDocument();
    expect(screen.getByText(/Item9/)).toBeInTheDocument();
    expect(screen.queryByText(/Item10/)).not.toBeInTheDocument();
  });

  it('shows each item usage as a one-decimal percentage of totalPlayers', () => {
    render(<TopItemsList items={[{ item: 'Sitrus Berry', count: 3 }]} totalPlayers={4} />);
    expect(screen.getByText(/75\.0%/)).toBeInTheDocument();
  });

  it('shows an empty-state message when there is no item data', () => {
    render(<TopItemsList items={[]} totalPlayers={0} />);
    expect(screen.getByText(/nenhum dado/i)).toBeInTheDocument();
  });
});
