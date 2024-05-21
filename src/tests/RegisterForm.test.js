import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';
import RegisterForm from '../components/RegisterForm';

describe('RegisterForm', () => {
  const onBackToLoginMock = jest.fn();
  const setGlobalFlashMessageMock = jest.fn();

  beforeEach(() => {
    onBackToLoginMock.mockClear();
    setGlobalFlashMessageMock.mockClear();
  });

  test('renders the RegisterForm component', () => {
    render(<RegisterForm onBackToLogin={onBackToLoginMock} setGlobalFlashMessage={setGlobalFlashMessageMock} />);
    expect(screen.getByPlaceholderText('Användarnamn')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Lösenord')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Bekräfta lösenord')).toBeInTheDocument();
    expect(screen.getByText('Registrera')).toBeInTheDocument();
    expect(screen.getByText('Tillbaka till logga in')).toBeInTheDocument();
  });

  test('shows error message if passwords do not match', () => {
    render(<RegisterForm onBackToLogin={onBackToLoginMock} setGlobalFlashMessage={setGlobalFlashMessageMock} />);

    fireEvent.change(screen.getByPlaceholderText('Användarnamn'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Lösenord'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText('Bekräfta lösenord'), { target: { value: 'password321' } });

    fireEvent.click(screen.getByText('Registrera'));

    expect(screen.getByText('Lösenorden matchar inte.')).toBeInTheDocument();
  });

  test('shows error message if password is too short', () => {
    render(<RegisterForm onBackToLogin={onBackToLoginMock} setGlobalFlashMessage={setGlobalFlashMessageMock} />);

    fireEvent.change(screen.getByPlaceholderText('Användarnamn'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Lösenord'), { target: { value: 'short' } });
    fireEvent.change(screen.getByPlaceholderText('Bekräfta lösenord'), { target: { value: 'short' } });

    fireEvent.click(screen.getByText('Registrera'));

    expect(screen.getByText('Lösenord behöver minst vara 10 tecken långt')).toBeInTheDocument();
  });

  test('shows error message if username is too short', () => {
    render(<RegisterForm onBackToLogin={onBackToLoginMock} setGlobalFlashMessage={setGlobalFlashMessageMock} />);

    fireEvent.change(screen.getByPlaceholderText('Användarnamn'), { target: { value: 'us' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Lösenord'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText('Bekräfta lösenord'), { target: { value: 'password123' } });

    fireEvent.click(screen.getByText('Registrera'));

    expect(screen.getByText('Användarnamn behöver minst vara 3 tecken långt')).toBeInTheDocument();
  });
});
