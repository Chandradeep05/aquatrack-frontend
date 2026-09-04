import apiClient from './client';

export const getDailyGoalApi = async (): Promise<{ success: boolean; data: { dailyGoalMl: number } }> => {
  const res = await apiClient.get('/settings/daily-goal');
  return res.data;
};

export const updateDailyGoalApi = async (dailyGoalMl: number) => {
  const res = await apiClient.put('/settings/daily-goal', { dailyGoalMl });
  return res.data;
};
