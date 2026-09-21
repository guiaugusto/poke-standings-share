# Tournament Standings Publishing Tool Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Astro + React static site (GitHub Template repo) that lets a shop publish VGC tournament results by editing one YAML file, with a standings table, per-tournament usage stats, and a click-to-open team modal — all data self-contained in the YAML, no network calls at build or runtime.

**Architecture:** Astro generates static HTML from YAML files under `data/tournaments/`. A small set of pure TypeScript modules (`src/lib/`) parse the embedded Showdown-export team text and compute usage statistics; Astro pages call these at build time. The only client-side JavaScript is a single React island (`TournamentInteractive`) per tournament page that renders the sortable standings table, the usage-stats charts, and the team modal, sharing state within one hydration boundary.

**Tech Stack:** Astro 5, React 18 (via `@astrojs/react`), TypeScript, `js-yaml`, `zod` (schema validation), `recharts` (charts), Vitest + `@testing-library/react` (tests), GitHub Actions + `actions/deploy-pages` (deploy).

**Spec:** `docs/superpowers/specs/2026-09-21-tournament-standings-design.md`

## Global Constraints

- No network I/O anywhere in the build or in the browser — all team data comes from the `team` field embedded in each tournament's YAML (per spec's "Why no fetch pipeline").
- Tournament data files live at `data/tournaments/*.yml`; `data/tournaments/_template.yml` is the shop-facing template and MUST be excluded from parsing/listing.
- The `team` field is the raw Pokémon Showdown export text (block scalar `|` in YAML) — the single source of truth for rendering the team modal and for usage stats.
- `pokepaste` is an optional field, informational only — never fetched or parsed.
- Per-player fields are exactly: `rank`, `nick`, `pokepaste` (optional), `wins`, `losses`, `ties`, `points`, `team`. No extra fields (no flag/country, no top-cut placement, no per-position prize) per spec's non-goals.
- Node 20 in CI. Repository's default branch is `master` (not `main`) — the deploy workflow triggers on `master`.
- GitHub Pages project-site base path must work for any fork without manual editing (derive from `GITHUB_REPOSITORY` in CI).

---

## File Structure

```
package.json, astro.config.mjs, tsconfig.json, vitest.config.ts, .gitignore
data/tournaments/
  _template.yml              # shop-facing commented template (excluded from build)
  example-tournament.yml     # demo tournament, doubles as build smoke-test fixture
tests/
  setup.ts                   # jest-dom matchers for RTL
  fixtures/tournaments/*.yml # small fixtures for loader tests (isolated from real data)
src/
  lib/
    showdownParser.ts        # raw Showdown text -> ParsedPokemon[]
    showdownParser.test.ts
    tournaments.ts           # reads data/tournaments/*.yml -> Tournament[]
    tournaments.test.ts
    usageStats.ts             # ParsedPokemon[][] -> UsageStats
    usageStats.test.ts
    tournamentViewModel.ts    # combines the three above -> TournamentViewModel
    tournamentViewModel.test.ts
    sprites.ts                # species name -> sprite URL
    sprites.test.ts
  components/
    StandingsTable.tsx
    StandingsTable.test.tsx
    TeamModal.tsx
    TeamModal.test.tsx
    UsageStatsChart.tsx
    UsageStatsChart.test.tsx
    TournamentInteractive.tsx
  layouts/
    BaseLayout.astro
  pages/
    index.astro
    tournaments/[slug].astro
  styles/
    global.css
.github/workflows/deploy.yml
README.md (updated)
```

---

### Task 1: Project scaffold (Astro + React + TypeScript + Vitest)

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `vitest.config.ts`
- Create: `tests/setup.ts`
- Create: `.gitignore`
- Create: `src/pages/index.astro` (placeholder, replaced in Task 7)
- Create: `src/styles/global.css` (empty base reset, filled more in Task 7)

**Interfaces:**
- Produces: a working `npm run dev`, `npm run build`, and `npm test` for every later task to build on.

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "poke-standings-share",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "test": "vitest run"
  },
  "dependencies": {
    "astro": "^5.0.0",
    "@astrojs/react": "^4.0.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "js-yaml": "^4.1.0",
    "zod": "^3.23.0",
    "recharts": "^2.12.0"
  },
  "devDependencies": {
    "@types/js-yaml": "^4.0.9",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "@testing-library/react": "^16.0.0",
    "@testing-library/jest-dom": "^6.4.0",
    "jsdom": "^24.0.0",
    "typescript": "^5.5.0",
    "vitest": "^2.0.0"
  }
}
```

- [ ] **Step 2: Create `astro.config.mjs`**

```js
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// GitHub Pages project sites are served at /<repo-name>/, and the repo name
// differs for every shop that forks this template. Deriving it from
// GITHUB_REPOSITORY (set automatically in GitHub Actions) means a shop never
// has to edit this file after forking.
const repoFullName = process.env.GITHUB_REPOSITORY; // "owner/repo"
const [owner, repo] = repoFullName ? repoFullName.split('/') : [undefined, undefined];

export default defineConfig({
  integrations: [react()],
  site: owner ? `https://${owner}.github.io/${repo}` : undefined,
  base: repo ? `/${repo}` : '/',
});
```

- [ ] **Step 3: Create `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": ["src/**/*", "tests/**/*"],
  "compilerOptions": {
    "jsx": "react-jsx"
  }
}
```

- [ ] **Step 4: Create `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
  },
});
```

- [ ] **Step 5: Create `tests/setup.ts`**

```ts
import '@testing-library/jest-dom/vitest';
```

- [ ] **Step 6: Create `.gitignore`**

```
node_modules/
dist/
.astro/
```

- [ ] **Step 7: Create placeholder `src/pages/index.astro`**

```astro
---
---
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <title>Poke Standings Share</title>
  </head>
  <body>
    <h1>Poke Standings Share</h1>
    <p>Scaffold OK.</p>
  </body>
</html>
```

- [ ] **Step 8: Create empty `src/styles/global.css`**

```css
/* filled in Task 7 */
```

- [ ] **Step 9: Install dependencies and verify the toolchain**

Run: `npm install`
Run: `npm run build`
Expected: build succeeds, `dist/index.html` exists containing "Scaffold OK.".

Run: `npm test`
Expected: passes with "No test files found" (no tests yet — this just confirms Vitest itself runs).

- [ ] **Step 10: Commit**

```bash
git add package.json astro.config.mjs tsconfig.json vitest.config.ts tests/setup.ts .gitignore src/pages/index.astro src/styles/global.css package-lock.json
git commit -m "chore: scaffold Astro + React + Vitest project"
```

---

### Task 2: Showdown-export parser

**Files:**
- Create: `src/lib/showdownParser.ts`
- Test: `src/lib/showdownParser.test.ts`

**Interfaces:**
- Produces:
  - `interface ParsedPokemon { species: string; nickname?: string; item?: string; ability?: string; level?: number; nature?: string; teraType?: string; evs?: Partial<Record<'hp'|'atk'|'def'|'spa'|'spd'|'spe', number>>; ivs?: Partial<Record<'hp'|'atk'|'def'|'spa'|'spd'|'spe', number>>; moves: string[]; }`
  - `function parseShowdownTeam(raw: string): ParsedPokemon[]`

- [ ] **Step 1: Write the failing tests**

```ts
// src/lib/showdownParser.test.ts
import { describe, it, expect } from 'vitest';
import { parseShowdownTeam } from './showdownParser';

describe('parseShowdownTeam', () => {
  it('parses a standard team with item, ability, EVs, nature, and 4 moves', () => {
    const raw = `
Raichu @ Raichunite Y
Ability: Lightning Rod
Level: 50
EVs: 240 HP / 88 Def / 16 SpA / 184 Spe
Timid Nature
- Zap Cannon
- Focus Blast
- Fake Out
- Protect

Salamence @ Salamencite
Ability: Intimidate
Level: 50
EVs: 16 HP / 252 Atk / 252 Spe
Jolly Nature
- Slash
- Dragon Claw
- Tailwind
- Protect
`;
    const result = parseShowdownTeam(raw);
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      species: 'Raichu',
      item: 'Raichunite Y',
      ability: 'Lightning Rod',
      level: 50,
      nature: 'Timid',
      evs: { hp: 240, def: 88, spa: 16, spe: 184 },
      moves: ['Zap Cannon', 'Focus Blast', 'Fake Out', 'Protect'],
    });
    expect(result[1].species).toBe('Salamence');
    expect(result[1].item).toBe('Salamencite');
  });

  it('parses a Pokemon with no item line', () => {
    const raw = `
Incineroar
Ability: Intimidate
Level: 50
EVs: 240 HP / 24 Atk / 64 Def / 160 SpD / 40 Spe
Careful Nature
- Flare Blitz
- Throat Chop
- Parting Shot
- Fake Out
`;
    const [mon] = parseShowdownTeam(raw);
    expect(mon.species).toBe('Incineroar');
    expect(mon.item).toBeUndefined();
  });

  it('parses Tera Type when present', () => {
    const raw = `
Gholdengo @ Life Orb
Ability: Good as Gold
Level: 50
Tera Type: Flying
EVs: 216 HP / 136 Def / 56 SpA / 56 SpD / 64 Spe
Modest Nature
- Make It Rain
- Shadow Ball
- Nasty Plot
- Protect
`;
    const [mon] = parseShowdownTeam(raw);
    expect(mon.teraType).toBe('Flying');
  });

  it('parses a nicknamed Pokemon, distinguishing nickname from species', () => {
    const raw = `
Chompy (Garchomp) @ Focus Sash
Ability: Rough Skin
Level: 50
Jolly Nature
- Dragon Claw
- Earthquake
- Rock Slide
- Protect
`;
    const [mon] = parseShowdownTeam(raw);
    expect(mon.nickname).toBe('Chompy');
    expect(mon.species).toBe('Garchomp');
  });

  it('does not treat a gender marker as a nickname', () => {
    const raw = `
Incineroar (M) @ Sitrus Berry
Ability: Intimidate
Level: 50
Careful Nature
- Flare Blitz
- Throat Chop
- Parting Shot
- Fake Out
`;
    const [mon] = parseShowdownTeam(raw);
    expect(mon.nickname).toBeUndefined();
    expect(mon.species).toBe('Incineroar');
  });

  it('skips a malformed block with no species instead of throwing', () => {
    const raw = `
Raichu @ Raichunite Y
Ability: Lightning Rod
Level: 50
Timid Nature
- Zap Cannon
- Protect

Ability: Intimidate
- Some Move
`;
    expect(() => parseShowdownTeam(raw)).not.toThrow();
    const result = parseShowdownTeam(raw);
    expect(result).toHaveLength(1);
    expect(result[0].species).toBe('Raichu');
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- showdownParser`
Expected: FAIL — `showdownParser.ts` does not exist yet.

- [ ] **Step 3: Implement the parser**

```ts
// src/lib/showdownParser.ts
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
  const namePart = namePartRaw?.trim();
  if (!namePart) return undefined;

  const parenMatch = namePart.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
  if (parenMatch) {
    const [, before, inside] = parenMatch;
    if (inside === 'M' || inside === 'F') {
      // Gender marker, not a nickname: "Incineroar (M)" -> species is "Incineroar".
      return { species: before.trim(), item: itemRaw?.trim() };
    }
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
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- showdownParser`
Expected: PASS (all 6 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/showdownParser.ts src/lib/showdownParser.test.ts
git commit -m "feat: add Showdown-export team parser"
```

---

### Task 3: Tournament YAML loader

**Files:**
- Create: `src/lib/tournaments.ts`
- Test: `src/lib/tournaments.test.ts`
- Create: `tests/fixtures/tournaments/copa-primavera.yml`
- Create: `tests/fixtures/tournaments/_template.yml` (to prove exclusion)
- Create: `tests/fixtures/tournaments/invalid-tournament.yml` (missing required field, to prove validation)

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces:
  - `interface PlayerEntry { rank: number; nick: string; pokepaste?: string; wins: number; losses: number; ties: number; points: number; team: string; }`
  - `interface Tournament { slug: string; name: string; date: string; format?: string; prize?: string; players: PlayerEntry[]; }`
  - `function loadTournaments(dir?: string): Tournament[]` (sorted by `date` descending)
  - `function loadTournamentBySlug(slug: string, dir?: string): Tournament | undefined`

- [ ] **Step 1: Create fixture files**

```yaml
# tests/fixtures/tournaments/copa-primavera.yml
name: "Copa Primavera VGC"
date: 2026-03-15
format: "VGC Reg I"
prize: "R$500 em produtos"
players:
  - rank: 1
    nick: "Joseph Ugarte"
    pokepaste: "https://pokepast.es/34ec1c9714792760"
    wins: 6
    losses: 1
    ties: 0
    points: 18
    team: |
      Raichu @ Raichunite Y
      Ability: Lightning Rod
      Level: 50
      EVs: 240 HP / 88 Def / 16 SpA / 184 Spe
      Timid Nature
      - Zap Cannon
      - Focus Blast
      - Fake Out
      - Protect
  - rank: 2
    nick: "Ana Souza"
    wins: 5
    losses: 2
    ties: 0
    points: 15
    team: |
      Incineroar @ Sitrus Berry
      Ability: Intimidate
      Level: 50
      Careful Nature
      - Flare Blitz
      - Throat Chop
      - Parting Shot
      - Fake Out
```

```yaml
# tests/fixtures/tournaments/_template.yml
name: "TEMPLATE — should never be loaded"
date: 2000-01-01
players: []
```

```yaml
# tests/fixtures/tournaments/invalid-tournament.yml
name: "Missing Players Field"
date: 2026-01-01
```

- [ ] **Step 2: Write the failing tests**

```ts
// src/lib/tournaments.test.ts
import path from 'node:path';
import { describe, it, expect } from 'vitest';
import { loadTournaments, loadTournamentBySlug } from './tournaments';

const FIXTURES_DIR = path.join(__dirname, '../../tests/fixtures/tournaments');
// A second fixtures dir without the invalid file, used for tests that load everything.
const VALID_FIXTURES_DIR = path.join(__dirname, '../../tests/fixtures/valid-tournaments');

describe('loadTournaments', () => {
  it('loads tournaments from yml files, excluding files starting with underscore', () => {
    const tournaments = loadTournaments(VALID_FIXTURES_DIR);
    const names = tournaments.map((t) => t.name);
    expect(names).toContain('Copa Primavera VGC');
    expect(names).not.toContain('TEMPLATE — should never be loaded');
  });

  it('derives the slug from the filename', () => {
    const tournaments = loadTournaments(VALID_FIXTURES_DIR);
    const copa = tournaments.find((t) => t.name === 'Copa Primavera VGC');
    expect(copa?.slug).toBe('copa-primavera');
  });

  it('normalizes the date to an ISO date string even though js-yaml parses it as a Date', () => {
    const tournaments = loadTournaments(VALID_FIXTURES_DIR);
    const copa = tournaments.find((t) => t.name === 'Copa Primavera VGC');
    expect(copa?.date).toBe('2026-03-15');
  });

  it('sorts tournaments by date descending', () => {
    const tournaments = loadTournaments(VALID_FIXTURES_DIR);
    const dates = tournaments.map((t) => t.date);
    const sorted = [...dates].sort().reverse();
    expect(dates).toEqual(sorted);
  });

  it('throws a clear error when a tournament file fails schema validation', () => {
    expect(() => loadTournaments(FIXTURES_DIR)).toThrow(/invalid-tournament\.yml/);
  });
});

describe('loadTournamentBySlug', () => {
  it('returns the matching tournament', () => {
    const tournament = loadTournamentBySlug('copa-primavera', VALID_FIXTURES_DIR);
    expect(tournament?.name).toBe('Copa Primavera VGC');
  });

  it('returns undefined when no tournament matches', () => {
    expect(loadTournamentBySlug('does-not-exist', VALID_FIXTURES_DIR)).toBeUndefined();
  });
});
```

- [ ] **Step 3: Create the second fixtures directory (valid-only) used above**

```bash
mkdir -p tests/fixtures/valid-tournaments
cp tests/fixtures/tournaments/copa-primavera.yml tests/fixtures/valid-tournaments/copa-primavera.yml
cp tests/fixtures/tournaments/_template.yml tests/fixtures/valid-tournaments/_template.yml
```

Also add a second valid tournament with an earlier date, to make the sort-order test meaningful:

```yaml
# tests/fixtures/valid-tournaments/copa-outono.yml
name: "Copa Outono VGC"
date: 2025-06-01
players:
  - rank: 1
    nick: "Bruno Lima"
    wins: 4
    losses: 0
    ties: 0
    points: 12
    team: |
      Gholdengo @ Life Orb
      Ability: Good as Gold
      Level: 50
      Modest Nature
      - Make It Rain
      - Shadow Ball
      - Nasty Plot
      - Protect
```

- [ ] **Step 4: Run tests to verify they fail**

Run: `npm test -- tournaments`
Expected: FAIL — `tournaments.ts` does not exist yet.

- [ ] **Step 5: Implement the loader**

```ts
// src/lib/tournaments.ts
import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import { z } from 'zod';

const playerSchema = z.object({
  rank: z.number().int().positive(),
  nick: z.string().min(1),
  pokepaste: z.string().url().optional(),
  wins: z.number().int().nonnegative(),
  losses: z.number().int().nonnegative(),
  ties: z.number().int().nonnegative(),
  points: z.number(),
  team: z.string().min(1),
});

const tournamentSchema = z.object({
  name: z.string().min(1),
  date: z.union([z.string(), z.date()]),
  format: z.string().optional(),
  prize: z.string().optional(),
  players: z.array(playerSchema).min(1),
});

export type PlayerEntry = z.infer<typeof playerSchema>;

export interface Tournament {
  slug: string;
  name: string;
  date: string;
  format?: string;
  prize?: string;
  players: PlayerEntry[];
}

const DEFAULT_DIR = path.join(process.cwd(), 'data/tournaments');

function toIsoDate(value: string | Date): string {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }
  return value;
}

function slugFromFilename(filename: string): string {
  return path.basename(filename, path.extname(filename));
}

export function loadTournaments(dir: string = DEFAULT_DIR): Tournament[] {
  const files = fs
    .readdirSync(dir)
    .filter((file) => (file.endsWith('.yml') || file.endsWith('.yaml')) && !file.startsWith('_'));

  const tournaments = files.map((file) => {
    const fullPath = path.join(dir, file);
    const raw = fs.readFileSync(fullPath, 'utf-8');
    const data = yaml.load(raw);

    const result = tournamentSchema.safeParse(data);
    if (!result.success) {
      throw new Error(`Invalid tournament file ${file}: ${result.error.message}`);
    }

    return {
      slug: slugFromFilename(file),
      ...result.data,
      date: toIsoDate(result.data.date),
    };
  });

  return tournaments.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function loadTournamentBySlug(slug: string, dir: string = DEFAULT_DIR): Tournament | undefined {
  return loadTournaments(dir).find((t) => t.slug === slug);
}
```

- [ ] **Step 6: Run tests to verify they pass**

Run: `npm test -- tournaments`
Expected: PASS (7 tests).

- [ ] **Step 7: Commit**

```bash
git add src/lib/tournaments.ts src/lib/tournaments.test.ts tests/fixtures
git commit -m "feat: add tournament YAML loader with schema validation"
```

---

### Task 4: Usage stats aggregation

**Files:**
- Create: `src/lib/usageStats.ts`
- Test: `src/lib/usageStats.test.ts`

**Interfaces:**
- Consumes: `ParsedPokemon` from `src/lib/showdownParser.ts` (Task 2).
- Produces:
  - `interface UsageStats { topSpecies: { species: string; count: number }[]; topItems: { item: string; count: number }[]; topPairs: { pair: [string, string]; count: number }[]; topTrios: { trio: [string, string, string]; count: number }[]; }`
  - `function computeUsageStats(teams: ParsedPokemon[][]): UsageStats`

- [ ] **Step 1: Write the failing tests**

```ts
// src/lib/usageStats.test.ts
import { describe, it, expect } from 'vitest';
import { computeUsageStats } from './usageStats';
import type { ParsedPokemon } from './showdownParser';

function mon(species: string, item?: string): ParsedPokemon {
  return { species, item, moves: [] };
}

describe('computeUsageStats', () => {
  const teams: ParsedPokemon[][] = [
    [mon('Incineroar', 'Sitrus Berry'), mon('Salamence', 'Salamencite')],
    [mon('Incineroar', 'Sitrus Berry'), mon('Gholdengo', 'Life Orb')],
    [mon('Salamence', 'Safety Goggles'), mon('Gholdengo', 'Life Orb'), mon('Incineroar')],
  ];

  it('counts species usage across all teams, sorted descending', () => {
    const stats = computeUsageStats(teams);
    expect(stats.topSpecies[0]).toEqual({ species: 'Incineroar', count: 3 });
  });

  it('counts item usage, ignoring Pokemon with no item', () => {
    const stats = computeUsageStats(teams);
    const sitrus = stats.topItems.find((i) => i.item === 'Sitrus Berry');
    expect(sitrus).toEqual({ item: 'Sitrus Berry', count: 2 });
    expect(stats.topItems.some((i) => i.item === undefined)).toBe(false);
  });

  it('counts species pairs that co-occur within the same team', () => {
    const stats = computeUsageStats(teams);
    const pair = stats.topPairs.find(
      (p) => p.pair.includes('Incineroar') && p.pair.includes('Salamence'),
    );
    expect(pair?.count).toBe(2);
  });

  it('counts species trios that co-occur within the same team', () => {
    const stats = computeUsageStats(teams);
    const trio = stats.topTrios.find(
      (t) => t.trio.includes('Incineroar') && t.trio.includes('Salamence') && t.trio.includes('Gholdengo'),
    );
    expect(trio?.count).toBe(1);
  });

  it('returns empty arrays for an empty input', () => {
    const stats = computeUsageStats([]);
    expect(stats).toEqual({ topSpecies: [], topItems: [], topPairs: [], topTrios: [] });
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- usageStats`
Expected: FAIL — `usageStats.ts` does not exist yet.

- [ ] **Step 3: Implement the aggregation**

```ts
// src/lib/usageStats.ts
import type { ParsedPokemon } from './showdownParser';

export interface UsageStats {
  topSpecies: { species: string; count: number }[];
  topItems: { item: string; count: number }[];
  topPairs: { pair: [string, string]; count: number }[];
  topTrios: { trio: [string, string, string]; count: number }[];
}

function countBy<T>(items: T[], key: (item: T) => string | undefined): { value: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const item of items) {
    const k = key(item);
    if (!k) continue;
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count);
}

function combinations<T>(items: T[], size: number): T[][] {
  if (size > items.length) return [];
  if (size === 0) return [[]];
  const [first, ...rest] = items;
  const withFirst = combinations(rest, size - 1).map((combo) => [first, ...combo]);
  const withoutFirst = combinations(rest, size);
  return [...withFirst, ...withoutFirst];
}

function countCombinations(teams: ParsedPokemon[][], size: number): { combo: string[]; count: number }[] {
  const counts = new Map<string, string[]>();
  const tally = new Map<string, number>();

  for (const team of teams) {
    const speciesList = team.map((mon) => mon.species);
    for (const combo of combinations(speciesList, size)) {
      const key = [...combo].sort().join('|');
      counts.set(key, combo);
      tally.set(key, (tally.get(key) ?? 0) + 1);
    }
  }

  return [...tally.entries()]
    .map(([key, count]) => ({ combo: counts.get(key)!, count }))
    .sort((a, b) => b.count - a.count);
}

export function computeUsageStats(teams: ParsedPokemon[][]): UsageStats {
  const allMons = teams.flat();

  const topSpecies = countBy(allMons, (mon) => mon.species).map(({ value, count }) => ({
    species: value,
    count,
  }));

  const topItems = countBy(allMons, (mon) => mon.item).map(({ value, count }) => ({
    item: value,
    count,
  }));

  const topPairs = countCombinations(teams, 2).map(({ combo, count }) => ({
    pair: combo as [string, string],
    count,
  }));

  const topTrios = countCombinations(teams, 3).map(({ combo, count }) => ({
    trio: combo as [string, string, string],
    count,
  }));

  return { topSpecies, topItems, topPairs, topTrios };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- usageStats`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/usageStats.ts src/lib/usageStats.test.ts
git commit -m "feat: add usage stats aggregation (species, items, pairs, trios)"
```

---

### Task 5: Tournament view model

**Files:**
- Create: `src/lib/tournamentViewModel.ts`
- Test: `src/lib/tournamentViewModel.test.ts`

**Interfaces:**
- Consumes: `Tournament`, `PlayerEntry` from `src/lib/tournaments.ts` (Task 3); `parseShowdownTeam`, `ParsedPokemon` from `src/lib/showdownParser.ts` (Task 2); `computeUsageStats`, `UsageStats` from `src/lib/usageStats.ts` (Task 4).
- Produces:
  - `interface PlayerWithTeam extends PlayerEntry { parsedTeam: ParsedPokemon[]; }`
  - `interface TournamentViewModel extends Omit<Tournament, 'players'> { players: PlayerWithTeam[]; usageStats: UsageStats; }`
  - `function buildTournamentViewModel(tournament: Tournament): TournamentViewModel`

- [ ] **Step 1: Write the failing test**

```ts
// src/lib/tournamentViewModel.test.ts
import { describe, it, expect } from 'vitest';
import { buildTournamentViewModel } from './tournamentViewModel';
import type { Tournament } from './tournaments';

const tournament: Tournament = {
  slug: 'copa-primavera',
  name: 'Copa Primavera VGC',
  date: '2026-03-15',
  players: [
    {
      rank: 1,
      nick: 'Joseph Ugarte',
      wins: 6,
      losses: 1,
      ties: 0,
      points: 18,
      team: 'Incineroar @ Sitrus Berry\nAbility: Intimidate\nLevel: 50\nCareful Nature\n- Flare Blitz\n- Fake Out',
    },
  ],
};

describe('buildTournamentViewModel', () => {
  it('attaches a parsedTeam to every player', () => {
    const vm = buildTournamentViewModel(tournament);
    expect(vm.players[0].parsedTeam[0].species).toBe('Incineroar');
  });

  it('preserves the original player fields alongside parsedTeam', () => {
    const vm = buildTournamentViewModel(tournament);
    expect(vm.players[0].nick).toBe('Joseph Ugarte');
    expect(vm.players[0].points).toBe(18);
  });

  it('computes usageStats across all players parsed teams', () => {
    const vm = buildTournamentViewModel(tournament);
    expect(vm.usageStats.topSpecies).toEqual([{ species: 'Incineroar', count: 1 }]);
  });

  it('preserves tournament-level fields', () => {
    const vm = buildTournamentViewModel(tournament);
    expect(vm.name).toBe('Copa Primavera VGC');
    expect(vm.slug).toBe('copa-primavera');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tournamentViewModel`
Expected: FAIL — `tournamentViewModel.ts` does not exist yet.

- [ ] **Step 3: Implement the view model builder**

```ts
// src/lib/tournamentViewModel.ts
import { parseShowdownTeam, type ParsedPokemon } from './showdownParser';
import { computeUsageStats, type UsageStats } from './usageStats';
import type { Tournament, PlayerEntry } from './tournaments';

export interface PlayerWithTeam extends PlayerEntry {
  parsedTeam: ParsedPokemon[];
}

export interface TournamentViewModel extends Omit<Tournament, 'players'> {
  players: PlayerWithTeam[];
  usageStats: UsageStats;
}

export function buildTournamentViewModel(tournament: Tournament): TournamentViewModel {
  const players: PlayerWithTeam[] = tournament.players.map((player) => ({
    ...player,
    parsedTeam: parseShowdownTeam(player.team),
  }));

  const usageStats = computeUsageStats(players.map((p) => p.parsedTeam));

  return { ...tournament, players, usageStats };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- tournamentViewModel`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/tournamentViewModel.ts src/lib/tournamentViewModel.test.ts
git commit -m "feat: add tournament view model combining parsed teams and usage stats"
```

---

### Task 6: Sprite URL helper

**Files:**
- Create: `src/lib/sprites.ts`
- Test: `src/lib/sprites.test.ts`

**Interfaces:**
- Produces: `function getSpriteUrl(species: string): string`

- [ ] **Step 1: Write the failing tests**

```ts
// src/lib/sprites.test.ts
import { describe, it, expect } from 'vitest';
import { getSpriteUrl } from './sprites';

describe('getSpriteUrl', () => {
  it('lowercases the species name', () => {
    expect(getSpriteUrl('Incineroar')).toBe('https://play.pokemonshowdown.com/sprites/gen5/incineroar.png');
  });

  it('replaces spaces with hyphens', () => {
    expect(getSpriteUrl('Tapu Koko')).toBe('https://play.pokemonshowdown.com/sprites/gen5/tapu-koko.png');
  });

  it('strips characters that are not letters, digits, or hyphens', () => {
    expect(getSpriteUrl("Sirfetch'd")).toBe('https://play.pokemonshowdown.com/sprites/gen5/sirfetchd.png');
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- sprites`
Expected: FAIL — `sprites.ts` does not exist yet.

- [ ] **Step 3: Implement the helper**

```ts
// src/lib/sprites.ts
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
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- sprites`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/sprites.ts src/lib/sprites.test.ts
git commit -m "feat: add sprite URL helper"
```

---

### Task 7: Base layout and home page

**Files:**
- Create: `src/layouts/BaseLayout.astro`
- Modify: `src/pages/index.astro` (replace placeholder from Task 1)
- Modify: `src/styles/global.css` (replace empty placeholder from Task 1)

**Interfaces:**
- Consumes: `loadTournaments` from `src/lib/tournaments.ts` (Task 3).

- [ ] **Step 1: Create `src/layouts/BaseLayout.astro`**

```astro
---
import '../styles/global.css';

interface Props {
  title: string;
}

const { title } = Astro.props as Props;
---
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title} — Poke Standings</title>
  </head>
  <body>
    <header class="site-header">
      <a href={import.meta.env.BASE_URL}>Poke Standings</a>
    </header>
    <main>
      <slot />
    </main>
  </body>
</html>
```

- [ ] **Step 2: Replace `src/pages/index.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import { loadTournaments } from '../lib/tournaments';

const tournaments = loadTournaments();
---
<BaseLayout title="Torneios">
  <h1>Torneios</h1>
  {tournaments.length === 0 && <p>Nenhum torneio publicado ainda.</p>}
  <ul class="tournament-list">
    {tournaments.map((t) => (
      <li>
        <a href={`${import.meta.env.BASE_URL}tournaments/${t.slug}/`}>{t.name}</a>
        <span class="tournament-meta">
          {t.date}
          {t.format && ` · ${t.format}`}
        </span>
      </li>
    ))}
  </ul>
</BaseLayout>
```

- [ ] **Step 3: Replace `src/styles/global.css`**

```css
:root {
  color-scheme: light dark;
  font-family: system-ui, sans-serif;
}

body {
  margin: 0 auto;
  max-width: 960px;
  padding: 0 1rem 3rem;
}

.site-header {
  padding: 1rem 0;
  font-weight: bold;
}

.site-header a {
  text-decoration: none;
  color: inherit;
}

.tournament-list {
  list-style: none;
  padding: 0;
}

.tournament-list li {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid #ccc;
}

.tournament-meta {
  color: #666;
}
```

- [ ] **Step 4: Add a real tournament file so the home page has content to show, then build**

```bash
mkdir -p data/tournaments
cp tests/fixtures/valid-tournaments/copa-primavera.yml data/tournaments/copa-primavera.yml
```

Run: `npm run build`
Expected: build succeeds; `dist/index.html` contains "Copa Primavera VGC".

Run: `npm test`
Expected: all existing tests still pass (this task adds no new lib tests — verified manually via build).

- [ ] **Step 5: Commit**

```bash
git add src/layouts/BaseLayout.astro src/pages/index.astro src/styles/global.css data/tournaments/copa-primavera.yml
git commit -m "feat: add base layout and home page listing tournaments"
```

---

### Task 8: StandingsTable React component

**Files:**
- Create: `src/components/StandingsTable.tsx`
- Test: `src/components/StandingsTable.test.tsx`

**Interfaces:**
- Consumes: `PlayerWithTeam` from `src/lib/tournamentViewModel.ts` (Task 5); `getSpriteUrl` from `src/lib/sprites.ts` (Task 6).
- Produces: `StandingsTable(props: { players: PlayerWithTeam[]; onSelectPlayer: (player: PlayerWithTeam) => void }): JSX.Element`

- [ ] **Step 1: Write the failing tests**

```tsx
// src/components/StandingsTable.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { StandingsTable } from './StandingsTable';
import type { PlayerWithTeam } from '../lib/tournamentViewModel';

const players: PlayerWithTeam[] = [
  { rank: 2, nick: 'Ana Souza', wins: 5, losses: 2, ties: 0, points: 15, team: '', parsedTeam: [{ species: 'Gholdengo', moves: [] }] },
  { rank: 1, nick: 'Joseph Ugarte', wins: 6, losses: 1, ties: 0, points: 18, team: '', parsedTeam: [{ species: 'Incineroar', moves: [] }] },
];

describe('StandingsTable', () => {
  it('renders one row per player, sorted by rank ascending by default', () => {
    render(<StandingsTable players={players} onSelectPlayer={() => {}} />);
    const rows = screen.getAllByRole('row').slice(1); // skip header row
    expect(rows[0]).toHaveTextContent('Joseph Ugarte');
    expect(rows[1]).toHaveTextContent('Ana Souza');
  });

  it('filters players by nickname as the user types', () => {
    render(<StandingsTable players={players} onSelectPlayer={() => {}} />);
    fireEvent.change(screen.getByLabelText(/buscar/i), { target: { value: 'ana' } });
    expect(screen.getByText('Ana Souza')).toBeInTheDocument();
    expect(screen.queryByText('Joseph Ugarte')).not.toBeInTheDocument();
  });

  it('calls onSelectPlayer with the clicked player when the team thumbnail is clicked', () => {
    const onSelectPlayer = vi.fn();
    render(<StandingsTable players={players} onSelectPlayer={onSelectPlayer} />);
    fireEvent.click(screen.getByRole('button', { name: /ver time de joseph ugarte/i }));
    expect(onSelectPlayer).toHaveBeenCalledWith(players[1]);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- StandingsTable`
Expected: FAIL — `StandingsTable.tsx` does not exist yet.

- [ ] **Step 3: Implement the component**

```tsx
// src/components/StandingsTable.tsx
import { useMemo, useState } from 'react';
import type { PlayerWithTeam } from '../lib/tournamentViewModel';
import { getSpriteUrl } from '../lib/sprites';

interface Props {
  players: PlayerWithTeam[];
  onSelectPlayer: (player: PlayerWithTeam) => void;
}

export function StandingsTable({ players, onSelectPlayer }: Props) {
  const [filter, setFilter] = useState('');

  const visiblePlayers = useMemo(() => {
    const filtered = players.filter((p) => p.nick.toLowerCase().includes(filter.toLowerCase()));
    return [...filtered].sort((a, b) => a.rank - b.rank);
  }, [players, filter]);

  return (
    <div>
      <label>
        Buscar jogador
        <input type="text" value={filter} onChange={(e) => setFilter(e.target.value)} />
      </label>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Jogador</th>
            <th>V-D-E</th>
            <th>Pontos</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {visiblePlayers.map((player) => (
            <tr key={player.nick}>
              <td>{player.rank}</td>
              <td>{player.nick}</td>
              <td>{player.wins}-{player.losses}-{player.ties}</td>
              <td>{player.points}</td>
              <td>
                <button
                  type="button"
                  aria-label={`Ver time de ${player.nick}`}
                  onClick={() => onSelectPlayer(player)}
                >
                  {player.parsedTeam.map((mon) => (
                    <img key={mon.species} src={getSpriteUrl(mon.species)} alt={mon.species} width={32} height={32} />
                  ))}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- StandingsTable`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/StandingsTable.tsx src/components/StandingsTable.test.tsx
git commit -m "feat: add sortable/filterable StandingsTable component"
```

---

### Task 9: TeamModal React component

**Files:**
- Create: `src/components/TeamModal.tsx`
- Test: `src/components/TeamModal.test.tsx`

**Interfaces:**
- Consumes: `PlayerWithTeam` from `src/lib/tournamentViewModel.ts` (Task 5); `getSpriteUrl` from `src/lib/sprites.ts` (Task 6).
- Produces: `TeamModal(props: { player: PlayerWithTeam | null; onClose: () => void }): JSX.Element | null`

- [ ] **Step 1: Write the failing tests**

```tsx
// src/components/TeamModal.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TeamModal } from './TeamModal';
import type { PlayerWithTeam } from '../lib/tournamentViewModel';

const player: PlayerWithTeam = {
  rank: 1,
  nick: 'Joseph Ugarte',
  wins: 6,
  losses: 1,
  ties: 0,
  points: 18,
  team: '',
  parsedTeam: [
    { species: 'Incineroar', item: 'Sitrus Berry', ability: 'Intimidate', nature: 'Careful', teraType: 'Grass', moves: ['Flare Blitz', 'Fake Out'] },
  ],
};

describe('TeamModal', () => {
  it('renders nothing when player is null', () => {
    const { container } = render(<TeamModal player={null} onClose={() => {}} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the players nick and each Pokemon details when a player is given', () => {
    render(<TeamModal player={player} onClose={() => {}} />);
    expect(screen.getByText('Joseph Ugarte')).toBeInTheDocument();
    expect(screen.getByText('Incineroar')).toBeInTheDocument();
    expect(screen.getByText('Sitrus Berry')).toBeInTheDocument();
    expect(screen.getByText('Intimidate')).toBeInTheDocument();
    expect(screen.getByText('Careful')).toBeInTheDocument();
    expect(screen.getByText(/Tera: Grass/)).toBeInTheDocument();
    expect(screen.getByText('Flare Blitz')).toBeInTheDocument();
  });

  it('calls onClose when the close button is clicked', () => {
    const onClose = vi.fn();
    render(<TeamModal player={player} onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: /fechar/i }));
    expect(onClose).toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- TeamModal`
Expected: FAIL — `TeamModal.tsx` does not exist yet.

- [ ] **Step 3: Implement the component**

```tsx
// src/components/TeamModal.tsx
import type { PlayerWithTeam } from '../lib/tournamentViewModel';
import { getSpriteUrl } from '../lib/sprites';

interface Props {
  player: PlayerWithTeam | null;
  onClose: () => void;
}

export function TeamModal({ player, onClose }: Props) {
  if (!player) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-label={`Time de ${player.nick}`}>
      <div className="modal-content">
        <button type="button" onClick={onClose}>Fechar</button>
        <h2>{player.nick}</h2>
        <div className="team-grid">
          {player.parsedTeam.map((mon, i) => (
            <div className="mon-card" key={`${mon.species}-${i}`}>
              <img src={getSpriteUrl(mon.species)} alt={mon.species} width={64} height={64} />
              <strong>{mon.species}</strong>
              {mon.item && <p>{mon.item}</p>}
              {mon.ability && <p>{mon.ability}</p>}
              {mon.nature && <p>{mon.nature}</p>}
              {mon.teraType && <p>Tera: {mon.teraType}</p>}
              <ul>
                {mon.moves.map((move) => (
                  <li key={move}>{move}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- TeamModal`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/TeamModal.tsx src/components/TeamModal.test.tsx
git commit -m "feat: add TeamModal component"
```

---

### Task 10: UsageStatsChart React component

**Files:**
- Create: `src/components/UsageStatsChart.tsx`
- Test: `src/components/UsageStatsChart.test.tsx`

**Interfaces:**
- Consumes: `UsageStats` from `src/lib/usageStats.ts` (Task 4).
- Produces: `UsageStatsChart(props: { stats: UsageStats }): JSX.Element`

**Note on a real gotcha:** `recharts`' `ResponsiveContainer` reports zero width/height in `jsdom` (used by our tests), so its children never render there. This component intentionally uses `BarChart` with a fixed `width`/`height` instead of wrapping it in `ResponsiveContainer`, trading fluid resizing for reliable rendering in both the browser and tests.

- [ ] **Step 1: Write the failing tests**

```tsx
// src/components/UsageStatsChart.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { UsageStatsChart } from './UsageStatsChart';
import type { UsageStats } from '../lib/usageStats';

const stats: UsageStats = {
  topSpecies: [{ species: 'Incineroar', count: 3 }, { species: 'Gholdengo', count: 2 }],
  topItems: [{ item: 'Sitrus Berry', count: 2 }],
  topPairs: [{ pair: ['Incineroar', 'Salamence'], count: 2 }],
  topTrios: [{ trio: ['Incineroar', 'Salamence', 'Gholdengo'], count: 1 }],
};

describe('UsageStatsChart', () => {
  it('renders the top pairs as a readable list', () => {
    render(<UsageStatsChart stats={stats} />);
    expect(screen.getByText(/Incineroar \+ Salamence/)).toBeInTheDocument();
    expect(screen.getByText(/2x/)).toBeInTheDocument();
  });

  it('renders the top trios as a readable list', () => {
    render(<UsageStatsChart stats={stats} />);
    expect(screen.getByText(/Incineroar \+ Salamence \+ Gholdengo/)).toBeInTheDocument();
  });

  it('renders a message when there are no pairs or trios yet', () => {
    render(<UsageStatsChart stats={{ topSpecies: [], topItems: [], topPairs: [], topTrios: [] }} />);
    expect(screen.getByText(/nenhum dado/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- UsageStatsChart`
Expected: FAIL — `UsageStatsChart.tsx` does not exist yet.

- [ ] **Step 3: Implement the component**

```tsx
// src/components/UsageStatsChart.tsx
import { BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import type { UsageStats } from '../lib/usageStats';

interface Props {
  stats: UsageStats;
}

export function UsageStatsChart({ stats }: Props) {
  const speciesData = stats.topSpecies.slice(0, 10).map((s) => ({ name: s.species, count: s.count }));
  const itemsData = stats.topItems.slice(0, 10).map((i) => ({ name: i.item, count: i.count }));

  return (
    <section>
      <h2>Estatísticas de uso</h2>

      {speciesData.length > 0 && (
        <>
          <h3>Pokémon mais usados</h3>
          <BarChart width={500} height={300} data={speciesData}>
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#4a70b5" />
          </BarChart>
        </>
      )}

      {itemsData.length > 0 && (
        <>
          <h3>Itens mais usados</h3>
          <BarChart width={500} height={300} data={itemsData}>
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#b54a4a" />
          </BarChart>
        </>
      )}

      <h3>Duplas mais comuns</h3>
      {stats.topPairs.length === 0 && stats.topTrios.length === 0 ? (
        <p>Nenhum dado de uso disponível ainda.</p>
      ) : (
        <>
          <ul>
            {stats.topPairs.slice(0, 10).map((p) => (
              <li key={p.pair.join('+')}>{p.pair.join(' + ')} — {p.count}x</li>
            ))}
          </ul>
          <h3>Trios mais comuns</h3>
          <ul>
            {stats.topTrios.slice(0, 10).map((t) => (
              <li key={t.trio.join('+')}>{t.trio.join(' + ')} — {t.count}x</li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- UsageStatsChart`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/UsageStatsChart.tsx src/components/UsageStatsChart.test.tsx
git commit -m "feat: add UsageStatsChart component"
```

---

### Task 11: TournamentInteractive island and tournament detail page

**Files:**
- Create: `src/components/TournamentInteractive.tsx`
- Create: `src/pages/tournaments/[slug].astro`
- Modify: `src/styles/global.css` (add modal/team-grid styles)

**Interfaces:**
- Consumes: `StandingsTable` (Task 8), `TeamModal` (Task 9), `UsageStatsChart` (Task 10), `PlayerWithTeam`/`buildTournamentViewModel` (Task 5), `loadTournaments` (Task 3).
- Produces: `TournamentInteractive(props: { players: PlayerWithTeam[]; usageStats: UsageStats }): JSX.Element` — the single React island for the whole tournament page.

**Why one island, not three:** Astro hydrates each `client:*` component independently; two separate islands cannot share React state (e.g. "which player's modal is open") without extra plumbing like a global store or custom events. Combining `StandingsTable`, `TeamModal`, and `UsageStatsChart` inside one component means plain `useState` is enough.

- [ ] **Step 1: Create `src/components/TournamentInteractive.tsx`**

```tsx
// src/components/TournamentInteractive.tsx
import { useState } from 'react';
import { StandingsTable } from './StandingsTable';
import { TeamModal } from './TeamModal';
import { UsageStatsChart } from './UsageStatsChart';
import type { PlayerWithTeam } from '../lib/tournamentViewModel';
import type { UsageStats } from '../lib/usageStats';

interface Props {
  players: PlayerWithTeam[];
  usageStats: UsageStats;
}

export default function TournamentInteractive({ players, usageStats }: Props) {
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerWithTeam | null>(null);

  return (
    <>
      <StandingsTable players={players} onSelectPlayer={setSelectedPlayer} />
      <UsageStatsChart stats={usageStats} />
      <TeamModal player={selectedPlayer} onClose={() => setSelectedPlayer(null)} />
    </>
  );
}
```

- [ ] **Step 2: Create `src/pages/tournaments/[slug].astro`**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import TournamentInteractive from '../../components/TournamentInteractive';
import { loadTournaments } from '../../lib/tournaments';
import { buildTournamentViewModel } from '../../lib/tournamentViewModel';
import type { Tournament } from '../../lib/tournaments';

export async function getStaticPaths() {
  const tournaments = loadTournaments();
  return tournaments.map((tournament) => ({
    params: { slug: tournament.slug },
    props: { tournament },
  }));
}

interface Props {
  tournament: Tournament;
}

const { tournament } = Astro.props as Props;
const vm = buildTournamentViewModel(tournament);
---
<BaseLayout title={vm.name}>
  <h1>{vm.name}</h1>
  <p>
    {vm.date}
    {vm.format && ` · ${vm.format}`}
  </p>
  {vm.prize && <p>Premiação: {vm.prize}</p>}

  <TournamentInteractive client:load players={vm.players} usageStats={vm.usageStats} />
</BaseLayout>
```

- [ ] **Step 3: Append modal/team-grid styles to `src/styles/global.css`**

```css
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: canvas;
  color: canvastext;
  padding: 1.5rem;
  border-radius: 8px;
  max-width: 90vw;
  max-height: 90vh;
  overflow: auto;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 1rem;
}

.mon-card {
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 0.5rem;
  text-align: center;
}
```

- [ ] **Step 4: Build and manually verify**

Run: `npm run build`
Expected: build succeeds; `dist/tournaments/copa-primavera/index.html` exists and contains "Joseph Ugarte" and "Copa Primavera VGC".

Run: `npm run preview`, open the printed local URL, navigate to the tournament page, click a team thumbnail, and confirm the modal opens showing that player's Pokémon. Close the preview server (Ctrl+C) when done.

- [ ] **Step 5: Commit**

```bash
git add src/components/TournamentInteractive.tsx src/pages/tournaments/[slug].astro src/styles/global.css
git commit -m "feat: wire standings table, usage stats, and team modal into the tournament page"
```

---

### Task 12: Shop-facing template, demo tournament, and build smoke test

**Files:**
- Create: `data/tournaments/_template.yml`
- Modify: `data/tournaments/copa-primavera.yml` → rename to `data/tournaments/example-tournament.yml` (the demo/smoke-test fixture)
- Create: `scripts/smoke-test-build.mjs`
- Modify: `package.json` (add `test:build` script)

**Interfaces:**
- Consumes: the built `dist/` output from `npm run build`.

- [ ] **Step 1: Create the commented shop-facing template**

```yaml
# data/tournaments/_template.yml
#
# Copie este arquivo para um novo arquivo nesta mesma pasta (ex: copa-de-verao.yml)
# e preencha os campos abaixo com os dados do seu torneio. Arquivos que
# começam com "_" (como este) são ignorados pelo site.

name: "Nome do Torneio"
date: 2026-01-01          # formato AAAA-MM-DD
format: "VGC Reg I"        # opcional — pode remover esta linha
prize: "Descrição do prêmio" # opcional — pode remover esta linha

players:
  # Copie o bloco abaixo para cada jogador, na ordem de colocação.
  - rank: 1
    nick: "Nome do Jogador"
    pokepaste: "https://pokepast.es/xxxxxxxxxxxx" # opcional, só para crédito
    wins: 0
    losses: 0
    ties: 0
    points: 0
    # Cole abaixo o texto exportado do Pokepaste/Showdown (formato "Species @ Item").
    # Mantenha a indentação igual à desta linha "team: |".
    team: |
      Species @ Item
      Ability: Nome da Habilidade
      Level: 50
      EVs: 252 HP / 252 Atk / 4 Spe
      Jolly Nature
      - Move 1
      - Move 2
      - Move 3
      - Move 4
```

- [ ] **Step 2: Rename the demo tournament file**

```bash
git mv data/tournaments/copa-primavera.yml data/tournaments/example-tournament.yml
```

- [ ] **Step 3: Create the build smoke-test script**

```js
// scripts/smoke-test-build.mjs
import { readFileSync } from 'node:fs';
import path from 'node:path';

const distIndexPath = path.join(process.cwd(), 'dist', 'index.html');
const distTournamentPath = path.join(process.cwd(), 'dist', 'tournaments', 'example-tournament', 'index.html');

const checks = [
  { file: distIndexPath, mustContain: 'Copa Primavera VGC' },
  { file: distTournamentPath, mustContain: 'Joseph Ugarte' },
  { file: distTournamentPath, mustContain: 'Incineroar' },
];

let failed = false;

for (const check of checks) {
  const content = readFileSync(check.file, 'utf-8');
  if (!content.includes(check.mustContain)) {
    console.error(`Smoke test FAILED: ${check.file} does not contain "${check.mustContain}"`);
    failed = true;
  }
}

if (failed) {
  process.exit(1);
}

console.log('Smoke test passed: build output contains the expected tournament content.');
```

- [ ] **Step 4: Add the `test:build` script to `package.json`**

In the `"scripts"` object, add:

```json
"test:build": "npm run build && node scripts/smoke-test-build.mjs"
```

- [ ] **Step 5: Run the smoke test**

Run: `npm run test:build`
Expected: prints "Smoke test passed: build output contains the expected tournament content." and exits 0.

- [ ] **Step 6: Commit**

```bash
git add data/tournaments/_template.yml data/tournaments/example-tournament.yml scripts/smoke-test-build.mjs package.json
git commit -m "feat: add shop-facing template, demo tournament, and build smoke test"
```

---

### Task 13: GitHub Actions deploy workflow and README update

**Files:**
- Create: `.github/workflows/deploy.yml`
- Modify: `README.md`

**Interfaces:**
- Consumes: `npm test`, `npm run test:build` (Task 12) as CI gates before deploy.

- [ ] **Step 1: Create `.github/workflows/deploy.yml`**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [master]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm test
      - run: npm run test:build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Update `README.md`**

```markdown
# poke-standings-share

Boilerplate para lojas de cartas hospedarem os resultados finais dos seus
torneios de Pokémon VGC como um site estático no GitHub Pages — sem
backend, sem banco de dados.

## Como usar

1. Clique em **"Use this template"** neste repositório para criar o seu
   próprio repositório.
2. No seu novo repositório, vá em **Settings → Pages** e configure a fonte
   como **GitHub Actions**.
3. Para publicar um torneio nome:
   - Copie `data/tournaments/_template.yml` para um novo arquivo na mesma
     pasta (ex: `data/tournaments/copa-de-verao.yml`).
   - Preencha os campos do torneio e de cada jogador, colando o texto do
     time (exportado do Pokepaste ou do Showdown) no campo `team`.
   - Faça commit e push para a branch `master`.
4. O GitHub Actions builda e publica o site automaticamente. O novo
   torneio aparece na home assim que o deploy terminar.

## Desenvolvimento local

```bash
npm install
npm run dev       # site local com hot-reload
npm test          # testes unitários
npm run test:build # build de produção + smoke test
```
```

- [ ] **Step 3: Verify the full CI gate locally**

Run: `npm test && npm run test:build`
Expected: both succeed, matching what the workflow will run in CI.

- [ ] **Step 4: Commit**

```bash
git add .github/workflows/deploy.yml README.md
git commit -m "feat: add GitHub Pages deploy workflow and update README with shop instructions"
```
