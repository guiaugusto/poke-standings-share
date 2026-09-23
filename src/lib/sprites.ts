import pokemonSpriteIds from '../data/pokemon-sprite-ids.json';

// Static name -> PokeAPI numeric id table, generated once from
// https://pokeapi.co/api/v2/pokemon?limit=2000 and committed to the repo
// (src/data/pokemon-sprite-ids.json). No network call happens at build or
// render time to resolve it — this keeps the "no network I/O" constraint
// the rest of the site follows. Regenerate it by re-running that fetch
// whenever a new generation of Pokémon is added.
const SPRITE_IDS: Record<string, number> = pokemonSpriteIds;

const SPRITE_BASE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';

// NOTE: PokeAPI's `pokemon` resource keys alternate forms (regional,
// mega, gmax, etc.) under their own name, e.g. "raichu-alola" or
// "charizard-mega-x" — the same slug shape Showdown's export text already
// uses, just lowercased. A handful of species Showdown lets you write bare
// (defaulting to a specific form) have no bare entry in PokeAPI's table —
// only the form-suffixed name exists there. The generation script adds an
// alias entry for the ones most common in VGC (Urshifu, and the Forces of
// Nature quartet); anything else in that situation is a known, accepted
// gap, same as unmapped mega/regional forms. A species/form not present in
// the table at all falls back to id 0 — which PokeAPI's sprite set actually
// resolves to a real "unknown Pokémon" question-mark icon (not a 404), so
// an unmapped species degrades to that icon automatically. getUnknownSpriteUrl()
// below exposes this same id-0 icon directly, for UI that wants it on
// purpose rather than as a fallback (e.g. a "no team" placeholder slot).
export function slugify(species: string): string {
  return species
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

// A handful of species (Basculegion, Indeedee, Meowstic, Oinkologne, and a
// few older ones) have no gender-neutral entry in PokeAPI's table at all —
// male and female are different `pokemon` resources with different ids,
// only reachable as "<species>-male"/"<species>-female". When the bare slug
// isn't found, try the parsed gender's variant first, then whichever
// gendered variant exists (some of these, like Pyroar, only have "-male"),
// before finally giving up.
export function getSpriteUrl(species: string, gender?: 'M' | 'F'): string {
  const slug = slugify(species);
  const id =
    SPRITE_IDS[slug] ??
    (gender && SPRITE_IDS[`${slug}-${gender === 'F' ? 'female' : 'male'}`]) ??
    SPRITE_IDS[`${slug}-male`] ??
    SPRITE_IDS[`${slug}-female`] ??
    0;
  return `${SPRITE_BASE}/${id}.png`;
}

export function getUnknownSpriteUrl(): string {
  return `${SPRITE_BASE}/0.png`;
}
