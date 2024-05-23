import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import '@testing-library/jest-dom';
import Navigation from '../components/Navigation';
import AuthContext from '../components/AuthContext';

describe('Navigation Component', () => {
  it('renders Admin Dashboard link for admin role', () => {
    render(
      <Router>
        <AuthContext.Provider value={{ isAuthenticated: true, userId: '123', role: 'admin' }}>
          <Navigation />
        </AuthContext.Provider>
      </Router>
    );
    expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
  });

  it('does not render Admin Dashboard link for non-admin role', () => {
    render(
      <Router>
        <AuthContext.Provider value={{ isAuthenticated: true, userId: '123', role: 'user' }}>
          <Navigation />
        </AuthContext.Provider>
      </Router>
    );
    expect(screen.queryByText("Admin Dashboard")).toBeNull();
  });
});
