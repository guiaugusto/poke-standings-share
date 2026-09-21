// Type-name -> PokeAPI numeric type id. Small and fixed (18 canonical
// types), so hardcoded here rather than a generated data file — unlike the
// move-type table (~900 entries) or the sprite-id table (~1300), this one
// doesn't need external generation. IDs verified against
// https://pokeapi.co/api/v2/type/<name> (fire=10, water=11, etc.).
const TYPE_IDS: Record<string, number> = {
  normal: 1,
  fighting: 2,
  flying: 3,
  poison: 4,
  ground: 5,
  rock: 6,
  bug: 7,
  ghost: 8,
  steel: 9,
  fire: 10,
  water: 11,
  grass: 12,
  electric: 13,
  psychic: 14,
  ice: 15,
  dragon: 16,
  dark: 17,
  fairy: 18,
};

const TYPE_ICON_BASE =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-ix/scarlet-violet/small';

export function getTypeIconUrl(type: string): string | undefined {
  const id = TYPE_IDS[type.toLowerCase()];
  if (!id) return undefined;
  return `${TYPE_ICON_BASE}/${id}.png`;
}
