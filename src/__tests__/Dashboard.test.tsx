import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Dashboard } from '../pages/user/Dashboard';
import * as IntakeApi from '../api/intakeApi';
import * as AuthContextModule from '../context/AuthContext';
import { ToastProvider } from '../context/ToastContext';
import { TodaySummary, User } from '../types';

describe('User Dashboard - Hydration Metrics & Logging', () => {
  const mockUser: User = {
    id: 'u1',
    name: 'Alex Smith',
    email: 'alex@example.com',
    role: 'user',
    createdAt: '2026-09-04T00:00:00.000Z'
  };

  const mockInitialSummary: TodaySummary = {
    date: '2026-09-04',
    totalIntakeMl: 500,
    dailyGoalMl: 2000,
    progressPercentage: 25,
    remainingMl: 1500,
    entries: [
      {
        id: 'entry-1',
        amount: 500,
        consumedAt: '2026-09-04T08:30:00.000Z'
      }
    ]
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: mockUser,
      token: 'valid-token',
      isLoading: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn()
    });
  });

  const renderDashboard = () => {
    return render(
      <ToastProvider>
        <Dashboard />
      </ToastProvider>
    );
  };

  it('1. should render summary metrics, goal percentage, and realistic preset options', async () => {
    vi.spyOn(IntakeApi, 'getTodayIntakeApi').mockResolvedValue({
      success: true,
      data: mockInitialSummary
    });

    renderDashboard();

    // Verify greeting
    expect(await screen.findByText(/Alex Smith/i)).toBeInTheDocument();

    // Verify percentages & metrics
    expect(screen.getAllByText('25%').length).toBeGreaterThan(0);
    expect(screen.getByText('+500 ml')).toBeInTheDocument();

    // Verify container presets
    expect(screen.getByText('Cup')).toBeInTheDocument();
    expect(screen.getByText('Glass')).toBeInTheDocument();
    expect(screen.getByText('Bottle')).toBeInTheDocument();
    expect(screen.getByText('Flask')).toBeInTheDocument();
  });

  it('2. should update selected amount when clicking a preset container', async () => {
    vi.spyOn(IntakeApi, 'getTodayIntakeApi').mockResolvedValue({
      success: true,
      data: mockInitialSummary
    });

    renderDashboard();

    await screen.findByText(/Alex Smith/i);

    // Click "Flask" preset (750ml)
    const flaskBtn = screen.getByText('Flask').closest('button');
    expect(flaskBtn).toBeTruthy();
    fireEvent.click(flaskBtn!);

    // Action button should update to + Add 750 ml
    expect(screen.getByText('+ Add 750 ml')).toBeInTheDocument();
  });

  it('3. should successfully log water intake and refresh summary', async () => {
    const updatedSummary: TodaySummary = {
      ...mockInitialSummary,
      totalIntakeMl: 750,
      progressPercentage: 38,
      remainingMl: 1250,
      entries: [
        ...mockInitialSummary.entries,
        {
          id: 'entry-2',
          amount: 250,
          consumedAt: '2026-09-04T09:00:00.000Z'
        }
      ]
    };

    vi.spyOn(IntakeApi, 'getTodayIntakeApi')
      .mockResolvedValueOnce({ success: true, data: mockInitialSummary })
      .mockResolvedValueOnce({ success: true, data: updatedSummary });

    const logSpy = vi.spyOn(IntakeApi, 'logIntakeApi').mockResolvedValue({
      success: true,
      message: 'Intake logged',
      data: updatedSummary.entries[1]
    });

    renderDashboard();

    await screen.findByText(/Alex Smith/i);

    // Click "+ Add 250 ml"
    const addBtn = screen.getByText(/\+ Add 250 ml/i);
    fireEvent.click(addBtn);

    await waitFor(() => {
      expect(logSpy).toHaveBeenCalledWith(250);
    });

    // Wait for the new log entry to appear in the drink log
    await waitFor(() => {
      expect(screen.getByText('+250 ml')).toBeInTheDocument();
    });

    // Verify updated percentage
    expect(screen.getAllByText('38%').length).toBeGreaterThan(0);
  });

  it('4. should handle API errors gracefully when logging intake fails', async () => {
    vi.spyOn(IntakeApi, 'getTodayIntakeApi').mockResolvedValue({
      success: true,
      data: mockInitialSummary
    });

    vi.spyOn(IntakeApi, 'logIntakeApi').mockRejectedValue({
      response: {
        data: {
          success: false,
          message: 'Water intake cannot exceed 10,000 ml per entry.'
        }
      }
    });

    renderDashboard();

    await screen.findByText(/Alex Smith/i);

    const addBtn = screen.getByText(/\+ Add 250 ml/i);
    fireEvent.click(addBtn);

    // Should display toast error without crashing
    expect(await screen.findByText('Water intake cannot exceed 10,000 ml per entry.')).toBeInTheDocument();
  });
});
