import apiClient from './client';

export interface HouseholdMember {
  id: string;
  role: 'view' | 'edit' | 'admin';
  user: {
    id: string;
    email: string;
    name: string;
  };
  createdAt: string;
}

export interface Household {
  id: string;
  name: string;
  createdAt: string;
  members: HouseholdMember[];
}

export interface CreateHouseholdRequest {
  name: string;
}

export interface AddMemberRequest {
  email: string;
  role: 'view' | 'edit' | 'admin';
}

export interface UpdateMemberRoleRequest {
  role: 'view' | 'edit' | 'admin';
}

export const householdsApi = {
  list: async (): Promise<Household[]> => {
    const response = await apiClient.get('/households');
    return response.data;
  },

  get: async (id: string): Promise<Household> => {
    const response = await apiClient.get(`/households/${id}`);
    return response.data;
  },

  create: async (data: CreateHouseholdRequest): Promise<Household> => {
    const response = await apiClient.post('/households', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateHouseholdRequest>): Promise<Household> => {
    const response = await apiClient.patch(`/households/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/households/${id}`);
  },

  getMembers: async (householdId: string): Promise<HouseholdMember[]> => {
    const response = await apiClient.get(`/households/${householdId}/members`);
    return response.data;
  },

  addMember: async (
    householdId: string,
    data: AddMemberRequest
  ): Promise<HouseholdMember> => {
    const response = await apiClient.post(
      `/households/${householdId}/members`,
      data
    );
    return response.data;
  },

  updateMemberRole: async (
    householdId: string,
    memberId: string,
    data: UpdateMemberRoleRequest
  ): Promise<HouseholdMember> => {
    const response = await apiClient.patch(
      `/households/${householdId}/members/${memberId}`,
      data
    );
    return response.data;
  },

  removeMember: async (householdId: string, memberId: string): Promise<void> => {
    await apiClient.delete(`/households/${householdId}/members/${memberId}`);
  },
};
