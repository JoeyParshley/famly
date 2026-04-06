import apiClient from './client';

export type BudgetPeriod = 'weekly' | 'biweekly' | 'monthly' | 'yearly';

export interface Budget {
  id: string;
  category: string;
  amount: number;
  period: BudgetPeriod;
  createdAt: string;
}

export interface BudgetWithSpending extends Budget {
  spent: number;
  remaining: number;
  percentUsed: number;
}

export interface CreateBudgetRequest {
  category: string;
  amount: number;
  period?: BudgetPeriod;
}

export interface UpdateBudgetRequest {
  category?: string;
  amount?: number;
  period?: BudgetPeriod;
}

export interface BudgetSummary {
  totalBudget: number;
  totalSpent: number;
  totalRemaining: number;
  overBudgetCategories: string[];
}

export const budgetsApi = {
  list: async (householdId: string): Promise<Budget[]> => {
    const response = await apiClient.get(
      `/households/${householdId}/budgets`
    );
    return response.data;
  },

  get: async (householdId: string, id: string): Promise<Budget> => {
    const response = await apiClient.get(
      `/households/${householdId}/budgets/${id}`
    );
    return response.data;
  },

  create: async (
    householdId: string,
    data: CreateBudgetRequest
  ): Promise<Budget> => {
    const response = await apiClient.post(
      `/households/${householdId}/budgets`,
      data
    );
    return response.data;
  },

  update: async (
    householdId: string,
    id: string,
    data: UpdateBudgetRequest
  ): Promise<Budget> => {
    const response = await apiClient.patch(
      `/households/${householdId}/budgets/${id}`,
      data
    );
    return response.data;
  },

  delete: async (householdId: string, id: string): Promise<void> => {
    await apiClient.delete(`/households/${householdId}/budgets/${id}`);
  },

  listWithSpending: async (
    householdId: string,
    startDate?: string,
    endDate?: string
  ): Promise<BudgetWithSpending[]> => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const response = await apiClient.get(
      `/households/${householdId}/budgets/with-spending?${params.toString()}`
    );
    return response.data;
  },

  getSummary: async (householdId: string): Promise<BudgetSummary> => {
    const response = await apiClient.get(
      `/households/${householdId}/budgets/summary`
    );
    return response.data;
  },
};
