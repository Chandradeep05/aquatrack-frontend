import apiClient from './client';
import { User } from '../types';

export const registerApi = async (name: string, email: string, password: string) => {
  const res = await apiClient.post('/auth/register', { name, email, password });
  return res.data;
};

export const loginApi = async (email: string, password: string) => {
  const res = await apiClient.post('/auth/login', { email, password });
  return res.data;
};

export const getMeApi = async (): Promise<{ success: boolean; data: { user: User } }> => {
  const res = await apiClient.get('/auth/me');
  return res.data;
};
