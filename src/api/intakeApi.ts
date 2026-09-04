import apiClient from './client';
import { TodaySummary, HistoryGroup } from '../types';

export const logIntakeApi = async (amount: number, consumedAt?: string) => {
  const res = await apiClient.post('/intake', { amount, consumedAt });
  return res.data;
};

export const getTodayIntakeApi = async (): Promise<{ success: boolean; data: TodaySummary }> => {
  const res = await apiClient.get('/intake/today');
  return res.data;
};

export const getIntakeHistoryApi = async (): Promise<{ success: boolean; data: { dailyGoalMl: number; history: HistoryGroup[] } }> => {
  const res = await apiClient.get('/intake/history');
  return res.data;
};

export const deleteIntakeApi = async (id: string) => {
  const res = await apiClient.delete(`/intake/${id}`);
  return res.data;
};
