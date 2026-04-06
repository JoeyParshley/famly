import apiClient from './client';

export type DebtType =
  | 'mortgage'
  | 'auto_loan'
  | 'student_loan'
  | 'credit_card'
  | 'personal_loan'
  | 'medical'
  | 'other';

export type PayoffStrategy = 'avalanche' | 'snowball';

export interface Debt {
  id: string;
  name: string;
  type: DebtType;
  amount: number;
  interestRate: number;
  minimumPayment: number;
  paymentDueDay: number | null;
  createdAt: string;
}

export interface CreateDebtRequest {
  name: string;
  type: DebtType;
  amount: number;
  interestRate?: number;
  minimumPayment?: number;
  paymentDueDay?: number;
}

export interface UpdateDebtRequest {
  name?: string;
  type?: DebtType;
  amount?: number;
  interestRate?: number;
  minimumPayment?: number;
  paymentDueDay?: number;
}

export interface PayoffRequest {
  extraMonthlyPayment?: number;
  strategy?: PayoffStrategy;
}

export interface MonthlyPayment {
  month: number;
  date: string;
  debtId: string;
  debtName: string;
  payment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
}

export interface DebtPayoffResult {
  debtId: string;
  debtName: string;
  originalBalance: number;
  totalPaid: number;
  totalInterest: number;
  monthsToPayoff: number;
  payoffDate: string;
}

export interface PayoffScenario {
  strategy: PayoffStrategy;
  extraMonthlyPayment: number;
  totalMonths: number;
  totalPaid: number;
  totalInterest: number;
  debtFreeDate: string;
  debtResults: DebtPayoffResult[];
  monthlySchedule: MonthlyPayment[];
}

export interface StrategyComparison {
  avalanche: PayoffScenario;
  snowball: PayoffScenario;
  savings: {
    interestSaved: number;
    monthsSaved: number;
    recommendedStrategy: PayoffStrategy;
  };
}

export interface DebtSummary {
  totalDebt: number;
  totalMinimumPayment: number;
  debtCount: number;
  highestInterestRate: number;
  lowestBalance: number;
}

export const debtsApi = {
  list: async (householdId: string): Promise<Debt[]> => {
    const response = await apiClient.get(
      `/households/${householdId}/debts`
    );
    return response.data;
  },

  get: async (householdId: string, id: string): Promise<Debt> => {
    const response = await apiClient.get(
      `/households/${householdId}/debts/${id}`
    );
    return response.data;
  },

  create: async (
    householdId: string,
    data: CreateDebtRequest
  ): Promise<Debt> => {
    const response = await apiClient.post(
      `/households/${householdId}/debts`,
      data
    );
    return response.data;
  },

  update: async (
    householdId: string,
    id: string,
    data: UpdateDebtRequest
  ): Promise<Debt> => {
    const response = await apiClient.patch(
      `/households/${householdId}/debts/${id}`,
      data
    );
    return response.data;
  },

  delete: async (householdId: string, id: string): Promise<void> => {
    await apiClient.delete(`/households/${householdId}/debts/${id}`);
  },

  getSummary: async (householdId: string): Promise<DebtSummary> => {
    const response = await apiClient.get(
      `/households/${householdId}/debts/summary`
    );
    return response.data;
  },

  getPayoffScenario: async (
    householdId: string,
    request: PayoffRequest
  ): Promise<PayoffScenario> => {
    const response = await apiClient.post(
      `/households/${householdId}/debts/payoff`,
      request
    );
    return response.data;
  },

  getSingleDebtPayoff: async (
    householdId: string,
    debtId: string,
    request: PayoffRequest
  ): Promise<PayoffScenario> => {
    const response = await apiClient.post(
      `/households/${householdId}/debts/${debtId}/payoff`,
      request
    );
    return response.data;
  },

  compareStrategies: async (
    householdId: string,
    extraPayment: number = 0
  ): Promise<StrategyComparison> => {
    const response = await apiClient.get(
      `/households/${householdId}/debts/compare-strategies?extraPayment=${extraPayment}`
    );
    return response.data;
  },
};
