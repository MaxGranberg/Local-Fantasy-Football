import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AuthProvider } from '../components/AuthContext';
import AdminDashboard from '../components/AdminDashboard';

describe('AdminDashboard Component', () => {
  it('renders without crashing', () => {
    render(
      <AuthProvider value={{ isAuthenticated: true, userId: '123', role: 'admin' }}>
        <AdminDashboard />
      </AuthProvider>
    );
  });
});
