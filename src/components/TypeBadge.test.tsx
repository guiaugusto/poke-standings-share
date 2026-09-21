import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TypeBadge } from './TypeBadge';

describe('TypeBadge', () => {
  it('renders the type name capitalized', () => {
    render(<TypeBadge type="fire" />);
    expect(screen.getByText('Fire')).toBeInTheDocument();
  });

  it('applies the type color as the background', () => {
    render(<TypeBadge type="fire" />);
    expect(screen.getByText('Fire')).toHaveStyle({ backgroundColor: '#F08030' });
  });

  it('falls back to a neutral color for an unrecognized type', () => {
    render(<TypeBadge type="unknown-type" />);
    expect(screen.getByText('Unknown-type')).toHaveStyle({ backgroundColor: '#999999' });
  });
});
