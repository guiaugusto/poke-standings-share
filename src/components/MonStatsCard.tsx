import type { ParsedPokemon, StatKey } from '../lib/showdownParser';
import { getBaseStats } from '../lib/baseStats';
import { computeFinalStat } from '../lib/statCalc';
import { getNatureSign, getNatureMultiplier } from '../lib/natures';
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
  const baseStats = getBaseStats(mon.species, mon.gender);

  return (
    <MonCard mon={mon} bodyClassName="mon-card-body--stats">
      <div className="stat-bar-list">
        {EV_ORDER.map((key) => {
          const base = baseStats?.[key];
          const statPoints = mon.evs?.[key] ?? 0;
          const sign = getNatureSign(mon.nature, key);
          const final =
            base === undefined
              ? undefined
              : computeFinalStat(key, base, {
                  iv: mon.ivs?.[key],
                  statPoints,
                  level: mon.level,
                  natureMultiplier: getNatureMultiplier(mon.nature, key),
                });
          return <StatBar key={key} label={EV_LABELS[key]} ev={statPoints} final={final} sign={sign} />;
        })}
      </div>
    </MonCard>
  );
}
