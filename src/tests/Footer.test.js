import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import Footer from '../components/Footer';

describe('Footer Component', () => {
  it('renders without crashing', () => {
    render(<Footer />);
  });
});
