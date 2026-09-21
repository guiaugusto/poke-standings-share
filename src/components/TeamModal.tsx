import type { PlayerWithTeam } from '../lib/tournamentViewModel';
import type { StatKey } from '../lib/showdownParser';
import { getSpriteUrl } from '../lib/sprites';

interface Props {
  player: PlayerWithTeam | null;
  onClose: () => void;
}

const EV_LABELS: Record<StatKey, string> = {
  hp: 'HP',
  atk: 'Atk',
  def: 'Def',
  spa: 'SpA',
  spd: 'SpD',
  spe: 'Spe',
};

const EV_ORDER: StatKey[] = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'];

function formatEvs(evs: Partial<Record<StatKey, number>> | undefined): string | undefined {
  if (!evs) return undefined;
  const parts = EV_ORDER.filter((key) => evs[key] !== undefined).map(
    (key) => `${evs[key]} ${EV_LABELS[key]}`,
  );
  if (parts.length === 0) return undefined;
  return parts.join(' / ');
}

export function TeamModal({ player, onClose }: Props) {
  if (!player) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-label={`Time de ${player.nick}`}>
      <div className="modal-content">
        <button type="button" onClick={onClose}>Fechar</button>
        <h2>{player.nick}</h2>
        <div className="team-grid">
          {player.parsedTeam.map((mon, i) => {
            const evsLine = formatEvs(mon.evs);
            return (
              <div className="mon-card" key={`${mon.species}-${i}`}>
                <img src={getSpriteUrl(mon.species)} alt={mon.species} width={64} height={64} onError={(e) => { e.currentTarget.style.visibility = 'hidden'; }} />
                <strong>{mon.species}</strong>
                {mon.item && <p>{mon.item}</p>}
                {mon.ability && <p>{mon.ability}</p>}
                {mon.nature && <p>{mon.nature}</p>}
                {evsLine && <p>EVs: {evsLine}</p>}
                {mon.teraType && <p>Tera: {mon.teraType}</p>}
                <ul>
                  {mon.moves.map((move) => (
                    <li key={move}>{move}</li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
