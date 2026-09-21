# Poke Standings Share — Design

Date: 2026-09-21
Status: Approved (pending final spec review)

## Overview

`poke-standings-share` is a GitHub-template boilerplate that lets a local
Pokémon card shop publish the final results of their VGC tournaments as a
static site on GitHub Pages, without running a backend or database. A shop
uses this repo as a **GitHub Template** ("Use this template" button), gets
its own repository and Pages site, and from then on adds one YAML file per
tournament to publish it. Editing a file and pushing is the entire workflow.

This is explicitly a **final-results publishing tool**, not a live/real-time
standings tracker (unlike pokedata.ovh, which this project takes visual/UX
inspiration from — specifically the standings table with a click-to-reveal
team modal).

### Goals

- A shop with no dev experience can publish a tournament by copying a
  template YAML file, filling in fields, and pushing to `main`.
- Each tournament page shows: standings table (rank, nick, record, points),
  prize info, and usage statistics (most-used Pokémon, items, and
  duos/trios) computed from the entrants' teams.
- Clicking a player's team thumbnail opens a modal rendering their full team
  (species, item, ability, nature, EVs, moves, Tera type when present).
- Deploy stays fast and simple regardless of how many tournaments accumulate
  over the site's lifetime.
- Team data is self-contained and immutable once committed — it must not
  depend on a third-party link staying alive.

### Non-goals (v1)

- No live/real-time standings during an ongoing event.
- No user accounts, comments, or write access from the public site.
- No per-player extra metadata beyond what's listed in the schema (no
  country flag, no top-cut placement, no per-position prize breakdown) —
  deliberately deferred to keep the schema minimal.
- No multi-shop/multi-tenant single site — one repo/site per shop.
- No caching or fetch pipeline — eliminated entirely by the design below.

## Architecture

- **Astro** as the static site generator. Content lives under
  `data/tournaments/*.yml`; Astro content collections read this data at
  build time.
- **React** for the interactive islands only: the sortable/filterable
  standings table, the usage-stats charts, and the team modal. The rest of
  each page is plain static HTML/CSS from Astro — no framework runtime
  shipped for content that doesn't need it.
- **GitHub Actions** builds the Astro site and deploys it via
  `actions/deploy-pages` on every push to `main`. No cache step, no
  network fetch step — see "Why no fetch pipeline" below.

## Data Schema

Each tournament is one file: `data/tournaments/<slug>.yml`.

```yaml
name: "Copa Primavera VGC"
date: 2026-03-15
format: "VGC Reg I"           # free text, optional
prize: "R$500 em produtos"    # free text, optional
players:
  - rank: 1
    nick: "Joseph Ugarte"
    pokepaste: "https://pokepast.es/34ec1c9714792760"   # optional, credit/reference only
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

      Salamence @ Salamencite
      Ability: Intimidate
      Level: 50
      EVs: 16 HP / 252 Atk / 252 Spe
      Jolly Nature
      - Slash
      - Dragon Claw
      - Tailwind
      - Protect
      # ... remaining 4 Pokémon
```

Field notes:

- `team` is the raw Pokémon Showdown export format (the same text a
  Pokepaste page shows/exports), pasted directly into the YAML as a block
  scalar. This is the **source of truth** used to render the team modal and
  to compute usage statistics — nothing is fetched from `pokepaste` at any
  point.
- `pokepaste` is optional and purely informational: a link back to the
  original paste for attribution. It is never parsed or fetched by the
  build.
- `wins` / `losses` / `ties` and `points` are separate numeric fields
  (not a combined "record" string) so the UI can format/sort them without
  re-parsing a string.
- A commented `data/tournaments/_template.yml` ships in the repo as the
  copy-paste starting point referenced in the original request.

## Why no fetch pipeline

Earlier drafts of this design considered fetching team data from the
`pokepaste` link, either at build time or from the browser. Both were
rejected:

- **Browser-side fetch** is blocked by CORS: `pokepast.es` sends no
  `Access-Control-Allow-Origin` header (verified directly), so a
  cross-origin `fetch()` from a GitHub Pages site fails outright. Working
  around this would require a third-party CORS proxy or dedicated proxy
  infrastructure beyond GitHub Pages.
- **Build-time fetch** would work (no CORS restriction on server-to-server
  requests) but re-fetching every historical tournament's pokepastes on
  every build does not scale, and caching it safely (e.g. via
  `actions/cache`) adds real pipeline complexity.

Embedding the team text directly in the YAML removes the problem at its
root: there is no network I/O in the build at all. Parsing is a pure
function (`string -> ParsedTeam`), the build is deterministic and fast no
matter how many tournaments exist, and the data survives forever even if
the original Pokepaste is deleted — appropriate for a tool whose whole
purpose is to publish *final, archived* results.

## Build Pipeline

1. Push to `main` triggers the GitHub Actions workflow.
2. Astro's content collection loader reads every `data/tournaments/*.yml`.
3. For each player, the Showdown-export parser (see below) turns `team`
   into a structured object: 6 entries of
   `{ species, item, ability, level, evs, nature, moves[4], tera? }`.
4. A usage-stats module aggregates, per tournament, across all parsed
   teams: most-used species, most-used held items, and most common
   species pairs/trios (co-occurrence within the same team).
5. Astro renders the static pages with parsed teams and computed stats
   already embedded as page data (no client-side parsing or fetching).
6. `actions/deploy-pages` publishes the build output.

## Pages

- **Home** (`/`): list of tournaments sorted by date descending — name,
  date, format.
- **Tournament page** (`/tournaments/<slug>/`):
  - Standings table: rank, nick, W-L-T, points, clickable team thumbnail
    (small sprite row). Sortable/filterable (React island).
  - Usage stats section: most-used Pokémon / items / duos, with a simple
    chart (React island).
  - Prize info, format, date.
- **Team modal**: opens on thumbnail click, renders the 6 parsed Pokémon
  (sprite, item, ability, nature, moves, Tera type if present) using data
  already embedded in the page — no runtime fetch or parsing.

## Showdown-Export Parser

A pure, dependency-light parser (own implementation, not fetched from a
library that assumes Pokepaste's HTML) that takes the raw multi-line
`team` string and returns an array of 6 structured Pokémon. Must handle,
at minimum:
- Nickname + species (`Nickname (Species) @ Item`) as well as the plain
  `Species @ Item` form.
- Missing item line.
- `Tera Type:` line (optional, VGC-relevant).
- Standard `Ability:`, `Level:`, `EVs:`, `<Nature> Nature`, and the four
  `- Move` lines.
- Blank-line-separated Pokémon blocks (standard Showdown export
  delimiter).

## Testing

- Unit tests for the Showdown-export parser: standard team, team without
  Tera, team without an item on one slot, nicknamed Pokémon, and
  malformed/partial input (should not crash the build — flag and skip
  with a clear warning instead).
- Unit tests for the usage-stats aggregation (species count, item count,
  pair/trio co-occurrence) against a small fixture set of parsed teams.
- A build smoke test: `astro build` over a fixture tournament YAML,
  asserting the output HTML contains the expected standings rows.

## Future enhancements (explicitly out of scope for v1)

- Per-player extra fields (flag/country, top-cut placement, per-position
  prize breakdown).
- Cross-tournament aggregate meta pages (usage stats across the whole
  site's history, not just per tournament).
- Any live-update/real-time standings capability.
