import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TypeIcon } from './TypeIcon';

describe('TypeIcon', () => {
  it('renders an image with the type icon URL and an accessible label', () => {
    render(<TypeIcon type="fire" />);
    const img = screen.getByAltText('Fire');
    expect(img).toHaveAttribute(
      'src',
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-ix/scarlet-violet/small/10.png',
    );
  });

  it('renders nothing for a type with no known icon (e.g. Stellar)', () => {
    const { container } = render(<TypeIcon type="stellar" />);
    expect(container).toBeEmptyDOMElement();
  });
});
