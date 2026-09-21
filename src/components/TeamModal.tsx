import type { PlayerWithTeam } from '../lib/tournamentViewModel';
import { getSpriteUrl } from '../lib/sprites';

interface Props {
  player: PlayerWithTeam | null;
  onClose: () => void;
}

export function TeamModal({ player, onClose }: Props) {
  if (!player) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-label={`Time de ${player.nick}`}>
      <div className="modal-content">
        <button type="button" onClick={onClose}>Fechar</button>
        <h2>{player.nick}</h2>
        <div className="team-grid">
          {player.parsedTeam.map((mon, i) => (
            <div className="mon-card" key={`${mon.species}-${i}`}>
              <img src={getSpriteUrl(mon.species)} alt={mon.species} width={64} height={64} />
              <strong>{mon.species}</strong>
              {mon.item && <p>{mon.item}</p>}
              {mon.ability && <p>{mon.ability}</p>}
              {mon.nature && <p>{mon.nature}</p>}
              {mon.teraType && <p>Tera: {mon.teraType}</p>}
              <ul>
                {mon.moves.map((move) => (
                  <li key={move}>{move}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
