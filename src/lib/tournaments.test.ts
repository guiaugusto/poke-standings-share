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
