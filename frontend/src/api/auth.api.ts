import apiClient from './client';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  access_token: string;
}

export interface DemoUser {
  id: string;
  email: string;
  name: string;
  role: string;
  description: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  isDemo: boolean;
  createdAt: string;
}

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  getProfile: async (): Promise<UserProfile> => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  getDemoUsers: async (): Promise<DemoUser[]> => {
    const response = await apiClient.get('/auth/demo-users');
    return response.data;
  },

  demoLogin: async (email: string): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/demo-login', { email });
    return response.data;
  },
};
