import { useMemo, useState } from 'react';

interface TournamentSummary {
  slug: string;
  name: string;
  date: string;
  format?: string;
}

interface Props {
  tournaments: TournamentSummary[];
}

export function TournamentSearch({ tournaments }: Props) {
  const [query, setQuery] = useState('');

  const visible = useMemo(
    () => tournaments.filter((t) => t.name.toLowerCase().includes(query.toLowerCase())),
    [tournaments, query],
  );

  return (
    <div>
      <label>
        Search tournament
        <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} />
      </label>
      {visible.length === 0 ? (
        <p>No tournament found.</p>
      ) : (
        <ul className="tournament-list">
          {visible.map((t) => (
            <li key={t.slug}>
              <a href={`${import.meta.env.BASE_URL}tournaments/${t.slug}/`}>{t.name}</a>
              <span className="tournament-meta">
                {t.date}
                {t.format && ` · ${t.format}`}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
