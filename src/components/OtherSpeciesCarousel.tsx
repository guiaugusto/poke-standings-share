import { useRef, useState } from 'react';
import { formatPercent } from '../lib/format';
import { getSpriteUrl } from '../lib/sprites';

interface SpeciesUsage {
  species: string;
  count: number;
}

interface Props {
  species: SpeciesUsage[];
  totalPlayers: number;
}

const PAGE_SIZE = 10;
const SWIPE_THRESHOLD = 50;

export function OtherSpeciesCarousel({ species, totalPlayers }: Props) {
  const others = species.slice(10);
  const totalPages = Math.ceil(others.length / PAGE_SIZE);
  const [page, setPage] = useState(0);
  const touchStartX = useRef<number | null>(null);

  if (others.length === 0) {
    return null;
  }

  const start = page * PAGE_SIZE;
  const visible = others.slice(start, start + PAGE_SIZE);

  const goPrev = () => setPage((p) => Math.max(0, p - 1));
  const goNext = () => setPage((p) => Math.min(totalPages - 1, p + 1));

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (delta < -SWIPE_THRESHOLD) goNext();
    else if (delta > SWIPE_THRESHOLD) goPrev();
    touchStartX.current = null;
  };

  return (
    <div
      className="species-carousel"
      data-testid="species-carousel"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <ul className="species-carousel-list">
        {visible.map((s) => (
          <li key={s.species} className="species-carousel-row">
            <img
              src={getSpriteUrl(s.species)}
              alt={s.species}
              width={40}
              height={40}
              onError={(e) => {
                e.currentTarget.style.visibility = 'hidden';
              }}
            />
            <span className="species-carousel-name">{s.species}</span>
            <span className="species-carousel-pct">{formatPercent(s.count, totalPlayers)}</span>
          </li>
        ))}
      </ul>
      {totalPages > 1 && (
        <div className="species-carousel-nav">
          <button type="button" onClick={goPrev} disabled={page === 0}>
            ‹ Previous
          </button>
          <span className="species-carousel-page">
            Page {page + 1} of {totalPages}
          </span>
          <button type="button" onClick={goNext} disabled={page === totalPages - 1}>
            Next ›
          </button>
        </div>
      )}
    </div>
  );
}
