import { useMemo, useState } from 'react';
import type { PlayerWithTeam } from '../lib/tournamentViewModel';
import { getSpriteUrl } from '../lib/sprites';

interface Props {
  players: PlayerWithTeam[];
  onSelectPlayer: (player: PlayerWithTeam) => void;
}

export function StandingsTable({ players, onSelectPlayer }: Props) {
  const [filter, setFilter] = useState('');

  const visiblePlayers = useMemo(() => {
    const filtered = players.filter((p) => p.nick.toLowerCase().includes(filter.toLowerCase()));
    return [...filtered].sort((a, b) => a.rank - b.rank);
  }, [players, filter]);

  return (
    <div>
      <label>
        Buscar jogador
        <input type="text" value={filter} onChange={(e) => setFilter(e.target.value)} />
      </label>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Jogador</th>
            <th>V-D-E</th>
            <th>Pontos</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {visiblePlayers.map((player) => (
            <tr key={player.nick}>
              <td>{player.rank}</td>
              <td>{player.nick}</td>
              <td>{player.wins}-{player.losses}-{player.ties}</td>
              <td>{player.points}</td>
              <td>
                <button
                  type="button"
                  aria-label={`Ver time de ${player.nick}`}
                  onClick={() => onSelectPlayer(player)}
                >
                  {player.parsedTeam.map((mon) => (
                    <img key={mon.species} src={getSpriteUrl(mon.species)} alt={mon.species} width={32} height={32} />
                  ))}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
