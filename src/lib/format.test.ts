import { describe, it, expect } from 'vitest';
import { formatPercent } from './format';

describe('formatPercent', () => {
  it('formats a fraction with exactly one decimal digit', () => {
    expect(formatPercent(1, 3)).toBe('33.3%');
  });

  it('formats a whole number cleanly with .0', () => {
    expect(formatPercent(5, 5)).toBe('100.0%');
  });

  it('formats zero count as 0.0%', () => {
    expect(formatPercent(0, 10)).toBe('0.0%');
  });

  it('guards against division by zero, returning 0.0%', () => {
    expect(formatPercent(1, 0)).toBe('0.0%');
  });
});
