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

  // OTS (Open Team Sheet) pastes reveal species/item/ability/moves but not
  // EVs — nothing to show on a Stats tab in that case, so the tab is hidden
  // entirely rather than shown empty. `view` state isn't reset here; it's
  // simply not consulted when there's nothing to switch to.
  const hasAnyStats = player.parsedTeam.some((mon) => mon.evs && Object.keys(mon.evs).length > 0);
  const effectiveView: ModalView = hasAnyStats ? view : 'moves';

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-label={`${player.nick}'s team`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-content">
        <button type="button" className="modal-close" aria-label="Close" onClick={onClose}>
          ×
        </button>
        <h2>{player.nick}</h2>

        {hasAnyStats && (
          <div className="tabs" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={effectiveView === 'moves'}
              className={effectiveView === 'moves' ? 'tab-button active' : 'tab-button'}
              onClick={() => setView('moves')}
            >
              Moves
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={effectiveView === 'stats'}
              className={effectiveView === 'stats' ? 'tab-button active' : 'tab-button'}
              onClick={() => setView('stats')}
            >
              Stats
            </button>
          </div>
        )}

        <div className="team-grid">
          {player.parsedTeam.map((mon, i) =>
            effectiveView === 'moves' ? (
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
