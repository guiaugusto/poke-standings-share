// src/components/TournamentInteractive.tsx
import { useState } from 'react';
import { StandingsTable } from './StandingsTable';
import { TeamModal } from './TeamModal';
import { UsageStatsChart } from './UsageStatsChart';
import type { PlayerWithTeam } from '../lib/tournamentViewModel';
import type { UsageStats } from '../lib/usageStats';

interface Props {
  players: PlayerWithTeam[];
  usageStats: UsageStats;
}

export default function TournamentInteractive({ players, usageStats }: Props) {
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerWithTeam | null>(null);

  return (
    <>
      <StandingsTable players={players} onSelectPlayer={setSelectedPlayer} />
      <UsageStatsChart stats={usageStats} />
      <TeamModal player={selectedPlayer} onClose={() => setSelectedPlayer(null)} />
    </>
  );
}
