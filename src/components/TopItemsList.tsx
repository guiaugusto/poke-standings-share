import { formatPercent } from '../lib/format';

interface ItemUsage {
  item: string;
  count: number;
}

interface Props {
  items: ItemUsage[];
  totalPlayers: number;
}

export function TopItemsList({ items, totalPlayers }: Props) {
  const top10 = items.slice(0, 10);

  if (top10.length === 0) {
    return <p>No usage data available yet.</p>;
  }

  return (
    <ol className="items-list">
      {top10.map((i) => (
        <li key={i.item}>
          {i.item} — {formatPercent(i.count, totalPlayers)}
        </li>
      ))}
    </ol>
  );
}
