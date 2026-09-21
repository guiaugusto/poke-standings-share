// This script is run both with and without GITHUB_REPOSITORY set (see
// package.json's test:build / test:build:pages scripts). Running it with
// GITHUB_REPOSITORY set matters: that's the only configuration that
// exercises the real GitHub Pages `base` path, and a past bug (a missing
// trailing slash in astro.config.mjs's `base`) produced broken,
// run-together tournament links that only showed up in that configuration.
//
// It's data-driven rather than hardcoded to a specific demo tournament:
// shops are expected to eventually delete the demo data once they have
// real tournaments, so this discovers whatever tournament actually exists
// under data/tournaments/ (excluding the _template.yml) and checks the
// build output against that.
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

function readOrExit(filePath) {
  try {
    return readFileSync(filePath, 'utf-8');
  } catch (error) {
    console.error(
      `Smoke test FAILED: could not read ${filePath} — did you run npm run build first? ${error.message}`,
    );
    process.exit(1);
  }
}

const tournamentsDir = path.join(process.cwd(), 'data', 'tournaments');
const tournamentFiles = readdirSync(tournamentsDir).filter(
  (file) => (file.endsWith('.yml') || file.endsWith('.yaml')) && !file.startsWith('_'),
);

if (tournamentFiles.length === 0) {
  console.error(
    `Smoke test FAILED: no tournament files found in ${tournamentsDir} (only _template.yml, or the ` +
      'directory is empty) — add at least one real tournament to smoke-test against.',
  );
  process.exit(1);
}

const firstFile = tournamentFiles[0];
const slug = path.basename(firstFile, path.extname(firstFile));
const data = yaml.load(readFileSync(path.join(tournamentsDir, firstFile), 'utf-8'));
const firstPlayerNick = data.players?.[0]?.nick;

if (!data.name || !firstPlayerNick) {
  console.error(
    `Smoke test FAILED: ${firstFile} is missing a "name" or a first player "nick" — can't build checks from it.`,
  );
  process.exit(1);
}

const distIndexPath = path.join(process.cwd(), 'dist', 'index.html');
const distTournamentPath = path.join(process.cwd(), 'dist', 'tournaments', slug, 'index.html');

const indexHtml = readOrExit(distIndexPath);
const tournamentHtml = readOrExit(distTournamentPath);

const checks = [
  { content: indexHtml, file: distIndexPath, mustContain: data.name },
  { content: tournamentHtml, file: distTournamentPath, mustContain: firstPlayerNick },
];

let failed = false;

for (const check of checks) {
  if (!check.content.includes(check.mustContain)) {
    console.error(`Smoke test FAILED: ${check.file} does not contain "${check.mustContain}"`);
    failed = true;
  }
}

// Regression check for a broken-base-path bug: astro.config.mjs's `base`
// must have a trailing slash, otherwise links built via string
// concatenation (e.g. `${BASE_URL}tournaments/${slug}/`) collapse into a
// single run-together path segment such as
// "/my-repotournaments/<slug>/" instead of "/my-repo/tournaments/<slug>/".
// This regex requires a "/" immediately before "tournaments/<slug>/" to
// catch that.
const wellFormedLinkPattern = new RegExp(`href="[^"]*/tournaments/${slug}/"`);
if (!wellFormedLinkPattern.test(indexHtml)) {
  console.error(
    `Smoke test FAILED: ${distIndexPath} does not contain a correctly-formed link to the tournament page ` +
      `(expected a href ending in "/tournaments/${slug}/" with a "/" separating it from the base path).`,
  );
  failed = true;
}

if (failed) {
  process.exit(1);
}

console.log('Smoke test passed: build output contains the expected tournament content.');
