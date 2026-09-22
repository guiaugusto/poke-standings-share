import { useMemo, useState } from 'react';
import type { PlayerWithTeam } from '../lib/tournamentViewModel';
import { getSpriteUrl, getUnknownSpriteUrl } from '../lib/sprites';

interface Props {
  players: PlayerWithTeam[];
  onSelectPlayer: (player: PlayerWithTeam) => void;
}

type SortKey = 'rank' | 'points' | 'wins';
type SortDir = 'asc' | 'desc';

function matchesQuery(player: PlayerWithTeam, query: string): boolean {
  if (player.nick.toLowerCase().includes(query)) return true;
  return player.parsedTeam.some((mon) => mon.species.toLowerCase().includes(query));
}

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
    const query = filter.trim().toLowerCase();
    const filtered = query ? players.filter((p) => matchesQuery(p, query)) : players;
    const dirMultiplier = sortDir === 'asc' ? 1 : -1;
    return [...filtered].sort((a, b) => (a[sortKey] - b[sortKey]) * dirMultiplier);
  }, [players, filter, sortKey, sortDir]);

  const sortIndicator = (key: SortKey) => {
    if (key !== sortKey) return '';
    return sortDir === 'asc' ? ' ▲' : ' ▼';
  };

  return (
    <div>
      <div className="standings-toolbar">
        <label className="standings-search">
          Search (player or Pokémon)
          <input type="text" value={filter} onChange={(e) => setFilter(e.target.value)} />
        </label>
      </div>
      <div className="standings-table-wrapper">
        <table className="standings-table">
          <colgroup>
            <col className="col-rank" />
            <col className="col-player" />
            <col className="col-record" />
            <col className="col-points" />
            <col className="col-team" />
          </colgroup>
          <thead>
            <tr>
              <th>
                <button type="button" onClick={() => handleSort('rank')}>
                  Rank{sortIndicator('rank')}
                </button>
              </th>
              <th>Player</th>
              <th>
                <button type="button" onClick={() => handleSort('wins')}>
                  W-L-T{sortIndicator('wins')}
                </button>
              </th>
              <th>
                <button type="button" onClick={() => handleSort('points')}>
                  Points{sortIndicator('points')}
                </button>
              </th>
              <th>Team</th>
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
                  {player.parsedTeam.length === 0 ? (
                    <div className="team-thumbnails">
                      {Array.from({ length: 6 }, (_, i) => (
                        <img key={i} src={getUnknownSpriteUrl()} alt="Unknown Pokémon" width={32} height={32} />
                      ))}
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="team-thumbnails"
                      aria-label={`${player.nick}'s team`}
                      onClick={() => onSelectPlayer(player)}
                    >
                      {player.parsedTeam.map((mon) => (
                        <img key={mon.species} src={getSpriteUrl(mon.species, mon.gender)} alt={mon.species} width={32} height={32} onError={(e) => { e.currentTarget.style.visibility = 'hidden'; }} />
                      ))}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
