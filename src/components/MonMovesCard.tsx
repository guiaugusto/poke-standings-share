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
      <img
        src={getSpriteUrl(mon.species)}
        alt={mon.species}
        width={64}
        height={64}
        onError={(e) => {
          e.currentTarget.style.visibility = 'hidden';
        }}
      />
      <strong>{mon.species}</strong>
      {mon.item && <p>{mon.item}</p>}
      {mon.ability && <p>{mon.ability}</p>}
      {mon.nature && <p>{mon.nature}</p>}
      {mon.teraType && <TypeBadge type={mon.teraType.toLowerCase()} />}
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
  );
}
