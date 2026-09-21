import { TYPE_COLORS } from '../lib/typeColors';

interface Props {
  type: string;
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function TypeBadge({ type }: Props) {
  const color = TYPE_COLORS[type] ?? '#999999';

  return (
    <span className="type-badge" style={{ backgroundColor: color }}>
      {capitalize(type)}
    </span>
  );
}
