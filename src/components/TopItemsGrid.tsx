import { useMemo, useState } from 'react';
import { formatPercent } from '../lib/format';
import { getItemIconUrl } from '../lib/itemIcons';

interface ItemUsage {
  item: string;
  count: number;
}

interface Props {
  items: ItemUsage[];
  totalPlayers: number;
}

const MAX_VISIBLE = 10;

export function TopItemsGrid({ items, totalPlayers }: Props) {
  const [query, setQuery] = useState('');

  const visible = useMemo(() => {
    const trimmedQuery = query.trim().toLowerCase();
    const source = trimmedQuery
      ? items.filter((i) => i.item.toLowerCase().includes(trimmedQuery))
      : items;
    return source.slice(0, MAX_VISIBLE);
  }, [items, query]);

  if (items.length === 0) {
    return <p>No usage data available yet.</p>;
  }

  return (
    <div>
      <label className="items-search">
        Search item
        <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} />
      </label>
      {visible.length === 0 ? (
        <p>No item found.</p>
      ) : (
        <div className="items-grid">
          {visible.map((i) => (
            <div className="items-grid-item" key={i.item}>
              <img
                src={getItemIconUrl(i.item)}
                alt={i.item}
                width={32}
                height={32}
                onError={(e) => {
                  e.currentTarget.style.visibility = 'hidden';
                }}
              />
              <span className="items-grid-name">{i.item}</span>
              <span className="items-grid-pct">{formatPercent(i.count, totalPlayers)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
