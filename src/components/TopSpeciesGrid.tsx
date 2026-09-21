import { getSpriteUrl } from '../lib/sprites';
import { formatPercent } from '../lib/format';

interface SpeciesUsage {
  species: string;
  count: number;
}

interface Props {
  species: SpeciesUsage[];
  totalPlayers: number;
}

export function TopSpeciesGrid({ species, totalPlayers }: Props) {
  const top10 = species.slice(0, 10);

  if (top10.length === 0) {
    return <p>No usage data available yet.</p>;
  }

  return (
    <div className="species-grid">
      {top10.map((s) => (
        <div className="species-grid-item" key={s.species}>
          <img
            src={getSpriteUrl(s.species)}
            alt={s.species}
            width={48}
            height={48}
            onError={(e) => {
              e.currentTarget.style.visibility = 'hidden';
            }}
          />
          <strong>{s.species}</strong>
          <span>{formatPercent(s.count, totalPlayers)}</span>
        </div>
      ))}
    </div>
  );
}
