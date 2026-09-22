import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatBar } from './StatBar';

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
});
