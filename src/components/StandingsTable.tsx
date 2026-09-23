import { useMemo, useState } from 'react';
import type { PlayerWithTeam } from '../lib/tournamentViewModel';
import { getSpriteUrl, getUnknownSpriteUrl } from '../lib/sprites';

interface Props {
  players: PlayerWithTeam[];
  onSelectPlayer: (player: PlayerWithTeam) => void;
}

type SortDir = 'asc' | 'desc';

function matchesQuery(player: PlayerWithTeam, query: string): boolean {
  if (player.nick.toLowerCase().includes(query)) return true;
  return player.parsedTeam.some((mon) => mon.species.toLowerCase().includes(query));
}

export function StandingsTable({ players, onSelectPlayer }: Props) {
  const [filter, setFilter] = useState('');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  const handleSort = () => {
    setSortDir((dir) => (dir === 'asc' ? 'desc' : 'asc'));
  };

  const visiblePlayers = useMemo(() => {
    const query = filter.trim().toLowerCase();
    const filtered = query ? players.filter((p) => matchesQuery(p, query)) : players;
    const dirMultiplier = sortDir === 'asc' ? 1 : -1;
    return [...filtered].sort((a, b) => (a.rank - b.rank) * dirMultiplier);
  }, [players, filter, sortDir]);

  const sortIndicator = sortDir === 'asc' ? ' ▲' : ' ▼';

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
                <button type="button" onClick={handleSort}>
                  Rank{sortIndicator}
                </button>
              </th>
              <th>Player</th>
              <th>W-L-T</th>
              <th>Points</th>
              <th className="col-team-cell">Team</th>
            </tr>
          </thead>
          <tbody>
            {visiblePlayers.map((player) => (
              <tr key={player.nick}>
                <td>{player.rank}</td>
                <td>{player.nick}</td>
                <td>{player.wins}-{player.losses}-{player.ties}</td>
                <td>{player.points}</td>
                <td className="col-team-cell">
                  {player.parsedTeam.length === 0 ? (
                    <div className="team-thumbnails">
                      {Array.from({ length: 6 }, (_, i) => (
                        <img key={i} src={getUnknownSpriteUrl()} alt="Unknown Pokémon" width={40} height={40} />
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
                        <img key={mon.species} src={getSpriteUrl(mon.species, mon.gender)} alt={mon.species} width={40} height={40} onError={(e) => { e.currentTarget.style.visibility = 'hidden'; }} />
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
