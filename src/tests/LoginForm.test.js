import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginForm from '../components/LoginForm';
import AuthContext from '../components/AuthContext';

const mockLogin = jest.fn();

const customRender = (ui, { providerProps, ...renderOptions }) => {
  return render(
    <AuthContext.Provider value={providerProps}>{ui}</AuthContext.Provider>,
    renderOptions
  );
};

describe('LoginForm Component', () => {
  const mockOnRegister = jest.fn();
  const mockSetGlobalFlashMessage = jest.fn();
  const providerProps = {
    login: mockLogin,
    isAuthenticated: false,
    userId: null,
    role: ''
  };

  it('renders the form correctly', () => {
    customRender(<LoginForm onRegister={mockOnRegister} setGlobalFlashMessage={mockSetGlobalFlashMessage} />, { providerProps });
    expect(screen.getByPlaceholderText('Användarnamn')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Lösenord')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Logga in' })).toBeInTheDocument();
  });

  it('allows input for username and password', () => {
    customRender(<LoginForm onRegister={mockOnRegister} setGlobalFlashMessage={mockSetGlobalFlashMessage} />, { providerProps });
    screen.getByPlaceholderText('Användarnamn').value = 'testuser';
    screen.getByPlaceholderText('Lösenord').value = 'password';
    expect(screen.getByPlaceholderText('Användarnamn').value).toBe('testuser');
    expect(screen.getByPlaceholderText('Lösenord').value).toBe('password');
  });
});
