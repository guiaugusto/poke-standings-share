import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatBar } from './StatBar';

describe('StatBar', () => {
  it('renders the stat label and numeric EV value', () => {
    render(<StatBar label="HP" value={244} />);
    expect(screen.getByText('HP')).toBeInTheDocument();
    expect(screen.getByText('244')).toBeInTheDocument();
  });

  it('sizes the fill bar proportionally to the 0-252 EV range', () => {
    render(<StatBar label="Spe" value={126} />);
    const fill = screen.getByTestId('stat-bar-fill');
    expect(fill).toHaveStyle({ width: '50%' });
  });

  it('renders a zero-width bar and the number 0 when no EVs are invested', () => {
    render(<StatBar label="Def" value={0} />);
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByTestId('stat-bar-fill')).toHaveStyle({ width: '0%' });
  });

  it('clamps the fill width at 100% even if a value somehow exceeds 252', () => {
    render(<StatBar label="Atk" value={300} />);
    expect(screen.getByTestId('stat-bar-fill')).toHaveStyle({ width: '100%' });
  });
});
