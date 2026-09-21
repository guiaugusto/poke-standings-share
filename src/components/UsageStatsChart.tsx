import { BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import type { UsageStats } from '../lib/usageStats';

interface Props {
  stats: UsageStats;
}

export function UsageStatsChart({ stats }: Props) {
  const speciesData = stats.topSpecies.slice(0, 10).map((s) => ({ name: s.species, count: s.count }));
  const itemsData = stats.topItems.slice(0, 10).map((i) => ({ name: i.item, count: i.count }));

  return (
    <section>
      <h2>Estatísticas de uso</h2>

      {speciesData.length > 0 && (
        <>
          <h3>Pokémon mais usados</h3>
          <BarChart width={500} height={300} data={speciesData}>
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#4a70b5" />
          </BarChart>
        </>
      )}

      {itemsData.length > 0 && (
        <>
          <h3>Itens mais usados</h3>
          <BarChart width={500} height={300} data={itemsData}>
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#b54a4a" />
          </BarChart>
        </>
      )}

      <h3>Duplas mais comuns</h3>
      {stats.topPairs.length === 0 && stats.topTrios.length === 0 ? (
        <p>Nenhum dado de uso disponível ainda.</p>
      ) : (
        <>
          <ul>
            {stats.topPairs.slice(0, 10).map((p) => (
              <li key={p.pair.join('+')}>{p.pair.join(' + ')} — {p.count}x</li>
            ))}
          </ul>
          <h3>Trios mais comuns</h3>
          <ul>
            {stats.topTrios.slice(0, 10).map((t) => (
              <li key={t.trio.join('+')}>{t.trio.join(' + ')} — {t.count}x</li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
