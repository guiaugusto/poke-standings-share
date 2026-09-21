import type { ParsedPokemon } from '../lib/showdownParser';
import { getSpriteUrl } from '../lib/sprites';
import { getMoveType } from '../lib/moveTypes';
import { TypeBadge } from './TypeBadge';

interface Props {
  mon: ParsedPokemon;
}

export function MonMovesCard({ mon }: Props) {
  return (
    <div className="mon-card">
      <div className="mon-card-header">
        <span className="mon-card-name">{mon.species}</span>
        {mon.teraType && <TypeBadge type={mon.teraType.toLowerCase()} />}
      </div>
      <div className="mon-card-body">
        <div className="mon-card-left">
          <img
            src={getSpriteUrl(mon.species, mon.gender)}
            alt={mon.species}
            width={56}
            height={56}
            onError={(e) => {
              e.currentTarget.style.visibility = 'hidden';
            }}
          />
          {mon.ability && <p>{mon.ability}</p>}
          {mon.item && <p>{mon.item}</p>}
          {mon.nature && <p className="mon-card-nature">{mon.nature}</p>}
        </div>
        <ul className="move-list">
          {mon.moves.map((move) => {
            const type = getMoveType(move);
            return (
              <li key={move}>
                {type && <TypeBadge type={type} />}
                {move}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
