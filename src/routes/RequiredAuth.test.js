import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import RequireAuth from './RequiredAuth';

jest.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    isAuthenticated: false,
  }),
}));

describe('RequireAuth', () => {
  test('redirige vers /login si non authentifié', () => {
    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route
            path="/protected"
            element={
              <RequireAuth>
                <div>Donnée protégée</div>
              </RequireAuth>
            }
          />
          <Route path="/login" element={<div>Page de login</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Page de login')).toBeInTheDocument();
  });
  
});
