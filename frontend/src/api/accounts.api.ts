import apiClient from './client';

export type AccountType = 'checking' | 'savings' | 'credit' | 'investment' | 'cash';

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  interestRate: number;
  institution: string | null;
  createdAt: string;
}

export interface CreateAccountRequest {
  name: string;
  type: AccountType;
  balance?: number;
  interestRate?: number;
  institution?: string;
}

export interface UpdateAccountRequest {
  name?: string;
  type?: AccountType;
  balance?: number;
  interestRate?: number;
  institution?: string;
}

export interface NetWorthSummary {
  assets: number;
  liabilities: number;
  netWorth: number;
}

export const accountsApi = {
  list: async (householdId: string): Promise<Account[]> => {
    const response = await apiClient.get(
      `/households/${householdId}/accounts`
    );
    return response.data;
  },

  get: async (householdId: string, id: string): Promise<Account> => {
    const response = await apiClient.get(
      `/households/${householdId}/accounts/${id}`
    );
    return response.data;
  },

  create: async (
    householdId: string,
    data: CreateAccountRequest
  ): Promise<Account> => {
    const response = await apiClient.post(
      `/households/${householdId}/accounts`,
      data
    );
    return response.data;
  },

  update: async (
    householdId: string,
    id: string,
    data: UpdateAccountRequest
  ): Promise<Account> => {
    const response = await apiClient.patch(
      `/households/${householdId}/accounts/${id}`,
      data
    );
    return response.data;
  },

  delete: async (householdId: string, id: string): Promise<void> => {
    await apiClient.delete(`/households/${householdId}/accounts/${id}`);
  },

  getSummary: async (householdId: string): Promise<NetWorthSummary> => {
    const response = await apiClient.get(
      `/households/${householdId}/accounts/summary`
    );
    return response.data;
  },
};
