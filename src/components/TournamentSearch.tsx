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

const PAGE_SIZE = 30;

export function TournamentSearch({ tournaments }: Props) {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(0);

  const filtered = useMemo(
    () => tournaments.filter((t) => t.name.toLowerCase().includes(query.toLowerCase())),
    [tournaments, query],
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const visible = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setPage(0);
  };

  return (
    <div>
      <div className="tournament-search-toolbar">
        <label className="tournament-search">
          Search tournament
          <input type="text" value={query} onChange={(e) => handleQueryChange(e.target.value)} />
        </label>
      </div>
      {filtered.length === 0 ? (
        <p>No tournament found.</p>
      ) : (
        <>
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
          {totalPages > 1 && (
            <div className="tournament-list-nav">
              <button type="button" onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}>
                ‹ Previous
              </button>
              <span className="tournament-list-page">
                Page {page + 1} of {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page === totalPages - 1}
              >
                Next ›
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
