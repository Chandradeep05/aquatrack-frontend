import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import { ProtectedRoute } from '../components/common/ProtectedRoute';
import * as AuthContextModule from '../context/AuthContext';
import { User } from '../types';

describe('ProtectedRoute - Authentication & RBAC Enforcement', () => {
  const renderWithRouter = (initialEntry: string, roleRequired?: 'admin' | 'user') => {
    return render(
      <MemoryRouter initialEntries={[initialEntry]}>
        <Routes>
          <Route path="/login" element={<div data-testid="login-page">Login Page</div>} />
          <Route path="/" element={<div data-testid="user-home">User Home</div>} />
          <Route path="/admin" element={<div data-testid="admin-home">Admin Home</div>} />
          <Route
            path="/protected-target"
            element={
              <ProtectedRoute role={roleRequired}>
                <div data-testid="protected-content">Secret Content</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );
  };

  it('1. should redirect unauthenticated visitor to /login', () => {
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: null,
      token: null,
      isLoading: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn()
    });

    renderWithRouter('/protected-target');

    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    expect(screen.getByTestId('login-page')).toBeInTheDocument();
  });

  it('2. should allow authenticated user into general protected route', () => {
    const regularUser: User = {
      id: 'u1',
      name: 'Regular Joe',
      email: 'joe@example.com',
      role: 'user',
      createdAt: '2026-09-04T00:00:00.000Z'
    };

    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: regularUser,
      token: 'jwt',
      isLoading: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn()
    });

    renderWithRouter('/protected-target');

    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    expect(screen.getByText('Secret Content')).toBeInTheDocument();
  });

  it('3. should block regular user from admin-only route and redirect to /', () => {
    const regularUser: User = {
      id: 'u1',
      name: 'Regular Joe',
      email: 'joe@example.com',
      role: 'user',
      createdAt: '2026-09-04T00:00:00.000Z'
    };

    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: regularUser,
      token: 'jwt',
      isLoading: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn()
    });

    renderWithRouter('/protected-target', 'admin');

    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    expect(screen.getByTestId('user-home')).toBeInTheDocument();
  });

  it('4. should allow admin user to access admin-restricted route', () => {
    const adminUser: User = {
      id: 'a1',
      name: 'Admin Boss',
      email: 'boss@aquatrack.com',
      role: 'admin',
      createdAt: '2026-09-04T00:00:00.000Z'
    };

    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: adminUser,
      token: 'jwt-admin',
      isLoading: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn()
    });

    renderWithRouter('/protected-target', 'admin');

    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
  });
});
