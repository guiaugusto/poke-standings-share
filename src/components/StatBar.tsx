const MAX_EV = 252;

interface Props {
  label: string;
  value: number;
}

export function StatBar({ label, value }: Props) {
  const percent = Math.min(100, (value / MAX_EV) * 100);

  return (
    <div className="stat-bar">
      <span className="stat-bar-label">{label}</span>
      <div className="stat-bar-track">
        <div className="stat-bar-fill" data-testid="stat-bar-fill" style={{ width: `${percent}%` }} />
      </div>
      <span className="stat-bar-value">{value}</span>
    </div>
  );
}
