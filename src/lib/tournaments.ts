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
