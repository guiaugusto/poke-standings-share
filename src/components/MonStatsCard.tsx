import type { ParsedPokemon, StatKey } from '../lib/showdownParser';
import { getSpriteUrl } from '../lib/sprites';
import { StatBar } from './StatBar';
import { TypeBadge } from './TypeBadge';

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
      <div className="mon-card-header">
        <span className="mon-card-name">{mon.species}</span>
        {mon.teraType && <TypeBadge type={mon.teraType.toLowerCase()} />}
      </div>
      <div className="mon-card-body mon-card-body--stats">
        <img
          src={getSpriteUrl(mon.species, mon.gender)}
          alt={mon.species}
          width={56}
          height={56}
          onError={(e) => {
            e.currentTarget.style.visibility = 'hidden';
          }}
        />
        <div className="stat-bar-list">
          {EV_ORDER.map((key) => (
            <StatBar key={key} label={EV_LABELS[key]} value={mon.evs?.[key] ?? 0} />
          ))}
        </div>
      </div>
    </div>
  );
}
