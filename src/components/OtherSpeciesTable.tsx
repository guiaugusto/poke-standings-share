import { formatPercent } from '../lib/format';

interface SpeciesUsage {
  species: string;
  count: number;
}

interface Props {
  species: SpeciesUsage[];
  totalPlayers: number;
}

export function OtherSpeciesTable({ species, totalPlayers }: Props) {
  const others = species.slice(10);

  if (others.length === 0) {
    return null;
  }

  return (
    <table className="species-table">
      <thead>
        <tr>
          <th>Pokémon</th>
          <th>Uso</th>
        </tr>
      </thead>
      <tbody>
        {others.map((s) => (
          <tr key={s.species}>
            <td>{s.species}</td>
            <td>{formatPercent(s.count, totalPlayers)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
