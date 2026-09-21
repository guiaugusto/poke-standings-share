export type StatKey = 'hp' | 'atk' | 'def' | 'spa' | 'spd' | 'spe';

export interface ParsedPokemon {
  species: string;
  nickname?: string;
  item?: string;
  ability?: string;
  level?: number;
  nature?: string;
  teraType?: string;
  evs?: Partial<Record<StatKey, number>>;
  ivs?: Partial<Record<StatKey, number>>;
  moves: string[];
}

const STAT_ABBREVIATIONS: Record<string, StatKey> = {
  HP: 'hp',
  Atk: 'atk',
  Def: 'def',
  SpA: 'spa',
  SpD: 'spd',
  Spe: 'spe',
};

function parseStatLine(value: string): Partial<Record<StatKey, number>> {
  const stats: Partial<Record<StatKey, number>> = {};
  for (const part of value.split('/')) {
    const [rawValue, rawAbbrev] = part.trim().split(/\s+/);
    const key = STAT_ABBREVIATIONS[rawAbbrev];
    const numericValue = Number(rawValue);
    if (key && Number.isFinite(numericValue)) {
      stats[key] = numericValue;
    }
  }
  return stats;
}

function isFieldLine(line: string): boolean {
  return (
    line.startsWith('- ') ||
    line.startsWith('Ability:') ||
    line.startsWith('Level:') ||
    line.startsWith('Tera Type:') ||
    line.startsWith('EVs:') ||
    line.startsWith('IVs:') ||
    /^\w+\s+Nature$/i.test(line)
  );
}

function parseHeaderLine(header: string): { species: string; nickname?: string; item?: string } | undefined {
  const [namePartRaw, itemRaw] = header.split(/\s+@\s+/);
  let namePart = namePartRaw?.trim();
  if (!namePart) return undefined;

  // A gender marker is its own trailing "(M)"/"(F)", separate from — and always
  // after — a nickname/species parenthetical: "Merlin (Delphox) (M)". Strip it
  // first so the nickname/species match below never has to treat it as part of
  // that pair.
  const genderMatch = namePart.match(/^(.*)\s\((M|F)\)$/);
  if (genderMatch) {
    namePart = genderMatch[1].trim();
  }

  const parenMatch = namePart.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
  if (parenMatch) {
    const [, before, inside] = parenMatch;
    return { species: inside.trim(), nickname: before.trim(), item: itemRaw?.trim() };
  }

  return { species: namePart, item: itemRaw?.trim() };
}

export function parseShowdownTeam(raw: string): ParsedPokemon[] {
  const blocks = raw
    .trim()
    .split(/\r?\n\s*\r?\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  const team: ParsedPokemon[] = [];

  for (const block of blocks) {
    const lines = block.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    const [headerLine, ...rest] = lines;
    const header = headerLine && !isFieldLine(headerLine) ? parseHeaderLine(headerLine) : undefined;

    if (!header) {
      console.warn(`[showdownParser] Skipping block with no parseable species:\n${block}`);
      continue;
    }

    const mon: ParsedPokemon = { species: header.species, moves: [] };
    if (header.nickname) mon.nickname = header.nickname;
    if (header.item) mon.item = header.item;

    for (const line of rest) {
      if (line.startsWith('- ')) {
        mon.moves.push(line.slice(2).trim());
      } else if (line.startsWith('Ability:')) {
        mon.ability = line.slice('Ability:'.length).trim();
      } else if (line.startsWith('Level:')) {
        mon.level = Number(line.slice('Level:'.length).trim());
      } else if (line.startsWith('Tera Type:')) {
        mon.teraType = line.slice('Tera Type:'.length).trim();
      } else if (line.startsWith('EVs:')) {
        mon.evs = parseStatLine(line.slice('EVs:'.length));
      } else if (line.startsWith('IVs:')) {
        mon.ivs = parseStatLine(line.slice('IVs:'.length));
      } else {
        const natureMatch = line.match(/^(\w+)\s+Nature$/i);
        if (natureMatch) mon.nature = natureMatch[1];
      }
    }

    team.push(mon);
  }

  return team;
}
