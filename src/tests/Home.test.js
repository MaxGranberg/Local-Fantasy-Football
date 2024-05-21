import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '../components/Home';

describe('Home Component', () => {
  it('renders without crashing', () => {
    render(<Home />);
  });
});
