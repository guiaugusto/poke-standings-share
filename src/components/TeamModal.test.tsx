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
  parsedTeam: [
    {
      species: 'Incineroar',
      item: 'Sitrus Berry',
      ability: 'Intimidate',
      nature: 'Careful',
      teraType: 'Grass',
      evs: { hp: 240, def: 88, spa: 16, spe: 184 },
      moves: ['Flare Blitz', 'Fake Out'],
    },
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

  it('renders the EV spread in conventional VGC format when evs are present', () => {
    render(<TeamModal player={player} onClose={() => {}} />);
    expect(screen.getByText('EVs: 240 HP / 88 Def / 16 SpA / 184 Spe')).toBeInTheDocument();
  });

  it('calls onClose when the close button is clicked', () => {
    const onClose = vi.fn();
    render(<TeamModal player={player} onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: /fechar/i }));
    expect(onClose).toHaveBeenCalled();
  });
});
