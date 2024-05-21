import React from 'react';
import { render, screen} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Fixtures from '../components/Fixtures';

describe('Fixtures', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([
          { id: 1, name: 'Team A' },
          { id: 2, name: 'Team B' },
        ]),
      })
    );
  });

  test('renders the Fixtures component', async () => {
    render(<Fixtures />);
    expect(screen.getByText('Sök alla matcher för ett lag')).toBeInTheDocument();
    expect(screen.getByText('Kommande matcher')).toBeInTheDocument();
    expect(screen.getByText('Tabell')).toBeInTheDocument();

    await screen.findByText('Team A');
    expect(screen.getByText('Team B')).toBeInTheDocument();
  });
});
