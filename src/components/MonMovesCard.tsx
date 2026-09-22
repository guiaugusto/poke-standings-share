import type { ParsedPokemon } from '../lib/showdownParser';
import { getMoveType } from '../lib/moveTypes';
import { MonInfoColumn } from './MonInfoColumn';
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
        <MonInfoColumn mon={mon} />
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
