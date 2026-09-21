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
