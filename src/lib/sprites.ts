// NOTE: this is a best-effort slugifier for the common case (base forms).
// Mega/regional/alternate forms (e.g. "Salamence" during Mega Evolution,
// "Raichu-Alola") are not specially handled in v1 and may resolve to the
// wrong or a missing sprite — acceptable known limitation, documented here
// rather than in code comments scattered elsewhere.
export function getSpriteUrl(species: string): string {
  const slug = species
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
  return `https://play.pokemonshowdown.com/sprites/gen5/${slug}.png`;
}
