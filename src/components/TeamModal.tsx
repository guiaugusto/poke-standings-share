import { useState } from 'react';
import type { PlayerWithTeam } from '../lib/tournamentViewModel';
import { MonMovesCard } from './MonMovesCard';
import { MonStatsCard } from './MonStatsCard';

interface Props {
  player: PlayerWithTeam | null;
  onClose: () => void;
}

type ModalView = 'moves' | 'stats';

export function TeamModal({ player, onClose }: Props) {
  const [view, setView] = useState<ModalView>('moves');

  if (!player) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-label={`Time de ${player.nick}`}>
      <div className="modal-content">
        <button type="button" onClick={onClose}>Fechar</button>
        <h2>{player.nick}</h2>

        <div className="tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={view === 'moves'}
            className={view === 'moves' ? 'tab-button active' : 'tab-button'}
            onClick={() => setView('moves')}
          >
            Moves
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={view === 'stats'}
            className={view === 'stats' ? 'tab-button active' : 'tab-button'}
            onClick={() => setView('stats')}
          >
            Stats
          </button>
        </div>

        <div className="team-grid">
          {player.parsedTeam.map((mon, i) =>
            view === 'moves' ? (
              <MonMovesCard mon={mon} key={`${mon.species}-${i}`} />
            ) : (
              <MonStatsCard mon={mon} key={`${mon.species}-${i}`} />
            ),
          )}
        </div>
      </div>
    </div>
  );
}
