const MAX_BASE_STAT = 255; // Blissey's HP, the highest base stat in the games.

interface Props {
  label: string;
  base?: number;
  ev: number;
  final?: number;
  sign?: '+' | '-';
}

function formatInvestment(ev: number, sign: '+' | '-' | undefined): string {
  if (ev === 0) return sign ?? '';
  return `${ev}${sign ?? ''}`;
}

export function StatBar({ label, base, ev, final, sign }: Props) {
  const barPercent = base === undefined ? 0 : Math.min(100, (base / MAX_BASE_STAT) * 100);

  return (
    <div className="stat-bar">
      <span className="stat-bar-label">{label}</span>
      <span className="stat-bar-base-value">{base ?? '—'}</span>
      <div className="stat-bar-track">
        <div className="stat-bar-fill" data-testid="stat-bar-fill" style={{ width: `${barPercent}%` }} />
      </div>
      <span className={sign ? `stat-bar-investment stat-bar-investment--${sign === '+' ? 'boost' : 'reduce'}` : 'stat-bar-investment'}>
        {formatInvestment(ev, sign)}
      </span>
      <span className="stat-bar-value">{final ?? '—'}</span>
    </div>
  );
}
