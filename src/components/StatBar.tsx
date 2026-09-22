// This shop's tournament data records EV investment on its own 0-32 scale
// per stat (not the games' raw 0-252 EVs), so the bar tracks completeness
// against that same scale.
const MAX_EV = 32;

interface Props {
  label: string;
  ev: number;
}

export function StatBar({ label, ev }: Props) {
  const percent = Math.min(100, Math.max(0, (ev / MAX_EV) * 100));

  return (
    <div className="stat-bar">
      <span className="stat-bar-label">{label}</span>
      <div className="stat-bar-track">
        <div className="stat-bar-fill" data-testid="stat-bar-fill" style={{ width: `${percent}%` }} />
      </div>
      <span className="stat-bar-value">{ev}</span>
    </div>
  );
}
