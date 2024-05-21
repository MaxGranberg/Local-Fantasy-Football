import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FlashMessage from '../components/FlashMessage';

describe('FlashMessage Component', () => {
  it('renders without crashing', () => {
    render(<FlashMessage message="Test message" type="success" onClose={() => {}} />);
  });

  it('displays success message correctly', () => {
    render(<FlashMessage message="Test message" type="success" onClose={() => {}} />);
    expect(screen.getByText("Test message")).toBeInTheDocument();
  });

  it('displays error message correctly', () => {
    render(<FlashMessage message="Test message" type="error" onClose={() => {}} />);
    expect(screen.getByText("Test message")).toBeInTheDocument();
  });

  it('closes when the close button is clicked', () => {
    const handleClose = jest.fn();
    render(<FlashMessage message="Close me" type="success" onClose={handleClose} />);
    const closeButton = screen.getByText('×');
    fireEvent.click(closeButton);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
