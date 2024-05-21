import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from '../components/Header';

describe('Header Component', () => {
  it('renders without crashing', () => {
    render(<Header />);
  });

  it('displays the correct title', () => {
    render(<Header />);
    expect(screen.getByText("GräsrotsFantasy - Din lokala fantasyliga")).toBeInTheDocument();
  });
});
