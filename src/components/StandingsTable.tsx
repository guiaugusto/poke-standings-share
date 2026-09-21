import { useMemo, useState } from 'react';
import type { PlayerWithTeam } from '../lib/tournamentViewModel';
import { getSpriteUrl } from '../lib/sprites';

interface Props {
  players: PlayerWithTeam[];
  onSelectPlayer: (player: PlayerWithTeam) => void;
}

type SortKey = 'rank' | 'points' | 'wins';
type SortDir = 'asc' | 'desc';

export function StandingsTable({ players, onSelectPlayer }: Props) {
  const [filter, setFilter] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('rank');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((dir) => (dir === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const visiblePlayers = useMemo(() => {
    const filtered = players.filter((p) => p.nick.toLowerCase().includes(filter.toLowerCase()));
    const dirMultiplier = sortDir === 'asc' ? 1 : -1;
    return [...filtered].sort((a, b) => (a[sortKey] - b[sortKey]) * dirMultiplier);
  }, [players, filter, sortKey, sortDir]);

  const sortIndicator = (key: SortKey) => {
    if (key !== sortKey) return '';
    return sortDir === 'asc' ? ' ▲' : ' ▼';
  };

  return (
    <div>
      <label>
        Buscar jogador
        <input type="text" value={filter} onChange={(e) => setFilter(e.target.value)} />
      </label>
      <div className="standings-table-wrapper">
        <table className="standings-table">
          <thead>
            <tr>
              <th>
                <button type="button" onClick={() => handleSort('rank')}>
                  Rank{sortIndicator('rank')}
                </button>
              </th>
              <th>Jogador</th>
              <th>
                <button type="button" onClick={() => handleSort('wins')}>
                  V-D-E{sortIndicator('wins')}
                </button>
              </th>
              <th>
                <button type="button" onClick={() => handleSort('points')}>
                  Pontos{sortIndicator('points')}
                </button>
              </th>
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
                      <img key={mon.species} src={getSpriteUrl(mon.species, mon.gender)} alt={mon.species} width={32} height={32} onError={(e) => { e.currentTarget.style.visibility = 'hidden'; }} />
                    ))}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
