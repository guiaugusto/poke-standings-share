// src/components/TournamentInteractive.tsx
import { useState } from 'react';
import { StandingsTable } from './StandingsTable';
import { TeamModal } from './TeamModal';
import { StatisticsPanel } from './StatisticsPanel';
import type { PlayerWithTeam } from '../lib/tournamentViewModel';
import type { UsageStats } from '../lib/usageStats';

interface Props {
  players: PlayerWithTeam[];
  usageStats: UsageStats;
}

type Tab = 'standings' | 'statistics';

export default function TournamentInteractive({ players, usageStats }: Props) {
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerWithTeam | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('standings');

  return (
    <div>
      <div className="tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'standings'}
          className={activeTab === 'standings' ? 'tab-button active' : 'tab-button'}
          onClick={() => setActiveTab('standings')}
        >
          Standings
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'statistics'}
          className={activeTab === 'statistics' ? 'tab-button active' : 'tab-button'}
          onClick={() => setActiveTab('statistics')}
        >
          Statistics
        </button>
      </div>

      {activeTab === 'standings' && <StandingsTable players={players} onSelectPlayer={setSelectedPlayer} />}

      {activeTab === 'statistics' && (
        <StatisticsPanel usageStats={usageStats} totalPlayers={players.length} />
      )}

      <TeamModal player={selectedPlayer} onClose={() => setSelectedPlayer(null)} />
    </div>
  );
}
