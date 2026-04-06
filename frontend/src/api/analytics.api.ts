import apiClient from './client';

export interface SpendingByCategory {
  category: string;
  amount: number;
  percentage: number;
  transactionCount: number;
}

export interface BalanceTrend {
  date: string;
  balance: number;
  accountId: string;
  accountName: string;
}

export interface IncomeExpenseSummary {
  month: string;
  income: number;
  expenses: number;
  net: number;
}

export interface PurchaseImpactRequest {
  amount: number;
  accountId: string;
}

export interface DailyProjection {
  date: string;
  balance: number;
  isPayday: boolean;
}

export interface PurchaseImpactResult {
  currentBalance: number;
  purchaseAmount: number;
  balanceAfterPurchase: number;
  isBelowThreshold: boolean;
  alertThreshold: number;
  nextPayday: {
    date: string;
    amount: number;
    name: string;
  } | null;
  daysUntilNextPayday: number;
  projectedBalanceAtPayday: number;
  recoveryDate: string | null;
  dailyProjections: DailyProjection[];
}

export interface Payday {
  id: string;
  name: string;
  amount: number;
  frequency: 'weekly' | 'biweekly' | 'monthly';
  nextDate: string;
  createdAt: string;
}

export interface CreatePaydayRequest {
  name: string;
  amount: number;
  frequency: 'weekly' | 'biweekly' | 'monthly';
  nextDate: string;
}

export interface DashboardSummary {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  savingsRate: number;
  topSpendingCategories: SpendingByCategory[];
}

export const analyticsApi = {
  getSpendingByCategory: async (
    householdId: string,
    startDate?: string,
    endDate?: string
  ): Promise<SpendingByCategory[]> => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const response = await apiClient.get(
      `/households/${householdId}/analytics/spending?${params.toString()}`
    );
    return response.data;
  },

  getBalanceTrends: async (
    householdId: string,
    days: number = 30
  ): Promise<BalanceTrend[]> => {
    const response = await apiClient.get(
      `/households/${householdId}/analytics/trends?days=${days}`
    );
    return response.data;
  },

  getIncomeExpenseTrends: async (
    householdId: string,
    months: number = 6
  ): Promise<IncomeExpenseSummary[]> => {
    const response = await apiClient.get(
      `/households/${householdId}/analytics/income-expense?months=${months}`
    );
    return response.data;
  },

  simulatePurchaseImpact: async (
    householdId: string,
    data: PurchaseImpactRequest,
    threshold?: number
  ): Promise<PurchaseImpactResult> => {
    const params = threshold ? `?threshold=${threshold}` : '';
    const response = await apiClient.post(
      `/households/${householdId}/analytics/purchase-impact${params}`,
      data
    );
    return response.data;
  },

  getDashboardSummary: async (householdId: string): Promise<DashboardSummary> => {
    const response = await apiClient.get(
      `/households/${householdId}/analytics/dashboard`
    );
    return response.data;
  },

  // Payday management
  getPaydays: async (householdId: string): Promise<Payday[]> => {
    const response = await apiClient.get(
      `/households/${householdId}/analytics/paydays`
    );
    return response.data;
  },

  createPayday: async (
    householdId: string,
    data: CreatePaydayRequest
  ): Promise<Payday> => {
    const response = await apiClient.post(
      `/households/${householdId}/analytics/paydays`,
      data
    );
    return response.data;
  },

  deletePayday: async (householdId: string, paydayId: string): Promise<void> => {
    await apiClient.delete(
      `/households/${householdId}/analytics/paydays/${paydayId}`
    );
  },
};
