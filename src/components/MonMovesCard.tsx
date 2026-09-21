import type { ParsedPokemon } from '../lib/showdownParser';
import { getSpriteUrl } from '../lib/sprites';
import { getMoveType } from '../lib/moveTypes';
import { getItemIconUrl } from '../lib/itemIcons';
import { TypeIcon } from './TypeIcon';

interface Props {
  mon: ParsedPokemon;
}

export function MonMovesCard({ mon }: Props) {
  return (
    <div className="mon-card">
      <div className="mon-card-header">
        <span className="mon-card-name">
          {mon.species}
          {mon.gender && <span className="mon-card-gender"> ({mon.gender})</span>}
        </span>
        {mon.teraType && <TypeIcon type={mon.teraType.toLowerCase()} />}
      </div>
      <div className="mon-card-body">
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
        <ul className="move-list">
          {mon.moves.map((move) => {
            const type = getMoveType(move);
            return (
              <li key={move}>
                {type && <TypeIcon type={type} />}
                {move}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
