import type { ParsedPokemon, StatKey } from '../lib/showdownParser';
import { StatBar } from './StatBar';
import { MonCard } from './MonCard';

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
    <MonCard mon={mon} bodyClassName="mon-card-body--stats">
      <div className="stat-bar-list">
        {EV_ORDER.map((key) => (
          <StatBar key={key} label={EV_LABELS[key]} ev={mon.evs?.[key] ?? 0} />
        ))}
      </div>
    </MonCard>
  );
}
