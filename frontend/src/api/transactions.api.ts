import apiClient from './client';

export interface Transaction {
  id: string;
  amount: number;
  category: string;
  description: string | null;
  occurredOn: string;
  createdAt: string;
  account: {
    id: string;
    name: string;
  };
}

export interface CreateTransactionRequest {
  accountId: string;
  amount: number;
  category: string;
  description?: string;
  occurredOn: string;
}

export interface UpdateTransactionRequest {
  accountId?: string;
  amount?: number;
  category?: string;
  description?: string;
  occurredOn?: string;
}

export interface TransactionFilters {
  accountId?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}

export interface TransactionsResponse {
  transactions: Transaction[];
  total: number;
}

export const transactionsApi = {
  list: async (
    householdId: string,
    filters: TransactionFilters = {}
  ): Promise<TransactionsResponse> => {
    const params = new URLSearchParams();
    if (filters.accountId) params.append('accountId', filters.accountId);
    if (filters.category) params.append('category', filters.category);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.offset) params.append('offset', filters.offset.toString());

    const response = await apiClient.get(
      `/households/${householdId}/transactions?${params.toString()}`
    );
    return response.data;
  },

  get: async (householdId: string, id: string): Promise<Transaction> => {
    const response = await apiClient.get(
      `/households/${householdId}/transactions/${id}`
    );
    return response.data;
  },

  create: async (
    householdId: string,
    data: CreateTransactionRequest
  ): Promise<Transaction> => {
    const response = await apiClient.post(
      `/households/${householdId}/transactions`,
      data
    );
    return response.data;
  },

  update: async (
    householdId: string,
    id: string,
    data: UpdateTransactionRequest
  ): Promise<Transaction> => {
    const response = await apiClient.patch(
      `/households/${householdId}/transactions/${id}`,
      data
    );
    return response.data;
  },

  delete: async (householdId: string, id: string): Promise<void> => {
    await apiClient.delete(`/households/${householdId}/transactions/${id}`);
  },

  getCategories: async (householdId: string): Promise<string[]> => {
    const response = await apiClient.get(
      `/households/${householdId}/transactions/categories`
    );
    return response.data;
  },

  getRecent: async (
    householdId: string,
    limit: number = 10
  ): Promise<Transaction[]> => {
    const response = await apiClient.get(
      `/households/${householdId}/transactions/recent?limit=${limit}`
    );
    return response.data;
  },
};
