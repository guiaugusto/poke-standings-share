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

  it('defaults to the Moves tab, showing item/ability/nature/moves for each Pokemon', () => {
    render(<TeamModal player={player} onClose={() => {}} />);
    expect(screen.getByText('Joseph Ugarte')).toBeInTheDocument();
    expect(screen.getByText('Incineroar')).toBeInTheDocument();
    expect(screen.getByText('Sitrus Berry')).toBeInTheDocument();
    expect(screen.getByText('Intimidate')).toBeInTheDocument();
    expect(screen.getByText('Careful')).toBeInTheDocument();
    expect(screen.getByText('Flare Blitz')).toBeInTheDocument();
  });

  it('switches to the Stats tab on click, showing EV bars instead of moves', () => {
    render(<TeamModal player={player} onClose={() => {}} />);
    fireEvent.click(screen.getByRole('tab', { name: 'Stats' }));

    expect(screen.getByText('Incineroar')).toBeInTheDocument();
    expect(screen.getByText('240')).toBeInTheDocument(); // HP EV value
    expect(screen.queryByText('Flare Blitz')).not.toBeInTheDocument();
  });

  it('switches back to the Moves tab on click', () => {
    render(<TeamModal player={player} onClose={() => {}} />);
    fireEvent.click(screen.getByRole('tab', { name: 'Stats' }));
    fireEvent.click(screen.getByRole('tab', { name: 'Moves' }));

    expect(screen.getByText('Flare Blitz')).toBeInTheDocument();
  });

  it('calls onClose when the close button is clicked', () => {
    const onClose = vi.fn();
    render(<TeamModal player={player} onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: /fechar/i }));
    expect(onClose).toHaveBeenCalled();
  });

  it('hides the Stats tab entirely when no Pokemon in the team has any EV data (e.g. an OTS-only paste)', () => {
    const otsPlayer: PlayerWithTeam = {
      ...player,
      parsedTeam: [
        { species: 'Salamence', item: 'Salamencite', ability: 'Intimidate', moves: ['Draco Meteor'] },
        { species: 'Tyranitar', item: 'Tyranitarite', ability: 'Sand Stream', moves: ['Rock Slide'] },
      ],
    };
    render(<TeamModal player={otsPlayer} onClose={() => {}} />);

    expect(screen.queryByRole('tab', { name: 'Stats' })).not.toBeInTheDocument();
    expect(screen.queryByRole('tab', { name: 'Moves' })).not.toBeInTheDocument();
    expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
    expect(screen.getByText('Draco Meteor')).toBeInTheDocument();
  });

  it('still shows the Stats tab if at least one Pokemon (not necessarily all) has EV data', () => {
    const mixedPlayer: PlayerWithTeam = {
      ...player,
      parsedTeam: [
        { species: 'Salamence', item: 'Salamencite', ability: 'Intimidate', moves: ['Draco Meteor'] },
        { species: 'Incineroar', item: 'Sitrus Berry', ability: 'Intimidate', evs: { hp: 244 }, moves: ['Fake Out'] },
      ],
    };
    render(<TeamModal player={mixedPlayer} onClose={() => {}} />);
    expect(screen.getByRole('tab', { name: 'Stats' })).toBeInTheDocument();
  });
});
