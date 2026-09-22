import type { ReactNode } from 'react';
import type { ParsedPokemon } from '../lib/showdownParser';
import { MonInfoColumn } from './MonInfoColumn';
import { TypeIcon } from './TypeIcon';

interface Props {
  mon: ParsedPokemon;
  bodyClassName?: string;
  children: ReactNode;
}

// Shared shell (header + left info column) for both the Moves and Stats
// tabs' cards, so the two always reserve the exact same space for their
// left column — only the right-hand content (move list vs stat bars)
// differs, as `children`.
export function MonCard({ mon, bodyClassName, children }: Props) {
  return (
    <div className="mon-card">
      <div className="mon-card-header">
        <span className="mon-card-name">
          {mon.species}
          {mon.gender && <span className="mon-card-gender"> ({mon.gender})</span>}
        </span>
        {mon.teraType && <TypeIcon type={mon.teraType.toLowerCase()} />}
      </div>
      <div className={bodyClassName ? `mon-card-body ${bodyClassName}` : 'mon-card-body'}>
        <MonInfoColumn mon={mon} />
        {children}
      </div>
    </div>
  );
}
