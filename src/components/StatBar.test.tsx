import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatBar } from './StatBar';

describe('StatBar', () => {
  it('renders the label, base stat, and final stat', () => {
    render(<StatBar label="HP" base={62} ev={32} final={169} />);
    expect(screen.getByText('HP')).toBeInTheDocument();
    expect(screen.getByText('62')).toBeInTheDocument();
    expect(screen.getByText('169')).toBeInTheDocument();
  });

  it('sizes the base-stat bar proportionally to the 0-255 base stat range', () => {
    render(<StatBar label="Spe" base={127.5} ev={0} final={100} />);
    expect(screen.getByTestId('stat-bar-fill')).toHaveStyle({ width: '50%' });
  });

  it('clamps the bar at 100% for a base stat above 255', () => {
    render(<StatBar label="HP" base={300} ev={0} final={100} />);
    expect(screen.getByTestId('stat-bar-fill')).toHaveStyle({ width: '100%' });
  });

  it('shows just the EV number when the nature does not affect this stat', () => {
    render(<StatBar label="Def" base={95} ev={2} final={117} />);
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('shows the EV number with a + suffix when the nature boosts this stat', () => {
    render(<StatBar label="Atk" base={135} ev={32} final={205} sign="+" />);
    expect(screen.getByText('32+')).toBeInTheDocument();
  });

  it('shows just the sign when the nature affects this stat but 0 EVs are invested', () => {
    render(<StatBar label="Spe" base={65} ev={0} final={76} sign="-" />);
    expect(screen.getByText('-')).toBeInTheDocument();
  });

  it('shows a blank investment cell when there are 0 EVs and no nature effect', () => {
    render(<StatBar label="SpA" base={68} ev={0} final={88} />);
    const cell = screen.getByText('SpA').closest('.stat-bar')!.querySelector('.stat-bar-investment');
    expect(cell).toHaveTextContent('');
  });

  it('renders an em dash for base and final when neither is known', () => {
    render(<StatBar label="HP" ev={0} />);
    expect(screen.getAllByText('—')).toHaveLength(2);
  });
});
