import apiClient from './client';
import { User, AdminMetrics, HistoryGroup } from '../types';

export const getAllUsersApi = async (): Promise<{ success: boolean; data: { metrics: AdminMetrics; users: User[] } }> => {
  const res = await apiClient.get('/users');
  return res.data;
};

export const getUserIntakeHistoryApi = async (userId: string): Promise<{ success: boolean; data: { user: User; dailyGoalMl: number; history: HistoryGroup[] } }> => {
  const res = await apiClient.get(`/users/${userId}/intake`);
  return res.data;
};

export const deleteUserApi = async (userId: string) => {
  const res = await apiClient.delete(`/users/${userId}`);
  return res.data;
};
