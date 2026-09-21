import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { UsageStatsChart } from './UsageStatsChart';
import type { UsageStats } from '../lib/usageStats';

const stats: UsageStats = {
  topSpecies: [{ species: 'Incineroar', count: 3 }, { species: 'Gholdengo', count: 2 }],
  topItems: [{ item: 'Sitrus Berry', count: 2 }],
  topPairs: [{ pair: ['Incineroar', 'Salamence'], count: 2 }],
  topTrios: [{ trio: ['Incineroar', 'Salamence', 'Gholdengo'], count: 1 }],
};

describe('UsageStatsChart', () => {
  it('renders the top pairs as a readable list', () => {
    render(<UsageStatsChart stats={stats} />);
    expect(screen.getByText(/Incineroar \+ Salamence — 2x/)).toBeInTheDocument();
  });

  it('renders the top trios as a readable list', () => {
    render(<UsageStatsChart stats={stats} />);
    expect(screen.getByText(/Incineroar \+ Salamence \+ Gholdengo/)).toBeInTheDocument();
  });

  it('renders a message when there are no pairs or trios yet', () => {
    render(<UsageStatsChart stats={{ topSpecies: [], topItems: [], topPairs: [], topTrios: [] }} />);
    expect(screen.getByText(/nenhum dado/i)).toBeInTheDocument();
  });
});
