import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatBar } from './StatBar';

// Once a sign is set the value cell also contains an arrow glyph and a
// screen-reader-only description, so its full text content is no longer
// bare "32" — query it by class instead of by exact text.
function getValueCell(container: HTMLElement) {
  return container.querySelector('.stat-bar-value')!;
}

describe('StatBar', () => {
  it('renders the stat label and the numeric EV value', () => {
    render(<StatBar label="HP" ev={27} />);
    expect(screen.getByText('HP')).toBeInTheDocument();
    expect(screen.getByText('27')).toBeInTheDocument();
  });

  it('shows 0 when no EVs are invested, not a blank cell', () => {
    render(<StatBar label="SpA" ev={0} />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('sizes the fill bar proportionally to the 0-32 EV investment range', () => {
    render(<StatBar label="Spe" ev={16} />);
    expect(screen.getByTestId('stat-bar-fill')).toHaveStyle({ width: '50%' });
  });

  it('fills the bar completely at 32 EVs', () => {
    render(<StatBar label="Atk" ev={32} />);
    expect(screen.getByTestId('stat-bar-fill')).toHaveStyle({ width: '100%' });
  });

  it('clamps the fill width at 100% even if a value somehow exceeds 32', () => {
    render(<StatBar label="Def" ev={252} />);
    expect(screen.getByTestId('stat-bar-fill')).toHaveStyle({ width: '100%' });
  });

  it('colors the value red and shows an up arrow when the nature boosts this stat', () => {
    const { container } = render(<StatBar label="Atk" ev={32} sign="+" />);
    const value = getValueCell(container);
    expect(value).toHaveClass('stat-bar-value--boost');
    expect(value).toHaveTextContent('▲32');
  });

  it('colors the value blue and shows a down arrow when the nature reduces this stat', () => {
    const { container } = render(<StatBar label="Spe" ev={0} sign="-" />);
    const value = getValueCell(container);
    expect(value).toHaveClass('stat-bar-value--reduce');
    expect(value).toHaveTextContent('▼0');
  });

  it('adds a screen-reader-only description alongside the arrow, since the glyph itself is not announced', () => {
    const { container } = render(<StatBar label="Atk" ev={32} sign="+" />);
    expect(container.querySelector('.sr-only')).toHaveTextContent('boosted by nature');
  });

  it('applies no color class or arrow when the nature does not affect this stat', () => {
    const { container } = render(<StatBar label="Def" ev={4} />);
    const value = getValueCell(container);
    expect(value).not.toHaveClass('stat-bar-value--boost');
    expect(value).not.toHaveClass('stat-bar-value--reduce');
    expect(value).toHaveTextContent('4');
    expect(container.querySelector('.stat-bar-arrow')).not.toBeInTheDocument();
  });
});
