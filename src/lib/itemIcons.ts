// Unlike species/moves, PokeAPI's item sprites are indexed directly by
// slugified name — no numeric id table needed. An item name that doesn't
// match a real file just 404s; callers already handle a failed image load
// gracefully (onError), same pattern as species sprites and type icons.
const ITEM_ICON_BASE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items';

function slugify(item: string): string {
  return item
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

export function getItemIconUrl(item: string): string {
  return `${ITEM_ICON_BASE}/${slugify(item)}.png`;
}
