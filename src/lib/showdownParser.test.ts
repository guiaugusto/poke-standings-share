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

  it('parses a nicknamed Pokemon that also has a trailing gender marker (both parens present)', () => {
    const raw = `
Merlin (Delphox) (M) @ Delphoxite
Ability: Blaze
Modest Nature
- Heat Wave
- Protect
- Nasty Plot
- Psychic
`;
    const [mon] = parseShowdownTeam(raw);
    expect(mon.nickname).toBe('Merlin');
    expect(mon.species).toBe('Delphox');
  });

  it('parses a nicknamed alternate-form Pokemon with a gender marker (hyphenated species inside the parens)', () => {
    const raw = `
Ninetails (Ninetales-Alola) (F) @ Focus Sash
Ability: Snow Warning
Modest Nature
- Blizzard
- Moonblast
- Aurora Veil
- Protect
`;
    const [mon] = parseShowdownTeam(raw);
    expect(mon.nickname).toBe('Ninetails');
    expect(mon.species).toBe('Ninetales-Alola');
  });

  it('captures the gender marker instead of discarding it, for species where gender changes the sprite (e.g. Basculegion)', () => {
    const raw = `
Basculegend (Basculegion) (M) @ Life Orb
Ability: Adaptability
Adamant Nature
- Last Respects
- Protect
- Wave Crash
- Aqua Jet
`;
    const [mon] = parseShowdownTeam(raw);
    expect(mon.gender).toBe('M');
  });

  it('captures a female gender marker the same way', () => {
    const raw = `
Ninetails (Ninetales-Alola) (F) @ Focus Sash
Ability: Snow Warning
Modest Nature
- Blizzard
- Moonblast
- Aurora Veil
- Protect
`;
    const [mon] = parseShowdownTeam(raw);
    expect(mon.gender).toBe('F');
  });

  it('leaves gender undefined when no marker is present', () => {
    const raw = `
Raichu @ Raichunite Y
Ability: Lightning Rod
Timid Nature
- Zap Cannon
- Protect
`;
    const [mon] = parseShowdownTeam(raw);
    expect(mon.gender).toBeUndefined();
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
