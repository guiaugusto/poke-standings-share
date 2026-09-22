import type { ParsedPokemon } from '../lib/showdownParser';
import { getMoveType } from '../lib/moveTypes';
import { MonCard } from './MonCard';
import { TypeIcon } from './TypeIcon';

interface Props {
  mon: ParsedPokemon;
}

export function MonMovesCard({ mon }: Props) {
  return (
    <MonCard mon={mon}>
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
    </MonCard>
  );
}
