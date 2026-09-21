import { TopSpeciesGrid } from './TopSpeciesGrid';
import { OtherSpeciesTable } from './OtherSpeciesTable';
import { TopItemsList } from './TopItemsList';
import type { UsageStats } from '../lib/usageStats';

interface Props {
  usageStats: UsageStats;
  totalPlayers: number;
}

export function StatisticsPanel({ usageStats, totalPlayers }: Props) {
  return (
    <section>
      <h2>Most used Pokémon</h2>
      <TopSpeciesGrid species={usageStats.topSpecies} totalPlayers={totalPlayers} />
      <OtherSpeciesTable species={usageStats.topSpecies} totalPlayers={totalPlayers} />

      <h2>Most used items</h2>
      <TopItemsList items={usageStats.topItems} totalPlayers={totalPlayers} />
    </section>
  );
}
