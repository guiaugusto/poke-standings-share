import { TopSpeciesGrid } from './TopSpeciesGrid';
import { OtherSpeciesCarousel } from './OtherSpeciesCarousel';
import { TopItemsGrid } from './TopItemsGrid';
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
      <OtherSpeciesCarousel species={usageStats.topSpecies} totalPlayers={totalPlayers} />

      <h2>Most used items</h2>
      <TopItemsGrid items={usageStats.topItems} totalPlayers={totalPlayers} />
    </section>
  );
}
