// This shop's tournament data records EV investment on its own 0-32 scale
// per stat (not the games' raw 0-252 EVs), so the bar tracks completeness
// against that same scale.
const MAX_EV = 32;

interface Props {
  label: string;
  ev: number;
  sign?: '+' | '-';
}

const SIGN_CLASS: Record<'+' | '-', string> = {
  '+': 'stat-bar-value--boost',
  '-': 'stat-bar-value--reduce',
};

// A shape cue (▲/▼), not just color, so a colorblind reader can still tell
// a boosted stat from a reduced one — plus a screen-reader-only label
// spelling that out, since the arrow glyph itself isn't announced.
const SIGN_ARROW: Record<'+' | '-', string> = {
  '+': '▲',
  '-': '▼',
};

const SIGN_DESCRIPTION: Record<'+' | '-', string> = {
  '+': 'boosted by nature',
  '-': 'reduced by nature',
};

export function StatBar({ label, ev, sign }: Props) {
  const percent = Math.min(100, Math.max(0, (ev / MAX_EV) * 100));
  const valueClassName = sign ? `stat-bar-value ${SIGN_CLASS[sign]}` : 'stat-bar-value';

  return (
    <div className="stat-bar">
      <span className="stat-bar-label">{label}</span>
      <div className="stat-bar-track">
        <div className="stat-bar-fill" data-testid="stat-bar-fill" style={{ width: `${percent}%` }} />
      </div>
      <span className={valueClassName}>
        {sign && (
          <span className="stat-bar-arrow" aria-hidden="true">
            {SIGN_ARROW[sign]}
          </span>
        )}
        <span className="stat-bar-number">{ev}</span>
        {sign && <span className="sr-only">, {SIGN_DESCRIPTION[sign]}</span>}
      </span>
    </div>
  );
}
