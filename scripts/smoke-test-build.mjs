// This script is run both with and without GITHUB_REPOSITORY set (see
// package.json's test:build / test:build:pages scripts). Running it with
// GITHUB_REPOSITORY set matters: that's the only configuration that
// exercises the real GitHub Pages `base` path, and a past bug (a missing
// trailing slash in astro.config.mjs's `base`) produced broken,
// run-together tournament links that only showed up in that configuration.
import { readFileSync } from 'node:fs';
import path from 'node:path';

const distIndexPath = path.join(process.cwd(), 'dist', 'index.html');
const distTournamentPath = path.join(process.cwd(), 'dist', 'tournaments', 'example-tournament', 'index.html');

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

const indexHtml = readOrExit(distIndexPath);
const tournamentHtml = readOrExit(distTournamentPath);

const checks = [
  { content: indexHtml, file: distIndexPath, mustContain: 'Copa Primavera VGC' },
  { content: tournamentHtml, file: distTournamentPath, mustContain: 'Joseph Ugarte' },
  { content: tournamentHtml, file: distTournamentPath, mustContain: 'Incineroar' },
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
// "/my-repotournaments/example-tournament/" instead of
// "/my-repo/tournaments/example-tournament/". This regex requires a "/"
// immediately before "tournaments/example-tournament/" to catch that.
const wellFormedLinkPattern = /href="[^"]*\/tournaments\/example-tournament\/"/;
if (!wellFormedLinkPattern.test(indexHtml)) {
  console.error(
    `Smoke test FAILED: ${distIndexPath} does not contain a correctly-formed link to the tournament page ` +
      '(expected a href ending in "/tournaments/example-tournament/" with a "/" separating it from the base path).',
  );
  failed = true;
}

if (failed) {
  process.exit(1);
}

console.log('Smoke test passed: build output contains the expected tournament content.');
