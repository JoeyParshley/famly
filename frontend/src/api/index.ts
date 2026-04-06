export { default as apiClient } from './client';
export { authApi } from './auth.api';
export { householdsApi } from './households.api';
export { accountsApi } from './accounts.api';
export { transactionsApi } from './transactions.api';
export { budgetsApi } from './budgets.api';
export { debtsApi } from './debts.api';
export { analyticsApi } from './analytics.api';
export { preferencesApi } from './preferences.api';

// Re-export types
export type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  DemoUser,
  UserProfile,
} from './auth.api';

export type {
  Household,
  HouseholdMember,
  CreateHouseholdRequest,
  AddMemberRequest,
} from './households.api';

export type {
  Account,
  AccountType,
  CreateAccountRequest,
  UpdateAccountRequest,
  NetWorthSummary,
} from './accounts.api';

export type {
  Transaction,
  CreateTransactionRequest,
  UpdateTransactionRequest,
  TransactionFilters,
  TransactionsResponse,
} from './transactions.api';

export type {
  Budget,
  BudgetWithSpending,
  BudgetPeriod,
  CreateBudgetRequest,
  UpdateBudgetRequest,
  BudgetSummary,
} from './budgets.api';

export type {
  Debt,
  DebtType,
  CreateDebtRequest,
  UpdateDebtRequest,
  PayoffRequest,
  PayoffScenario,
  PayoffStrategy,
  StrategyComparison,
  DebtSummary,
  MonthlyPayment,
  DebtPayoffResult,
} from './debts.api';

export type {
  SpendingByCategory,
  BalanceTrend,
  IncomeExpenseSummary,
  PurchaseImpactRequest,
  PurchaseImpactResult,
  DailyProjection,
  Payday,
  CreatePaydayRequest,
  DashboardSummary,
} from './analytics.api';

export type {
  Theme,
  UserPreferences,
  UpdatePreferencesRequest,
} from './preferences.api';
