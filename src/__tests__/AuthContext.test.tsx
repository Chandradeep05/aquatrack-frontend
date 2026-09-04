import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuthProvider, useAuth } from '../context/AuthContext';
import * as AuthApi from '../api/authApi';
import { User } from '../types';

// Test consumer component to expose context values
const TestConsumer: React.FC = () => {
  const { user, token, isLoading, login, logout } = useAuth();

  if (isLoading) return <div>Loading Auth...</div>;

  return (
    <div>
      <div data-testid="auth-status">{user ? 'Authenticated' : 'Guest'}</div>
      <div data-testid="user-email">{user?.email || 'None'}</div>
      <div data-testid="user-role">{user?.role || 'None'}</div>
      <div data-testid="token-val">{token || 'No Token'}</div>
      <button onClick={() => login('test@example.com', 'Password123!')}>
        Trigger Login
      </button>
      <button onClick={logout}>Trigger Logout</button>
    </div>
  );
};

describe('AuthContext - State Management & Resilience', () => {
  const mockUser: User = {
    id: 'u123',
    name: 'Test User',
    email: 'test@example.com',
    role: 'user',
    createdAt: '2026-09-04T00:00:00.000Z'
  };

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('1. should initialize as unauthenticated when localStorage is empty', async () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    expect(await screen.findByTestId('auth-status')).toBeInTheDocument();
    expect(screen.getByTestId('auth-status').textContent).toBe('Guest');
    expect(screen.getByTestId('user-email').textContent).toBe('None');
    expect(screen.getByTestId('token-val').textContent).toBe('No Token');
  });

  it('2. should restore user profile and token from valid localStorage state via getMeApi', async () => {
    localStorage.setItem('aquatrack_token', 'valid-persisted-token');
    localStorage.setItem('aquatrack_user', JSON.stringify(mockUser));

    vi.spyOn(AuthApi, 'getMeApi').mockResolvedValue({
      success: true,
      data: { user: mockUser }
    });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    expect(await screen.findByTestId('auth-status')).toBeInTheDocument();
    expect(screen.getByTestId('auth-status').textContent).toBe('Authenticated');
    expect(screen.getByTestId('user-email').textContent).toBe('test@example.com');
    expect(screen.getByTestId('token-val').textContent).toBe('valid-persisted-token');
  });

  it('3. should safely handle corrupted localStorage JSON without crashing', async () => {
    localStorage.setItem('aquatrack_token', 'orphan-token');
    localStorage.setItem('aquatrack_user', 'CORRUPTED_JSON_NOT_VALID{]');

    vi.spyOn(AuthApi, 'getMeApi').mockRejectedValue(new Error('Invalid token'));

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    expect(await screen.findByTestId('auth-status')).toBeInTheDocument();
    expect(screen.getByTestId('auth-status').textContent).toBe('Guest');
    expect(screen.getByTestId('user-email').textContent).toBe('None');
    expect(localStorage.getItem('aquatrack_user')).toBeNull();
  });

  it('4. should update state and localStorage on login and clear on logout', async () => {
    vi.spyOn(AuthApi, 'loginApi').mockResolvedValue({
      success: true,
      message: 'Login successful',
      data: {
        token: 'sample-jwt-token',
        user: mockUser
      }
    });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    expect(await screen.findByTestId('auth-status')).toBeInTheDocument();
    expect(screen.getByTestId('auth-status').textContent).toBe('Guest');

    // Trigger Login
    await act(async () => {
      screen.getByText('Trigger Login').click();
    });

    expect(screen.getByTestId('auth-status').textContent).toBe('Authenticated');
    expect(screen.getByTestId('user-email').textContent).toBe('test@example.com');
    expect(localStorage.getItem('aquatrack_token')).toBe('sample-jwt-token');

    // Trigger Logout
    await act(async () => {
      screen.getByText('Trigger Logout').click();
    });

    expect(screen.getByTestId('auth-status').textContent).toBe('Guest');
    expect(localStorage.getItem('aquatrack_token')).toBeNull();
    expect(localStorage.getItem('aquatrack_user')).toBeNull();
  });
});
