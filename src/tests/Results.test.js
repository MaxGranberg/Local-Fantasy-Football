import React from 'react';
import { render} from '@testing-library/react';
import '@testing-library/jest-dom';
import Results from '../components/Results';

describe('Results Component', () => {
  it('renders without crashing', () => {
    render(<Results />);
  });
});
