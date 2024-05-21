import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import LeagueStandings from '../components/League';

describe('LeagueStandings', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([
          { teamName: 'Team A', ownerUsername: 'userA', totalScore: 100 },
          { teamName: 'Team B', ownerUsername: 'userB', totalScore: 90 },
        ]),
      })
    );
  });

  test('renders the LeagueStandings component and shows teams and their score', async () => {
    render(<LeagueStandings />);

    expect(screen.getByText('League Standings')).toBeInTheDocument();

    await screen.findByText('Team A');
    expect(screen.getByText('userA')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();

    expect(screen.getByText('Team B')).toBeInTheDocument();
    expect(screen.getByText('userB')).toBeInTheDocument();
    expect(screen.getByText('90')).toBeInTheDocument();
  });
});
