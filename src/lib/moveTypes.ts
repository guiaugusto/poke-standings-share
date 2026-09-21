import moveTypesData from '../data/move-types.json';

// Static move-name -> type table, generated once from PokeAPI's GraphQL
// endpoint (937 moves) and committed to the repo (src/data/move-types.json).
// No network call happens at build or render time to resolve it — same
// "no network I/O" constraint the sprite lookup follows.
const MOVE_TYPES: Record<string, string> = moveTypesData;

function slugify(move: string): string {
  return move
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

export function getMoveType(move: string): string | undefined {
  return MOVE_TYPES[slugify(move)];
}
