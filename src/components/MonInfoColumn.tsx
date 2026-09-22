import type { ParsedPokemon } from '../lib/showdownParser';
import { getSpriteUrl } from '../lib/sprites';
import { getItemIconUrl } from '../lib/itemIcons';

interface Props {
  mon: ParsedPokemon;
}

// The sprite + ability + item + nature block shown on the left of both the
// Moves and Stats tabs' cards — kept identical between the two tabs.
export function MonInfoColumn({ mon }: Props) {
  return (
    <div className="mon-card-left">
      <img
        src={getSpriteUrl(mon.species, mon.gender)}
        alt={mon.species}
        width={80}
        height={80}
        onError={(e) => {
          e.currentTarget.style.visibility = 'hidden';
        }}
      />
      {mon.ability && <p>{mon.ability}</p>}
      {mon.item && (
        <p className="mon-card-item">
          <img
            src={getItemIconUrl(mon.item)}
            alt={mon.item}
            width={26}
            height={26}
            onError={(e) => {
              e.currentTarget.style.visibility = 'hidden';
            }}
          />
          {mon.item}
        </p>
      )}
      {mon.nature && <p className="mon-card-nature">{mon.nature}</p>}
    </div>
  );
}
