import type { ParsedPokemon, StatKey } from '../lib/showdownParser';
import { getSpriteUrl } from '../lib/sprites';
import { StatBar } from './StatBar';

interface Props {
  mon: ParsedPokemon;
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

export function MonStatsCard({ mon }: Props) {
  return (
    <div className="mon-card">
      <img
        src={getSpriteUrl(mon.species)}
        alt={mon.species}
        width={64}
        height={64}
        onError={(e) => {
          e.currentTarget.style.visibility = 'hidden';
        }}
      />
      <strong>{mon.species}</strong>
      <div className="stat-bar-list">
        {EV_ORDER.map((key) => (
          <StatBar key={key} label={EV_LABELS[key]} value={mon.evs?.[key] ?? 0} />
        ))}
      </div>
    </div>
  );
}
