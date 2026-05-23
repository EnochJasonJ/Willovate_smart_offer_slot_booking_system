import api from './api';
import type { DashboardStats } from '../types';

export const dashboardService = {
  getSummary: async () => {
    const response = await api.get<DashboardStats>('/dashboard/summary');
    return response.data;
  }
};
