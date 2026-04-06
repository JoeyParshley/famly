import apiClient from './client';

export type Theme = 'light' | 'dark';

export interface UserPreferences {
  id: string;
  theme: Theme;
  balanceAlertThreshold: number;
  createdAt: string;
  updatedAt: string;
}

export interface UpdatePreferencesRequest {
  theme?: Theme;
  balanceAlertThreshold?: number;
}

export const preferencesApi = {
  get: async (): Promise<UserPreferences> => {
    const response = await apiClient.get('/users/preferences');
    return response.data;
  },

  update: async (data: UpdatePreferencesRequest): Promise<UserPreferences> => {
    const response = await apiClient.patch('/users/preferences', data);
    return response.data;
  },
};
