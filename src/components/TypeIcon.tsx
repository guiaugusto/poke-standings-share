import { getTypeIconUrl } from '../lib/typeIcons';

interface Props {
  type: string;
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function TypeIcon({ type }: Props) {
  const url = getTypeIconUrl(type);
  if (!url) return null;

  return <img className="type-icon" src={url} alt={capitalize(type)} width={20} height={20} />;
}
