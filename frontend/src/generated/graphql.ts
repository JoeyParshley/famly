import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: string; output: string; }
};

export type AccountModel = {
  __typename?: 'AccountModel';
  balance: Scalars['Float']['output'];
  createdAt: Scalars['Date']['output'];
  householdId: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  institution?: Maybe<Scalars['String']['output']>;
  interestRate?: Maybe<Scalars['Float']['output']>;
  name: Scalars['String']['output'];
  type: AccountType;
};

/** Type of financial account */
export enum AccountType {
  Cash = 'CASH',
  Checking = 'CHECKING',
  Credit = 'CREDIT',
  Investment = 'INVESTMENT',
  Savings = 'SAVINGS'
}

export type AccountsSummary = {
  __typename?: 'AccountsSummary';
  netWorth: Scalars['Float']['output'];
  totalAssets: Scalars['Float']['output'];
  totalBalance: Scalars['Float']['output'];
  totalLiabilities: Scalars['Float']['output'];
};

export type AddMemberInput = {
  email: Scalars['String']['input'];
  householdId: Scalars['String']['input'];
  role: HouseholdRole;
};

export type AuthPayload = {
  __typename?: 'AuthPayload';
  accessToken: Scalars['String']['output'];
  user: UserModel;
};

export type BalanceTrend = {
  __typename?: 'BalanceTrend';
  balance: Scalars['Float']['output'];
  date: Scalars['String']['output'];
};

export type BalanceTrendsInput = {
  days?: InputMaybe<Scalars['Int']['input']>;
  householdId: Scalars['String']['input'];
};

export type BudgetModel = {
  __typename?: 'BudgetModel';
  amount: Scalars['Float']['output'];
  category: Scalars['String']['output'];
  createdAt: Scalars['Date']['output'];
  householdId: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  period: BudgetPeriod;
};

/** Time period for budget tracking */
export enum BudgetPeriod {
  Biweekly = 'BIWEEKLY',
  Monthly = 'MONTHLY',
  Weekly = 'WEEKLY',
  Yearly = 'YEARLY'
}

export type BudgetSummary = {
  __typename?: 'BudgetSummary';
  overBudgetCategories: Array<OverBudgetCategory>;
  totalBudget: Scalars['Float']['output'];
  totalRemaining: Scalars['Float']['output'];
  totalSpent: Scalars['Float']['output'];
};

export type BudgetWithSpending = {
  __typename?: 'BudgetWithSpending';
  amount: Scalars['Float']['output'];
  category: Scalars['String']['output'];
  createdAt: Scalars['Date']['output'];
  householdId: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  percentUsed: Scalars['Float']['output'];
  period: BudgetPeriod;
  remaining: Scalars['Float']['output'];
  spent: Scalars['Float']['output'];
};

export type CreateAccountInput = {
  balance?: InputMaybe<Scalars['Float']['input']>;
  householdId: Scalars['String']['input'];
  institution?: InputMaybe<Scalars['String']['input']>;
  interestRate?: InputMaybe<Scalars['Float']['input']>;
  name: Scalars['String']['input'];
  type: AccountType;
};

export type CreateBudgetInput = {
  amount: Scalars['Float']['input'];
  category: Scalars['String']['input'];
  householdId: Scalars['String']['input'];
  period?: InputMaybe<BudgetPeriod>;
};

export type CreateDebtInput = {
  amount: Scalars['Float']['input'];
  householdId: Scalars['String']['input'];
  interestRate?: InputMaybe<Scalars['Float']['input']>;
  minimumPayment?: InputMaybe<Scalars['Float']['input']>;
  name: Scalars['String']['input'];
  paymentDueDay?: InputMaybe<Scalars['Int']['input']>;
  type: DebtType;
};

export type CreateHouseholdInput = {
  name: Scalars['String']['input'];
};

export type CreatePaydayInput = {
  amount: Scalars['Float']['input'];
  frequency: PaydayFrequency;
  householdId: Scalars['String']['input'];
  name: Scalars['String']['input'];
  nextDate: Scalars['String']['input'];
};

export type CreateTransactionInput = {
  accountId: Scalars['String']['input'];
  amount: Scalars['Float']['input'];
  category: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  occurredOn: Scalars['String']['input'];
};

export type DailyProjection = {
  __typename?: 'DailyProjection';
  balance: Scalars['Float']['output'];
  date: Scalars['String']['output'];
  isPayday: Scalars['Boolean']['output'];
  paydayName?: Maybe<Scalars['String']['output']>;
};

export type DashboardSummary = {
  __typename?: 'DashboardSummary';
  monthlyExpenses: Scalars['Float']['output'];
  monthlyIncome: Scalars['Float']['output'];
  savingsRate: Scalars['Float']['output'];
  topCategories: Array<TopCategory>;
  totalBalance: Scalars['Float']['output'];
};

export type DebtModel = {
  __typename?: 'DebtModel';
  amount: Scalars['Float']['output'];
  createdAt: Scalars['Date']['output'];
  householdId: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  interestRate?: Maybe<Scalars['Float']['output']>;
  minimumPayment?: Maybe<Scalars['Float']['output']>;
  name: Scalars['String']['output'];
  paymentDueDay?: Maybe<Scalars['Int']['output']>;
  type: DebtType;
};

export type DebtPayoffResult = {
  __typename?: 'DebtPayoffResult';
  debtName: Scalars['String']['output'];
  interestRate: Scalars['Float']['output'];
  monthlyPayments: Array<MonthlyPayment>;
  monthsToPayoff: Scalars['Int']['output'];
  originalBalance: Scalars['Float']['output'];
  payoffDate: Scalars['Date']['output'];
  totalInterestPaid: Scalars['Float']['output'];
  totalPaid: Scalars['Float']['output'];
};

export type DebtSummary = {
  __typename?: 'DebtSummary';
  debtCount: Scalars['Int']['output'];
  highestInterestRate?: Maybe<Scalars['Float']['output']>;
  lowestBalance?: Maybe<Scalars['Float']['output']>;
  totalDebt: Scalars['Float']['output'];
  totalMinimumPayment: Scalars['Float']['output'];
};

/** Type of debt */
export enum DebtType {
  AutoLoan = 'AUTO_LOAN',
  CreditCard = 'CREDIT_CARD',
  Medical = 'MEDICAL',
  Mortgage = 'MORTGAGE',
  Other = 'OTHER',
  PersonalLoan = 'PERSONAL_LOAN',
  StudentLoan = 'STUDENT_LOAN'
}

export type DemoLoginInput = {
  email: Scalars['String']['input'];
};

export type DemoUserModel = {
  __typename?: 'DemoUserModel';
  description?: Maybe<Scalars['String']['output']>;
  email: Scalars['String']['output'];
  name: Scalars['String']['output'];
  role: HouseholdRole;
};

export type HouseholdMemberModel = {
  __typename?: 'HouseholdMemberModel';
  createdAt: Scalars['Date']['output'];
  id: Scalars['ID']['output'];
  role: HouseholdRole;
  user: UserModel;
};

export type HouseholdModel = {
  __typename?: 'HouseholdModel';
  accounts: Array<AccountModel>;
  createdAt: Scalars['Date']['output'];
  id: Scalars['ID']['output'];
  members?: Maybe<Array<HouseholdMemberModel>>;
  name: Scalars['String']['output'];
};

/** The role of a member in a household */
export enum HouseholdRole {
  Admin = 'ADMIN',
  Edit = 'EDIT',
  View = 'VIEW'
}

export type IncomeExpenseTrend = {
  __typename?: 'IncomeExpenseTrend';
  expenses: Scalars['Float']['output'];
  income: Scalars['Float']['output'];
  month: Scalars['String']['output'];
  net: Scalars['Float']['output'];
};

export type IncomeExpenseTrendsInput = {
  householdId: Scalars['String']['input'];
  months?: InputMaybe<Scalars['Int']['input']>;
};

export type LoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type MonthlyPayment = {
  __typename?: 'MonthlyPayment';
  debtName: Scalars['String']['output'];
  interest: Scalars['Float']['output'];
  month: Scalars['Int']['output'];
  payment: Scalars['Float']['output'];
  principal: Scalars['Float']['output'];
  remainingBalance: Scalars['Float']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addMember: HouseholdMemberModel;
  createAccount: AccountModel;
  createBudget: BudgetModel;
  createDebt: DebtModel;
  createHousehold: HouseholdModel;
  createPayday: PaydayModel;
  createTransaction: TransactionModel;
  deleteAccount: Scalars['Boolean']['output'];
  deleteBudget: Scalars['Boolean']['output'];
  deleteDebt: Scalars['Boolean']['output'];
  deleteHousehold: Scalars['Boolean']['output'];
  deletePayday: Scalars['Boolean']['output'];
  deleteTransaction: Scalars['Boolean']['output'];
  demoLogin: AuthPayload;
  login: AuthPayload;
  register: AuthPayload;
  removeMember: Scalars['Boolean']['output'];
  updateAccount: AccountModel;
  updateBudget: BudgetModel;
  updateDebt: DebtModel;
  updateHousehold: HouseholdModel;
  updateMemberRole: HouseholdMemberModel;
  updatePreferences: UserPreferenceModel;
  updateTransaction: TransactionModel;
};


export type MutationAddMemberArgs = {
  input: AddMemberInput;
};


export type MutationCreateAccountArgs = {
  input: CreateAccountInput;
};


export type MutationCreateBudgetArgs = {
  input: CreateBudgetInput;
};


export type MutationCreateDebtArgs = {
  input: CreateDebtInput;
};


export type MutationCreateHouseholdArgs = {
  input: CreateHouseholdInput;
};


export type MutationCreatePaydayArgs = {
  input: CreatePaydayInput;
};


export type MutationCreateTransactionArgs = {
  householdId: Scalars['ID']['input'];
  input: CreateTransactionInput;
};


export type MutationDeleteAccountArgs = {
  householdId: Scalars['ID']['input'];
  id: Scalars['ID']['input'];
};


export type MutationDeleteBudgetArgs = {
  householdId: Scalars['ID']['input'];
  id: Scalars['ID']['input'];
};


export type MutationDeleteDebtArgs = {
  householdId: Scalars['ID']['input'];
  id: Scalars['ID']['input'];
};


export type MutationDeleteHouseholdArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeletePaydayArgs = {
  householdId: Scalars['ID']['input'];
  id: Scalars['ID']['input'];
};


export type MutationDeleteTransactionArgs = {
  householdId: Scalars['ID']['input'];
  id: Scalars['ID']['input'];
};


export type MutationDemoLoginArgs = {
  input: DemoLoginInput;
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationRegisterArgs = {
  input: RegisterInput;
};


export type MutationRemoveMemberArgs = {
  input: RemoveMemberInput;
};


export type MutationUpdateAccountArgs = {
  householdId: Scalars['ID']['input'];
  id: Scalars['ID']['input'];
  input: UpdateAccountInput;
};


export type MutationUpdateBudgetArgs = {
  householdId: Scalars['ID']['input'];
  id: Scalars['ID']['input'];
  input: UpdateBudgetInput;
};


export type MutationUpdateDebtArgs = {
  householdId: Scalars['ID']['input'];
  id: Scalars['ID']['input'];
  input: UpdateDebtInput;
};


export type MutationUpdateHouseholdArgs = {
  id: Scalars['ID']['input'];
  input: UpdateHouseholdInput;
};


export type MutationUpdateMemberRoleArgs = {
  input: UpdateMemberRoleInput;
};


export type MutationUpdatePreferencesArgs = {
  input: UpdatePreferencesInput;
};


export type MutationUpdateTransactionArgs = {
  householdId: Scalars['ID']['input'];
  id: Scalars['ID']['input'];
  input: UpdateTransactionInput;
};

export type OverBudgetCategory = {
  __typename?: 'OverBudgetCategory';
  budget: Scalars['Float']['output'];
  category: Scalars['String']['output'];
  overage: Scalars['Float']['output'];
  spent: Scalars['Float']['output'];
};

/** Frequency of payday */
export enum PaydayFrequency {
  Biweekly = 'BIWEEKLY',
  Monthly = 'MONTHLY',
  Weekly = 'WEEKLY'
}

export type PaydayModel = {
  __typename?: 'PaydayModel';
  amount: Scalars['Float']['output'];
  createdAt: Scalars['Date']['output'];
  frequency: PaydayFrequency;
  householdId: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  nextDate: Scalars['Date']['output'];
};

export type PayoffInput = {
  extraMonthlyPayment?: InputMaybe<Scalars['Float']['input']>;
  householdId: Scalars['String']['input'];
  strategy?: InputMaybe<PayoffStrategy>;
};

export type PayoffScenario = {
  __typename?: 'PayoffScenario';
  debtFreeDate: Scalars['Date']['output'];
  debts: Array<DebtPayoffResult>;
  extraMonthlyPayment: Scalars['Float']['output'];
  strategy: PayoffStrategy;
  totalInterestPaid: Scalars['Float']['output'];
  totalMonths: Scalars['Int']['output'];
  totalPaid: Scalars['Float']['output'];
};

/** Strategy for debt payoff calculation */
export enum PayoffStrategy {
  Avalanche = 'AVALANCHE',
  Snowball = 'SNOWBALL'
}

export type PurchaseImpactInput = {
  accountId: Scalars['String']['input'];
  amount: Scalars['Float']['input'];
};

export type PurchaseImpactResult = {
  __typename?: 'PurchaseImpactResult';
  alertThreshold: Scalars['Float']['output'];
  balanceAfterPurchase: Scalars['Float']['output'];
  belowThreshold: Scalars['Boolean']['output'];
  currentBalance: Scalars['Float']['output'];
  daysUntilRecovery?: Maybe<Scalars['Int']['output']>;
  nextPayday?: Maybe<Scalars['Date']['output']>;
  projections: Array<DailyProjection>;
  purchaseAmount: Scalars['Float']['output'];
  recoveryDate?: Maybe<Scalars['Date']['output']>;
};

export type Query = {
  __typename?: 'Query';
  account: AccountModel;
  accounts: Array<AccountModel>;
  accountsSummary: AccountsSummary;
  balanceTrends: Array<BalanceTrend>;
  budget: BudgetModel;
  budgetSummary: BudgetSummary;
  budgets: Array<BudgetModel>;
  budgetsWithSpending: Array<BudgetWithSpending>;
  compareStrategies: StrategyComparison;
  dashboardSummary: DashboardSummary;
  debt: DebtModel;
  debtPayoffScenario: PayoffScenario;
  debtSummary: DebtSummary;
  debts: Array<DebtModel>;
  demoUsers: Array<DemoUserModel>;
  household: HouseholdModel;
  households: Array<HouseholdModel>;
  incomeExpenseTrends: Array<IncomeExpenseTrend>;
  me: UserModel;
  paydays: Array<PaydayModel>;
  preferences: UserPreferenceModel;
  purchaseImpact: PurchaseImpactResult;
  recentTransactions: Array<TransactionModel>;
  spendingByCategory: Array<SpendingByCategory>;
  transaction: TransactionModel;
  transactionCategories: Array<Scalars['String']['output']>;
  transactions: TransactionConnection;
};


export type QueryAccountArgs = {
  householdId: Scalars['ID']['input'];
  id: Scalars['ID']['input'];
};


export type QueryAccountsArgs = {
  householdId: Scalars['ID']['input'];
};


export type QueryAccountsSummaryArgs = {
  householdId: Scalars['ID']['input'];
};


export type QueryBalanceTrendsArgs = {
  input: BalanceTrendsInput;
};


export type QueryBudgetArgs = {
  householdId: Scalars['ID']['input'];
  id: Scalars['ID']['input'];
};


export type QueryBudgetSummaryArgs = {
  householdId: Scalars['ID']['input'];
};


export type QueryBudgetsArgs = {
  householdId: Scalars['ID']['input'];
};


export type QueryBudgetsWithSpendingArgs = {
  endDate?: InputMaybe<Scalars['String']['input']>;
  householdId: Scalars['ID']['input'];
  startDate?: InputMaybe<Scalars['String']['input']>;
};


export type QueryCompareStrategiesArgs = {
  extraMonthlyPayment?: InputMaybe<Scalars['Float']['input']>;
  householdId: Scalars['ID']['input'];
};


export type QueryDashboardSummaryArgs = {
  householdId: Scalars['ID']['input'];
};


export type QueryDebtArgs = {
  householdId: Scalars['ID']['input'];
  id: Scalars['ID']['input'];
};


export type QueryDebtPayoffScenarioArgs = {
  input: PayoffInput;
};


export type QueryDebtSummaryArgs = {
  householdId: Scalars['ID']['input'];
};


export type QueryDebtsArgs = {
  householdId: Scalars['ID']['input'];
};


export type QueryHouseholdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryIncomeExpenseTrendsArgs = {
  input: IncomeExpenseTrendsInput;
};


export type QueryPaydaysArgs = {
  householdId: Scalars['ID']['input'];
};


export type QueryPurchaseImpactArgs = {
  householdId: Scalars['ID']['input'];
  input: PurchaseImpactInput;
};


export type QueryRecentTransactionsArgs = {
  householdId: Scalars['ID']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QuerySpendingByCategoryArgs = {
  input: SpendingByCategoryInput;
};


export type QueryTransactionArgs = {
  householdId: Scalars['ID']['input'];
  id: Scalars['ID']['input'];
};


export type QueryTransactionCategoriesArgs = {
  householdId: Scalars['ID']['input'];
};


export type QueryTransactionsArgs = {
  filter: TransactionFilterInput;
};

export type RegisterInput = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type RemoveMemberInput = {
  householdId: Scalars['String']['input'];
  memberId: Scalars['String']['input'];
};

export type SpendingByCategory = {
  __typename?: 'SpendingByCategory';
  amount: Scalars['Float']['output'];
  category: Scalars['String']['output'];
  percentage: Scalars['Float']['output'];
  transactionCount: Scalars['Int']['output'];
};

export type SpendingByCategoryInput = {
  endDate?: InputMaybe<Scalars['String']['input']>;
  householdId: Scalars['String']['input'];
  startDate?: InputMaybe<Scalars['String']['input']>;
};

export type StrategyComparison = {
  __typename?: 'StrategyComparison';
  avalanche: PayoffScenario;
  interestSaved: Scalars['Float']['output'];
  monthsDifference: Scalars['Int']['output'];
  recommendedStrategy: Scalars['String']['output'];
  snowball: PayoffScenario;
};

/** UI theme preference */
export enum Theme {
  Dark = 'DARK',
  Light = 'LIGHT'
}

export type TopCategory = {
  __typename?: 'TopCategory';
  amount: Scalars['Float']['output'];
  category: Scalars['String']['output'];
};

export type TransactionConnection = {
  __typename?: 'TransactionConnection';
  hasMore: Scalars['Boolean']['output'];
  items: Array<TransactionModel>;
  limit: Scalars['Int']['output'];
  offset: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type TransactionFilterInput = {
  accountId?: InputMaybe<Scalars['String']['input']>;
  category?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['String']['input']>;
  householdId: Scalars['String']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  startDate?: InputMaybe<Scalars['String']['input']>;
};

export type TransactionModel = {
  __typename?: 'TransactionModel';
  accountId: Scalars['String']['output'];
  amount: Scalars['Float']['output'];
  category: Scalars['String']['output'];
  createdAt: Scalars['Date']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  occurredOn: Scalars['Date']['output'];
};

export type UpdateAccountInput = {
  balance?: InputMaybe<Scalars['Float']['input']>;
  institution?: InputMaybe<Scalars['String']['input']>;
  interestRate?: InputMaybe<Scalars['Float']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<AccountType>;
};

export type UpdateBudgetInput = {
  amount?: InputMaybe<Scalars['Float']['input']>;
  category?: InputMaybe<Scalars['String']['input']>;
  period?: InputMaybe<BudgetPeriod>;
};

export type UpdateDebtInput = {
  amount?: InputMaybe<Scalars['Float']['input']>;
  interestRate?: InputMaybe<Scalars['Float']['input']>;
  minimumPayment?: InputMaybe<Scalars['Float']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  paymentDueDay?: InputMaybe<Scalars['Int']['input']>;
  type?: InputMaybe<DebtType>;
};

export type UpdateHouseholdInput = {
  name: Scalars['String']['input'];
};

export type UpdateMemberRoleInput = {
  householdId: Scalars['String']['input'];
  memberId: Scalars['String']['input'];
  role: HouseholdRole;
};

export type UpdatePreferencesInput = {
  balanceAlertThreshold?: InputMaybe<Scalars['Float']['input']>;
  theme?: InputMaybe<Theme>;
};

export type UpdateTransactionInput = {
  accountId?: InputMaybe<Scalars['String']['input']>;
  amount?: InputMaybe<Scalars['Float']['input']>;
  category?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  occurredOn?: InputMaybe<Scalars['String']['input']>;
};

export type UserModel = {
  __typename?: 'UserModel';
  createdAt: Scalars['Date']['output'];
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isDemo?: Maybe<Scalars['Boolean']['output']>;
  name: Scalars['String']['output'];
};

export type UserPreferenceModel = {
  __typename?: 'UserPreferenceModel';
  balanceAlertThreshold: Scalars['Float']['output'];
  createdAt: Scalars['Date']['output'];
  id: Scalars['ID']['output'];
  theme: Theme;
  updatedAt: Scalars['Date']['output'];
  userId: Scalars['String']['output'];
};

export type AccountFieldsFragment = { __typename?: 'AccountModel', id: string, householdId: string, name: string, type: AccountType, balance: number, interestRate?: number | null, institution?: string | null, createdAt: string };

export type AccountsQueryVariables = Exact<{
  householdId: Scalars['ID']['input'];
}>;


export type AccountsQuery = { __typename?: 'Query', accounts: Array<{ __typename?: 'AccountModel', id: string, householdId: string, name: string, type: AccountType, balance: number, interestRate?: number | null, institution?: string | null, createdAt: string }> };

export type AccountQueryVariables = Exact<{
  householdId: Scalars['ID']['input'];
  id: Scalars['ID']['input'];
}>;


export type AccountQuery = { __typename?: 'Query', account: { __typename?: 'AccountModel', id: string, householdId: string, name: string, type: AccountType, balance: number, interestRate?: number | null, institution?: string | null, createdAt: string } };

export type AccountsSummaryQueryVariables = Exact<{
  householdId: Scalars['ID']['input'];
}>;


export type AccountsSummaryQuery = { __typename?: 'Query', accountsSummary: { __typename?: 'AccountsSummary', totalBalance: number, totalAssets: number, totalLiabilities: number, netWorth: number } };

export type CreateAccountMutationVariables = Exact<{
  input: CreateAccountInput;
}>;


export type CreateAccountMutation = { __typename?: 'Mutation', createAccount: { __typename?: 'AccountModel', id: string, householdId: string, name: string, type: AccountType, balance: number, interestRate?: number | null, institution?: string | null, createdAt: string } };

export type UpdateAccountMutationVariables = Exact<{
  householdId: Scalars['ID']['input'];
  id: Scalars['ID']['input'];
  input: UpdateAccountInput;
}>;


export type UpdateAccountMutation = { __typename?: 'Mutation', updateAccount: { __typename?: 'AccountModel', id: string, householdId: string, name: string, type: AccountType, balance: number, interestRate?: number | null, institution?: string | null, createdAt: string } };

export type DeleteAccountMutationVariables = Exact<{
  householdId: Scalars['ID']['input'];
  id: Scalars['ID']['input'];
}>;


export type DeleteAccountMutation = { __typename?: 'Mutation', deleteAccount: boolean };

export type SpendingByCategoryFieldsFragment = { __typename?: 'SpendingByCategory', category: string, amount: number, percentage: number, transactionCount: number };

export type BalanceTrendFieldsFragment = { __typename?: 'BalanceTrend', date: string, balance: number };

export type IncomeExpenseTrendFieldsFragment = { __typename?: 'IncomeExpenseTrend', month: string, income: number, expenses: number, net: number };

export type DashboardSummaryFieldsFragment = { __typename?: 'DashboardSummary', totalBalance: number, monthlyIncome: number, monthlyExpenses: number, savingsRate: number, topCategories: Array<{ __typename?: 'TopCategory', category: string, amount: number }> };

export type PaydayFieldsFragment = { __typename?: 'PaydayModel', id: string, householdId: string, name: string, amount: number, frequency: PaydayFrequency, nextDate: string, createdAt: string };

export type PurchaseImpactFieldsFragment = { __typename?: 'PurchaseImpactResult', currentBalance: number, purchaseAmount: number, balanceAfterPurchase: number, alertThreshold: number, belowThreshold: boolean, nextPayday?: string | null, recoveryDate?: string | null, daysUntilRecovery?: number | null, projections: Array<{ __typename?: 'DailyProjection', date: string, balance: number, isPayday: boolean, paydayName?: string | null }> };

export type SpendingByCategoryQueryVariables = Exact<{
  input: SpendingByCategoryInput;
}>;


export type SpendingByCategoryQuery = { __typename?: 'Query', spendingByCategory: Array<{ __typename?: 'SpendingByCategory', category: string, amount: number, percentage: number, transactionCount: number }> };

export type BalanceTrendsQueryVariables = Exact<{
  input: BalanceTrendsInput;
}>;


export type BalanceTrendsQuery = { __typename?: 'Query', balanceTrends: Array<{ __typename?: 'BalanceTrend', date: string, balance: number }> };

export type IncomeExpenseTrendsQueryVariables = Exact<{
  input: IncomeExpenseTrendsInput;
}>;


export type IncomeExpenseTrendsQuery = { __typename?: 'Query', incomeExpenseTrends: Array<{ __typename?: 'IncomeExpenseTrend', month: string, income: number, expenses: number, net: number }> };

export type PurchaseImpactQueryVariables = Exact<{
  householdId: Scalars['ID']['input'];
  input: PurchaseImpactInput;
}>;


export type PurchaseImpactQuery = { __typename?: 'Query', purchaseImpact: { __typename?: 'PurchaseImpactResult', currentBalance: number, purchaseAmount: number, balanceAfterPurchase: number, alertThreshold: number, belowThreshold: boolean, nextPayday?: string | null, recoveryDate?: string | null, daysUntilRecovery?: number | null, projections: Array<{ __typename?: 'DailyProjection', date: string, balance: number, isPayday: boolean, paydayName?: string | null }> } };

export type DashboardSummaryQueryVariables = Exact<{
  householdId: Scalars['ID']['input'];
}>;


export type DashboardSummaryQuery = { __typename?: 'Query', dashboardSummary: { __typename?: 'DashboardSummary', totalBalance: number, monthlyIncome: number, monthlyExpenses: number, savingsRate: number, topCategories: Array<{ __typename?: 'TopCategory', category: string, amount: number }> } };

export type PaydaysQueryVariables = Exact<{
  householdId: Scalars['ID']['input'];
}>;


export type PaydaysQuery = { __typename?: 'Query', paydays: Array<{ __typename?: 'PaydayModel', id: string, householdId: string, name: string, amount: number, frequency: PaydayFrequency, nextDate: string, createdAt: string }> };

export type CreatePaydayMutationVariables = Exact<{
  input: CreatePaydayInput;
}>;


export type CreatePaydayMutation = { __typename?: 'Mutation', createPayday: { __typename?: 'PaydayModel', id: string, householdId: string, name: string, amount: number, frequency: PaydayFrequency, nextDate: string, createdAt: string } };

export type DeletePaydayMutationVariables = Exact<{
  householdId: Scalars['ID']['input'];
  id: Scalars['ID']['input'];
}>;


export type DeletePaydayMutation = { __typename?: 'Mutation', deletePayday: boolean };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me: { __typename?: 'UserModel', id: string, email: string, name: string, createdAt: string, isDemo?: boolean | null } };

export type DemoUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type DemoUsersQuery = { __typename?: 'Query', demoUsers: Array<{ __typename?: 'DemoUserModel', email: string, name: string, role: HouseholdRole, description?: string | null }> };

export type RegisterMutationVariables = Exact<{
  input: RegisterInput;
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'AuthPayload', accessToken: string, user: { __typename?: 'UserModel', id: string, email: string, name: string, createdAt: string, isDemo?: boolean | null } } };

export type LoginMutationVariables = Exact<{
  input: LoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'AuthPayload', accessToken: string, user: { __typename?: 'UserModel', id: string, email: string, name: string, createdAt: string, isDemo?: boolean | null } } };

export type DemoLoginMutationVariables = Exact<{
  input: DemoLoginInput;
}>;


export type DemoLoginMutation = { __typename?: 'Mutation', demoLogin: { __typename?: 'AuthPayload', accessToken: string, user: { __typename?: 'UserModel', id: string, email: string, name: string, createdAt: string, isDemo?: boolean | null } } };

export type BudgetFieldsFragment = { __typename?: 'BudgetModel', id: string, householdId: string, category: string, amount: number, period: BudgetPeriod, createdAt: string };

export type BudgetWithSpendingFieldsFragment = { __typename?: 'BudgetWithSpending', id: string, householdId: string, category: string, amount: number, period: BudgetPeriod, spent: number, remaining: number, percentUsed: number, createdAt: string };

export type BudgetsQueryVariables = Exact<{
  householdId: Scalars['ID']['input'];
}>;


export type BudgetsQuery = { __typename?: 'Query', budgets: Array<{ __typename?: 'BudgetModel', id: string, householdId: string, category: string, amount: number, period: BudgetPeriod, createdAt: string }> };

export type BudgetQueryVariables = Exact<{
  householdId: Scalars['ID']['input'];
  id: Scalars['ID']['input'];
}>;


export type BudgetQuery = { __typename?: 'Query', budget: { __typename?: 'BudgetModel', id: string, householdId: string, category: string, amount: number, period: BudgetPeriod, createdAt: string } };

export type BudgetsWithSpendingQueryVariables = Exact<{
  householdId: Scalars['ID']['input'];
  startDate?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['String']['input']>;
}>;


export type BudgetsWithSpendingQuery = { __typename?: 'Query', budgetsWithSpending: Array<{ __typename?: 'BudgetWithSpending', id: string, householdId: string, category: string, amount: number, period: BudgetPeriod, spent: number, remaining: number, percentUsed: number, createdAt: string }> };

export type BudgetSummaryQueryVariables = Exact<{
  householdId: Scalars['ID']['input'];
}>;


export type BudgetSummaryQuery = { __typename?: 'Query', budgetSummary: { __typename?: 'BudgetSummary', totalBudget: number, totalSpent: number, totalRemaining: number, overBudgetCategories: Array<{ __typename?: 'OverBudgetCategory', category: string, budget: number, spent: number, overage: number }> } };

export type CreateBudgetMutationVariables = Exact<{
  input: CreateBudgetInput;
}>;


export type CreateBudgetMutation = { __typename?: 'Mutation', createBudget: { __typename?: 'BudgetModel', id: string, householdId: string, category: string, amount: number, period: BudgetPeriod, createdAt: string } };

export type UpdateBudgetMutationVariables = Exact<{
  householdId: Scalars['ID']['input'];
  id: Scalars['ID']['input'];
  input: UpdateBudgetInput;
}>;


export type UpdateBudgetMutation = { __typename?: 'Mutation', updateBudget: { __typename?: 'BudgetModel', id: string, householdId: string, category: string, amount: number, period: BudgetPeriod, createdAt: string } };

export type DeleteBudgetMutationVariables = Exact<{
  householdId: Scalars['ID']['input'];
  id: Scalars['ID']['input'];
}>;


export type DeleteBudgetMutation = { __typename?: 'Mutation', deleteBudget: boolean };

export type DebtFieldsFragment = { __typename?: 'DebtModel', id: string, householdId: string, name: string, type: DebtType, amount: number, interestRate?: number | null, minimumPayment?: number | null, paymentDueDay?: number | null, createdAt: string };

export type PayoffScenarioFieldsFragment = { __typename?: 'PayoffScenario', strategy: PayoffStrategy, extraMonthlyPayment: number, totalMonths: number, totalInterestPaid: number, totalPaid: number, debtFreeDate: string, debts: Array<{ __typename?: 'DebtPayoffResult', debtName: string, originalBalance: number, interestRate: number, monthsToPayoff: number, totalInterestPaid: number, totalPaid: number, payoffDate: string, monthlyPayments: Array<{ __typename?: 'MonthlyPayment', month: number, debtName: string, payment: number, principal: number, interest: number, remainingBalance: number }> }> };

export type DebtsQueryVariables = Exact<{
  householdId: Scalars['ID']['input'];
}>;


export type DebtsQuery = { __typename?: 'Query', debts: Array<{ __typename?: 'DebtModel', id: string, householdId: string, name: string, type: DebtType, amount: number, interestRate?: number | null, minimumPayment?: number | null, paymentDueDay?: number | null, createdAt: string }> };

export type DebtQueryVariables = Exact<{
  householdId: Scalars['ID']['input'];
  id: Scalars['ID']['input'];
}>;


export type DebtQuery = { __typename?: 'Query', debt: { __typename?: 'DebtModel', id: string, householdId: string, name: string, type: DebtType, amount: number, interestRate?: number | null, minimumPayment?: number | null, paymentDueDay?: number | null, createdAt: string } };

export type DebtSummaryQueryVariables = Exact<{
  householdId: Scalars['ID']['input'];
}>;


export type DebtSummaryQuery = { __typename?: 'Query', debtSummary: { __typename?: 'DebtSummary', totalDebt: number, totalMinimumPayment: number, highestInterestRate?: number | null, lowestBalance?: number | null, debtCount: number } };

export type DebtPayoffScenarioQueryVariables = Exact<{
  input: PayoffInput;
}>;


export type DebtPayoffScenarioQuery = { __typename?: 'Query', debtPayoffScenario: { __typename?: 'PayoffScenario', strategy: PayoffStrategy, extraMonthlyPayment: number, totalMonths: number, totalInterestPaid: number, totalPaid: number, debtFreeDate: string, debts: Array<{ __typename?: 'DebtPayoffResult', debtName: string, originalBalance: number, interestRate: number, monthsToPayoff: number, totalInterestPaid: number, totalPaid: number, payoffDate: string, monthlyPayments: Array<{ __typename?: 'MonthlyPayment', month: number, debtName: string, payment: number, principal: number, interest: number, remainingBalance: number }> }> } };

export type CompareStrategiesQueryVariables = Exact<{
  householdId: Scalars['ID']['input'];
  extraMonthlyPayment?: InputMaybe<Scalars['Float']['input']>;
}>;


export type CompareStrategiesQuery = { __typename?: 'Query', compareStrategies: { __typename?: 'StrategyComparison', interestSaved: number, monthsDifference: number, recommendedStrategy: string, avalanche: { __typename?: 'PayoffScenario', strategy: PayoffStrategy, extraMonthlyPayment: number, totalMonths: number, totalInterestPaid: number, totalPaid: number, debtFreeDate: string, debts: Array<{ __typename?: 'DebtPayoffResult', debtName: string, originalBalance: number, interestRate: number, monthsToPayoff: number, totalInterestPaid: number, totalPaid: number, payoffDate: string, monthlyPayments: Array<{ __typename?: 'MonthlyPayment', month: number, debtName: string, payment: number, principal: number, interest: number, remainingBalance: number }> }> }, snowball: { __typename?: 'PayoffScenario', strategy: PayoffStrategy, extraMonthlyPayment: number, totalMonths: number, totalInterestPaid: number, totalPaid: number, debtFreeDate: string, debts: Array<{ __typename?: 'DebtPayoffResult', debtName: string, originalBalance: number, interestRate: number, monthsToPayoff: number, totalInterestPaid: number, totalPaid: number, payoffDate: string, monthlyPayments: Array<{ __typename?: 'MonthlyPayment', month: number, debtName: string, payment: number, principal: number, interest: number, remainingBalance: number }> }> } } };

export type CreateDebtMutationVariables = Exact<{
  input: CreateDebtInput;
}>;


export type CreateDebtMutation = { __typename?: 'Mutation', createDebt: { __typename?: 'DebtModel', id: string, householdId: string, name: string, type: DebtType, amount: number, interestRate?: number | null, minimumPayment?: number | null, paymentDueDay?: number | null, createdAt: string } };

export type UpdateDebtMutationVariables = Exact<{
  householdId: Scalars['ID']['input'];
  id: Scalars['ID']['input'];
  input: UpdateDebtInput;
}>;


export type UpdateDebtMutation = { __typename?: 'Mutation', updateDebt: { __typename?: 'DebtModel', id: string, householdId: string, name: string, type: DebtType, amount: number, interestRate?: number | null, minimumPayment?: number | null, paymentDueDay?: number | null, createdAt: string } };

export type DeleteDebtMutationVariables = Exact<{
  householdId: Scalars['ID']['input'];
  id: Scalars['ID']['input'];
}>;


export type DeleteDebtMutation = { __typename?: 'Mutation', deleteDebt: boolean };

export type HouseholdMemberFieldsFragment = { __typename?: 'HouseholdMemberModel', id: string, role: HouseholdRole, createdAt: string, user: { __typename?: 'UserModel', id: string, email: string, name: string, createdAt: string, isDemo?: boolean | null } };

export type HouseholdFieldsFragment = { __typename?: 'HouseholdModel', id: string, name: string, createdAt: string, members?: Array<{ __typename?: 'HouseholdMemberModel', id: string, role: HouseholdRole, createdAt: string, user: { __typename?: 'UserModel', id: string, email: string, name: string, createdAt: string, isDemo?: boolean | null } }> | null };

export type HouseholdsQueryVariables = Exact<{ [key: string]: never; }>;


export type HouseholdsQuery = { __typename?: 'Query', households: Array<{ __typename?: 'HouseholdModel', id: string, name: string, createdAt: string, members?: Array<{ __typename?: 'HouseholdMemberModel', id: string, role: HouseholdRole, createdAt: string, user: { __typename?: 'UserModel', id: string, email: string, name: string, createdAt: string, isDemo?: boolean | null } }> | null }> };

export type HouseholdQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type HouseholdQuery = { __typename?: 'Query', household: { __typename?: 'HouseholdModel', id: string, name: string, createdAt: string, accounts: Array<{ __typename?: 'AccountModel', id: string, name: string, type: AccountType, balance: number, interestRate?: number | null, institution?: string | null, createdAt: string }>, members?: Array<{ __typename?: 'HouseholdMemberModel', id: string, role: HouseholdRole, createdAt: string, user: { __typename?: 'UserModel', id: string, email: string, name: string, createdAt: string, isDemo?: boolean | null } }> | null } };

export type CreateHouseholdMutationVariables = Exact<{
  input: CreateHouseholdInput;
}>;


export type CreateHouseholdMutation = { __typename?: 'Mutation', createHousehold: { __typename?: 'HouseholdModel', id: string, name: string, createdAt: string, members?: Array<{ __typename?: 'HouseholdMemberModel', id: string, role: HouseholdRole, createdAt: string, user: { __typename?: 'UserModel', id: string, email: string, name: string, createdAt: string, isDemo?: boolean | null } }> | null } };

export type UpdateHouseholdMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateHouseholdInput;
}>;


export type UpdateHouseholdMutation = { __typename?: 'Mutation', updateHousehold: { __typename?: 'HouseholdModel', id: string, name: string, createdAt: string, members?: Array<{ __typename?: 'HouseholdMemberModel', id: string, role: HouseholdRole, createdAt: string, user: { __typename?: 'UserModel', id: string, email: string, name: string, createdAt: string, isDemo?: boolean | null } }> | null } };

export type DeleteHouseholdMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteHouseholdMutation = { __typename?: 'Mutation', deleteHousehold: boolean };

export type AddMemberMutationVariables = Exact<{
  input: AddMemberInput;
}>;


export type AddMemberMutation = { __typename?: 'Mutation', addMember: { __typename?: 'HouseholdMemberModel', id: string, role: HouseholdRole, createdAt: string, user: { __typename?: 'UserModel', id: string, email: string, name: string, createdAt: string, isDemo?: boolean | null } } };

export type UpdateMemberRoleMutationVariables = Exact<{
  input: UpdateMemberRoleInput;
}>;


export type UpdateMemberRoleMutation = { __typename?: 'Mutation', updateMemberRole: { __typename?: 'HouseholdMemberModel', id: string, role: HouseholdRole, createdAt: string, user: { __typename?: 'UserModel', id: string, email: string, name: string, createdAt: string, isDemo?: boolean | null } } };

export type RemoveMemberMutationVariables = Exact<{
  input: RemoveMemberInput;
}>;


export type RemoveMemberMutation = { __typename?: 'Mutation', removeMember: boolean };

export type UserPreferenceFieldsFragment = { __typename?: 'UserPreferenceModel', id: string, userId: string, theme: Theme, balanceAlertThreshold: number, createdAt: string, updatedAt: string };

export type PreferencesQueryVariables = Exact<{ [key: string]: never; }>;


export type PreferencesQuery = { __typename?: 'Query', preferences: { __typename?: 'UserPreferenceModel', id: string, userId: string, theme: Theme, balanceAlertThreshold: number, createdAt: string, updatedAt: string } };

export type UpdatePreferencesMutationVariables = Exact<{
  input: UpdatePreferencesInput;
}>;


export type UpdatePreferencesMutation = { __typename?: 'Mutation', updatePreferences: { __typename?: 'UserPreferenceModel', id: string, userId: string, theme: Theme, balanceAlertThreshold: number, createdAt: string, updatedAt: string } };

export type TransactionFieldsFragment = { __typename?: 'TransactionModel', id: string, accountId: string, amount: number, category: string, description?: string | null, occurredOn: string, createdAt: string };

export type TransactionsQueryVariables = Exact<{
  filter: TransactionFilterInput;
}>;


export type TransactionsQuery = { __typename?: 'Query', transactions: { __typename?: 'TransactionConnection', total: number, limit: number, offset: number, hasMore: boolean, items: Array<{ __typename?: 'TransactionModel', id: string, accountId: string, amount: number, category: string, description?: string | null, occurredOn: string, createdAt: string }> } };

export type TransactionQueryVariables = Exact<{
  householdId: Scalars['ID']['input'];
  id: Scalars['ID']['input'];
}>;


export type TransactionQuery = { __typename?: 'Query', transaction: { __typename?: 'TransactionModel', id: string, accountId: string, amount: number, category: string, description?: string | null, occurredOn: string, createdAt: string } };

export type TransactionCategoriesQueryVariables = Exact<{
  householdId: Scalars['ID']['input'];
}>;


export type TransactionCategoriesQuery = { __typename?: 'Query', transactionCategories: Array<string> };

export type RecentTransactionsQueryVariables = Exact<{
  householdId: Scalars['ID']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type RecentTransactionsQuery = { __typename?: 'Query', recentTransactions: Array<{ __typename?: 'TransactionModel', id: string, accountId: string, amount: number, category: string, description?: string | null, occurredOn: string, createdAt: string }> };

export type CreateTransactionMutationVariables = Exact<{
  householdId: Scalars['ID']['input'];
  input: CreateTransactionInput;
}>;


export type CreateTransactionMutation = { __typename?: 'Mutation', createTransaction: { __typename?: 'TransactionModel', id: string, accountId: string, amount: number, category: string, description?: string | null, occurredOn: string, createdAt: string } };

export type UpdateTransactionMutationVariables = Exact<{
  householdId: Scalars['ID']['input'];
  id: Scalars['ID']['input'];
  input: UpdateTransactionInput;
}>;


export type UpdateTransactionMutation = { __typename?: 'Mutation', updateTransaction: { __typename?: 'TransactionModel', id: string, accountId: string, amount: number, category: string, description?: string | null, occurredOn: string, createdAt: string } };

export type DeleteTransactionMutationVariables = Exact<{
  householdId: Scalars['ID']['input'];
  id: Scalars['ID']['input'];
}>;


export type DeleteTransactionMutation = { __typename?: 'Mutation', deleteTransaction: boolean };

export const AccountFieldsFragmentDoc = gql`
    fragment AccountFields on AccountModel {
  id
  householdId
  name
  type
  balance
  interestRate
  institution
  createdAt
}
    `;
export const SpendingByCategoryFieldsFragmentDoc = gql`
    fragment SpendingByCategoryFields on SpendingByCategory {
  category
  amount
  percentage
  transactionCount
}
    `;
export const BalanceTrendFieldsFragmentDoc = gql`
    fragment BalanceTrendFields on BalanceTrend {
  date
  balance
}
    `;
export const IncomeExpenseTrendFieldsFragmentDoc = gql`
    fragment IncomeExpenseTrendFields on IncomeExpenseTrend {
  month
  income
  expenses
  net
}
    `;
export const DashboardSummaryFieldsFragmentDoc = gql`
    fragment DashboardSummaryFields on DashboardSummary {
  totalBalance
  monthlyIncome
  monthlyExpenses
  savingsRate
  topCategories {
    category
    amount
  }
}
    `;
export const PaydayFieldsFragmentDoc = gql`
    fragment PaydayFields on PaydayModel {
  id
  householdId
  name
  amount
  frequency
  nextDate
  createdAt
}
    `;
export const PurchaseImpactFieldsFragmentDoc = gql`
    fragment PurchaseImpactFields on PurchaseImpactResult {
  currentBalance
  purchaseAmount
  balanceAfterPurchase
  alertThreshold
  belowThreshold
  nextPayday
  recoveryDate
  daysUntilRecovery
  projections {
    date
    balance
    isPayday
    paydayName
  }
}
    `;
export const BudgetFieldsFragmentDoc = gql`
    fragment BudgetFields on BudgetModel {
  id
  householdId
  category
  amount
  period
  createdAt
}
    `;
export const BudgetWithSpendingFieldsFragmentDoc = gql`
    fragment BudgetWithSpendingFields on BudgetWithSpending {
  id
  householdId
  category
  amount
  period
  spent
  remaining
  percentUsed
  createdAt
}
    `;
export const DebtFieldsFragmentDoc = gql`
    fragment DebtFields on DebtModel {
  id
  householdId
  name
  type
  amount
  interestRate
  minimumPayment
  paymentDueDay
  createdAt
}
    `;
export const PayoffScenarioFieldsFragmentDoc = gql`
    fragment PayoffScenarioFields on PayoffScenario {
  strategy
  extraMonthlyPayment
  totalMonths
  totalInterestPaid
  totalPaid
  debtFreeDate
  debts {
    debtName
    originalBalance
    interestRate
    monthsToPayoff
    totalInterestPaid
    totalPaid
    payoffDate
    monthlyPayments {
      month
      debtName
      payment
      principal
      interest
      remainingBalance
    }
  }
}
    `;
export const HouseholdMemberFieldsFragmentDoc = gql`
    fragment HouseholdMemberFields on HouseholdMemberModel {
  id
  user {
    id
    email
    name
    createdAt
    isDemo
  }
  role
  createdAt
}
    `;
export const HouseholdFieldsFragmentDoc = gql`
    fragment HouseholdFields on HouseholdModel {
  id
  name
  createdAt
  members {
    ...HouseholdMemberFields
  }
}
    ${HouseholdMemberFieldsFragmentDoc}`;
export const UserPreferenceFieldsFragmentDoc = gql`
    fragment UserPreferenceFields on UserPreferenceModel {
  id
  userId
  theme
  balanceAlertThreshold
  createdAt
  updatedAt
}
    `;
export const TransactionFieldsFragmentDoc = gql`
    fragment TransactionFields on TransactionModel {
  id
  accountId
  amount
  category
  description
  occurredOn
  createdAt
}
    `;
export const AccountsDocument = gql`
    query Accounts($householdId: ID!) {
  accounts(householdId: $householdId) {
    ...AccountFields
  }
}
    ${AccountFieldsFragmentDoc}`;

/**
 * __useAccountsQuery__
 *
 * To run a query within a React component, call `useAccountsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAccountsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAccountsQuery({
 *   variables: {
 *      householdId: // value for 'householdId'
 *   },
 * });
 */
export function useAccountsQuery(baseOptions: Apollo.QueryHookOptions<AccountsQuery, AccountsQueryVariables> & ({ variables: AccountsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AccountsQuery, AccountsQueryVariables>(AccountsDocument, options);
      }
export function useAccountsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AccountsQuery, AccountsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AccountsQuery, AccountsQueryVariables>(AccountsDocument, options);
        }
// @ts-ignore
export function useAccountsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<AccountsQuery, AccountsQueryVariables>): Apollo.UseSuspenseQueryResult<AccountsQuery, AccountsQueryVariables>;
export function useAccountsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<AccountsQuery, AccountsQueryVariables>): Apollo.UseSuspenseQueryResult<AccountsQuery | undefined, AccountsQueryVariables>;
export function useAccountsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<AccountsQuery, AccountsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<AccountsQuery, AccountsQueryVariables>(AccountsDocument, options);
        }
export type AccountsQueryHookResult = ReturnType<typeof useAccountsQuery>;
export type AccountsLazyQueryHookResult = ReturnType<typeof useAccountsLazyQuery>;
export type AccountsSuspenseQueryHookResult = ReturnType<typeof useAccountsSuspenseQuery>;
export type AccountsQueryResult = Apollo.QueryResult<AccountsQuery, AccountsQueryVariables>;
export const AccountDocument = gql`
    query Account($householdId: ID!, $id: ID!) {
  account(householdId: $householdId, id: $id) {
    ...AccountFields
  }
}
    ${AccountFieldsFragmentDoc}`;

/**
 * __useAccountQuery__
 *
 * To run a query within a React component, call `useAccountQuery` and pass it any options that fit your needs.
 * When your component renders, `useAccountQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAccountQuery({
 *   variables: {
 *      householdId: // value for 'householdId'
 *      id: // value for 'id'
 *   },
 * });
 */
export function useAccountQuery(baseOptions: Apollo.QueryHookOptions<AccountQuery, AccountQueryVariables> & ({ variables: AccountQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AccountQuery, AccountQueryVariables>(AccountDocument, options);
      }
export function useAccountLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AccountQuery, AccountQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AccountQuery, AccountQueryVariables>(AccountDocument, options);
        }
// @ts-ignore
export function useAccountSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<AccountQuery, AccountQueryVariables>): Apollo.UseSuspenseQueryResult<AccountQuery, AccountQueryVariables>;
export function useAccountSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<AccountQuery, AccountQueryVariables>): Apollo.UseSuspenseQueryResult<AccountQuery | undefined, AccountQueryVariables>;
export function useAccountSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<AccountQuery, AccountQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<AccountQuery, AccountQueryVariables>(AccountDocument, options);
        }
export type AccountQueryHookResult = ReturnType<typeof useAccountQuery>;
export type AccountLazyQueryHookResult = ReturnType<typeof useAccountLazyQuery>;
export type AccountSuspenseQueryHookResult = ReturnType<typeof useAccountSuspenseQuery>;
export type AccountQueryResult = Apollo.QueryResult<AccountQuery, AccountQueryVariables>;
export const AccountsSummaryDocument = gql`
    query AccountsSummary($householdId: ID!) {
  accountsSummary(householdId: $householdId) {
    totalBalance
    totalAssets
    totalLiabilities
    netWorth
  }
}
    `;

/**
 * __useAccountsSummaryQuery__
 *
 * To run a query within a React component, call `useAccountsSummaryQuery` and pass it any options that fit your needs.
 * When your component renders, `useAccountsSummaryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAccountsSummaryQuery({
 *   variables: {
 *      householdId: // value for 'householdId'
 *   },
 * });
 */
export function useAccountsSummaryQuery(baseOptions: Apollo.QueryHookOptions<AccountsSummaryQuery, AccountsSummaryQueryVariables> & ({ variables: AccountsSummaryQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AccountsSummaryQuery, AccountsSummaryQueryVariables>(AccountsSummaryDocument, options);
      }
export function useAccountsSummaryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AccountsSummaryQuery, AccountsSummaryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AccountsSummaryQuery, AccountsSummaryQueryVariables>(AccountsSummaryDocument, options);
        }
// @ts-ignore
export function useAccountsSummarySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<AccountsSummaryQuery, AccountsSummaryQueryVariables>): Apollo.UseSuspenseQueryResult<AccountsSummaryQuery, AccountsSummaryQueryVariables>;
export function useAccountsSummarySuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<AccountsSummaryQuery, AccountsSummaryQueryVariables>): Apollo.UseSuspenseQueryResult<AccountsSummaryQuery | undefined, AccountsSummaryQueryVariables>;
export function useAccountsSummarySuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<AccountsSummaryQuery, AccountsSummaryQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<AccountsSummaryQuery, AccountsSummaryQueryVariables>(AccountsSummaryDocument, options);
        }
export type AccountsSummaryQueryHookResult = ReturnType<typeof useAccountsSummaryQuery>;
export type AccountsSummaryLazyQueryHookResult = ReturnType<typeof useAccountsSummaryLazyQuery>;
export type AccountsSummarySuspenseQueryHookResult = ReturnType<typeof useAccountsSummarySuspenseQuery>;
export type AccountsSummaryQueryResult = Apollo.QueryResult<AccountsSummaryQuery, AccountsSummaryQueryVariables>;
export const CreateAccountDocument = gql`
    mutation CreateAccount($input: CreateAccountInput!) {
  createAccount(input: $input) {
    ...AccountFields
  }
}
    ${AccountFieldsFragmentDoc}`;
export type CreateAccountMutationFn = Apollo.MutationFunction<CreateAccountMutation, CreateAccountMutationVariables>;

/**
 * __useCreateAccountMutation__
 *
 * To run a mutation, you first call `useCreateAccountMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateAccountMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createAccountMutation, { data, loading, error }] = useCreateAccountMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateAccountMutation(baseOptions?: Apollo.MutationHookOptions<CreateAccountMutation, CreateAccountMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateAccountMutation, CreateAccountMutationVariables>(CreateAccountDocument, options);
      }
export type CreateAccountMutationHookResult = ReturnType<typeof useCreateAccountMutation>;
export type CreateAccountMutationResult = Apollo.MutationResult<CreateAccountMutation>;
export type CreateAccountMutationOptions = Apollo.BaseMutationOptions<CreateAccountMutation, CreateAccountMutationVariables>;
export const UpdateAccountDocument = gql`
    mutation UpdateAccount($householdId: ID!, $id: ID!, $input: UpdateAccountInput!) {
  updateAccount(householdId: $householdId, id: $id, input: $input) {
    ...AccountFields
  }
}
    ${AccountFieldsFragmentDoc}`;
export type UpdateAccountMutationFn = Apollo.MutationFunction<UpdateAccountMutation, UpdateAccountMutationVariables>;

/**
 * __useUpdateAccountMutation__
 *
 * To run a mutation, you first call `useUpdateAccountMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateAccountMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateAccountMutation, { data, loading, error }] = useUpdateAccountMutation({
 *   variables: {
 *      householdId: // value for 'householdId'
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateAccountMutation(baseOptions?: Apollo.MutationHookOptions<UpdateAccountMutation, UpdateAccountMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateAccountMutation, UpdateAccountMutationVariables>(UpdateAccountDocument, options);
      }
export type UpdateAccountMutationHookResult = ReturnType<typeof useUpdateAccountMutation>;
export type UpdateAccountMutationResult = Apollo.MutationResult<UpdateAccountMutation>;
export type UpdateAccountMutationOptions = Apollo.BaseMutationOptions<UpdateAccountMutation, UpdateAccountMutationVariables>;
export const DeleteAccountDocument = gql`
    mutation DeleteAccount($householdId: ID!, $id: ID!) {
  deleteAccount(householdId: $householdId, id: $id)
}
    `;
export type DeleteAccountMutationFn = Apollo.MutationFunction<DeleteAccountMutation, DeleteAccountMutationVariables>;

/**
 * __useDeleteAccountMutation__
 *
 * To run a mutation, you first call `useDeleteAccountMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteAccountMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteAccountMutation, { data, loading, error }] = useDeleteAccountMutation({
 *   variables: {
 *      householdId: // value for 'householdId'
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteAccountMutation(baseOptions?: Apollo.MutationHookOptions<DeleteAccountMutation, DeleteAccountMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteAccountMutation, DeleteAccountMutationVariables>(DeleteAccountDocument, options);
      }
export type DeleteAccountMutationHookResult = ReturnType<typeof useDeleteAccountMutation>;
export type DeleteAccountMutationResult = Apollo.MutationResult<DeleteAccountMutation>;
export type DeleteAccountMutationOptions = Apollo.BaseMutationOptions<DeleteAccountMutation, DeleteAccountMutationVariables>;
export const SpendingByCategoryDocument = gql`
    query SpendingByCategory($input: SpendingByCategoryInput!) {
  spendingByCategory(input: $input) {
    ...SpendingByCategoryFields
  }
}
    ${SpendingByCategoryFieldsFragmentDoc}`;

/**
 * __useSpendingByCategoryQuery__
 *
 * To run a query within a React component, call `useSpendingByCategoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useSpendingByCategoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSpendingByCategoryQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSpendingByCategoryQuery(baseOptions: Apollo.QueryHookOptions<SpendingByCategoryQuery, SpendingByCategoryQueryVariables> & ({ variables: SpendingByCategoryQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SpendingByCategoryQuery, SpendingByCategoryQueryVariables>(SpendingByCategoryDocument, options);
      }
export function useSpendingByCategoryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SpendingByCategoryQuery, SpendingByCategoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SpendingByCategoryQuery, SpendingByCategoryQueryVariables>(SpendingByCategoryDocument, options);
        }
// @ts-ignore
export function useSpendingByCategorySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<SpendingByCategoryQuery, SpendingByCategoryQueryVariables>): Apollo.UseSuspenseQueryResult<SpendingByCategoryQuery, SpendingByCategoryQueryVariables>;
export function useSpendingByCategorySuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<SpendingByCategoryQuery, SpendingByCategoryQueryVariables>): Apollo.UseSuspenseQueryResult<SpendingByCategoryQuery | undefined, SpendingByCategoryQueryVariables>;
export function useSpendingByCategorySuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<SpendingByCategoryQuery, SpendingByCategoryQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<SpendingByCategoryQuery, SpendingByCategoryQueryVariables>(SpendingByCategoryDocument, options);
        }
export type SpendingByCategoryQueryHookResult = ReturnType<typeof useSpendingByCategoryQuery>;
export type SpendingByCategoryLazyQueryHookResult = ReturnType<typeof useSpendingByCategoryLazyQuery>;
export type SpendingByCategorySuspenseQueryHookResult = ReturnType<typeof useSpendingByCategorySuspenseQuery>;
export type SpendingByCategoryQueryResult = Apollo.QueryResult<SpendingByCategoryQuery, SpendingByCategoryQueryVariables>;
export const BalanceTrendsDocument = gql`
    query BalanceTrends($input: BalanceTrendsInput!) {
  balanceTrends(input: $input) {
    ...BalanceTrendFields
  }
}
    ${BalanceTrendFieldsFragmentDoc}`;

/**
 * __useBalanceTrendsQuery__
 *
 * To run a query within a React component, call `useBalanceTrendsQuery` and pass it any options that fit your needs.
 * When your component renders, `useBalanceTrendsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBalanceTrendsQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useBalanceTrendsQuery(baseOptions: Apollo.QueryHookOptions<BalanceTrendsQuery, BalanceTrendsQueryVariables> & ({ variables: BalanceTrendsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<BalanceTrendsQuery, BalanceTrendsQueryVariables>(BalanceTrendsDocument, options);
      }
export function useBalanceTrendsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<BalanceTrendsQuery, BalanceTrendsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<BalanceTrendsQuery, BalanceTrendsQueryVariables>(BalanceTrendsDocument, options);
        }
// @ts-ignore
export function useBalanceTrendsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<BalanceTrendsQuery, BalanceTrendsQueryVariables>): Apollo.UseSuspenseQueryResult<BalanceTrendsQuery, BalanceTrendsQueryVariables>;
export function useBalanceTrendsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<BalanceTrendsQuery, BalanceTrendsQueryVariables>): Apollo.UseSuspenseQueryResult<BalanceTrendsQuery | undefined, BalanceTrendsQueryVariables>;
export function useBalanceTrendsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<BalanceTrendsQuery, BalanceTrendsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<BalanceTrendsQuery, BalanceTrendsQueryVariables>(BalanceTrendsDocument, options);
        }
export type BalanceTrendsQueryHookResult = ReturnType<typeof useBalanceTrendsQuery>;
export type BalanceTrendsLazyQueryHookResult = ReturnType<typeof useBalanceTrendsLazyQuery>;
export type BalanceTrendsSuspenseQueryHookResult = ReturnType<typeof useBalanceTrendsSuspenseQuery>;
export type BalanceTrendsQueryResult = Apollo.QueryResult<BalanceTrendsQuery, BalanceTrendsQueryVariables>;
export const IncomeExpenseTrendsDocument = gql`
    query IncomeExpenseTrends($input: IncomeExpenseTrendsInput!) {
  incomeExpenseTrends(input: $input) {
    ...IncomeExpenseTrendFields
  }
}
    ${IncomeExpenseTrendFieldsFragmentDoc}`;

/**
 * __useIncomeExpenseTrendsQuery__
 *
 * To run a query within a React component, call `useIncomeExpenseTrendsQuery` and pass it any options that fit your needs.
 * When your component renders, `useIncomeExpenseTrendsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useIncomeExpenseTrendsQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useIncomeExpenseTrendsQuery(baseOptions: Apollo.QueryHookOptions<IncomeExpenseTrendsQuery, IncomeExpenseTrendsQueryVariables> & ({ variables: IncomeExpenseTrendsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<IncomeExpenseTrendsQuery, IncomeExpenseTrendsQueryVariables>(IncomeExpenseTrendsDocument, options);
      }
export function useIncomeExpenseTrendsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<IncomeExpenseTrendsQuery, IncomeExpenseTrendsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<IncomeExpenseTrendsQuery, IncomeExpenseTrendsQueryVariables>(IncomeExpenseTrendsDocument, options);
        }
// @ts-ignore
export function useIncomeExpenseTrendsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<IncomeExpenseTrendsQuery, IncomeExpenseTrendsQueryVariables>): Apollo.UseSuspenseQueryResult<IncomeExpenseTrendsQuery, IncomeExpenseTrendsQueryVariables>;
export function useIncomeExpenseTrendsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<IncomeExpenseTrendsQuery, IncomeExpenseTrendsQueryVariables>): Apollo.UseSuspenseQueryResult<IncomeExpenseTrendsQuery | undefined, IncomeExpenseTrendsQueryVariables>;
export function useIncomeExpenseTrendsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<IncomeExpenseTrendsQuery, IncomeExpenseTrendsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<IncomeExpenseTrendsQuery, IncomeExpenseTrendsQueryVariables>(IncomeExpenseTrendsDocument, options);
        }
export type IncomeExpenseTrendsQueryHookResult = ReturnType<typeof useIncomeExpenseTrendsQuery>;
export type IncomeExpenseTrendsLazyQueryHookResult = ReturnType<typeof useIncomeExpenseTrendsLazyQuery>;
export type IncomeExpenseTrendsSuspenseQueryHookResult = ReturnType<typeof useIncomeExpenseTrendsSuspenseQuery>;
export type IncomeExpenseTrendsQueryResult = Apollo.QueryResult<IncomeExpenseTrendsQuery, IncomeExpenseTrendsQueryVariables>;
export const PurchaseImpactDocument = gql`
    query PurchaseImpact($householdId: ID!, $input: PurchaseImpactInput!) {
  purchaseImpact(householdId: $householdId, input: $input) {
    ...PurchaseImpactFields
  }
}
    ${PurchaseImpactFieldsFragmentDoc}`;

/**
 * __usePurchaseImpactQuery__
 *
 * To run a query within a React component, call `usePurchaseImpactQuery` and pass it any options that fit your needs.
 * When your component renders, `usePurchaseImpactQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePurchaseImpactQuery({
 *   variables: {
 *      householdId: // value for 'householdId'
 *      input: // value for 'input'
 *   },
 * });
 */
export function usePurchaseImpactQuery(baseOptions: Apollo.QueryHookOptions<PurchaseImpactQuery, PurchaseImpactQueryVariables> & ({ variables: PurchaseImpactQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PurchaseImpactQuery, PurchaseImpactQueryVariables>(PurchaseImpactDocument, options);
      }
export function usePurchaseImpactLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PurchaseImpactQuery, PurchaseImpactQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PurchaseImpactQuery, PurchaseImpactQueryVariables>(PurchaseImpactDocument, options);
        }
// @ts-ignore
export function usePurchaseImpactSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<PurchaseImpactQuery, PurchaseImpactQueryVariables>): Apollo.UseSuspenseQueryResult<PurchaseImpactQuery, PurchaseImpactQueryVariables>;
export function usePurchaseImpactSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<PurchaseImpactQuery, PurchaseImpactQueryVariables>): Apollo.UseSuspenseQueryResult<PurchaseImpactQuery | undefined, PurchaseImpactQueryVariables>;
export function usePurchaseImpactSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<PurchaseImpactQuery, PurchaseImpactQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<PurchaseImpactQuery, PurchaseImpactQueryVariables>(PurchaseImpactDocument, options);
        }
export type PurchaseImpactQueryHookResult = ReturnType<typeof usePurchaseImpactQuery>;
export type PurchaseImpactLazyQueryHookResult = ReturnType<typeof usePurchaseImpactLazyQuery>;
export type PurchaseImpactSuspenseQueryHookResult = ReturnType<typeof usePurchaseImpactSuspenseQuery>;
export type PurchaseImpactQueryResult = Apollo.QueryResult<PurchaseImpactQuery, PurchaseImpactQueryVariables>;
export const DashboardSummaryDocument = gql`
    query DashboardSummary($householdId: ID!) {
  dashboardSummary(householdId: $householdId) {
    ...DashboardSummaryFields
  }
}
    ${DashboardSummaryFieldsFragmentDoc}`;

/**
 * __useDashboardSummaryQuery__
 *
 * To run a query within a React component, call `useDashboardSummaryQuery` and pass it any options that fit your needs.
 * When your component renders, `useDashboardSummaryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDashboardSummaryQuery({
 *   variables: {
 *      householdId: // value for 'householdId'
 *   },
 * });
 */
export function useDashboardSummaryQuery(baseOptions: Apollo.QueryHookOptions<DashboardSummaryQuery, DashboardSummaryQueryVariables> & ({ variables: DashboardSummaryQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DashboardSummaryQuery, DashboardSummaryQueryVariables>(DashboardSummaryDocument, options);
      }
export function useDashboardSummaryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DashboardSummaryQuery, DashboardSummaryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DashboardSummaryQuery, DashboardSummaryQueryVariables>(DashboardSummaryDocument, options);
        }
// @ts-ignore
export function useDashboardSummarySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<DashboardSummaryQuery, DashboardSummaryQueryVariables>): Apollo.UseSuspenseQueryResult<DashboardSummaryQuery, DashboardSummaryQueryVariables>;
export function useDashboardSummarySuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<DashboardSummaryQuery, DashboardSummaryQueryVariables>): Apollo.UseSuspenseQueryResult<DashboardSummaryQuery | undefined, DashboardSummaryQueryVariables>;
export function useDashboardSummarySuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<DashboardSummaryQuery, DashboardSummaryQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<DashboardSummaryQuery, DashboardSummaryQueryVariables>(DashboardSummaryDocument, options);
        }
export type DashboardSummaryQueryHookResult = ReturnType<typeof useDashboardSummaryQuery>;
export type DashboardSummaryLazyQueryHookResult = ReturnType<typeof useDashboardSummaryLazyQuery>;
export type DashboardSummarySuspenseQueryHookResult = ReturnType<typeof useDashboardSummarySuspenseQuery>;
export type DashboardSummaryQueryResult = Apollo.QueryResult<DashboardSummaryQuery, DashboardSummaryQueryVariables>;
export const PaydaysDocument = gql`
    query Paydays($householdId: ID!) {
  paydays(householdId: $householdId) {
    ...PaydayFields
  }
}
    ${PaydayFieldsFragmentDoc}`;

/**
 * __usePaydaysQuery__
 *
 * To run a query within a React component, call `usePaydaysQuery` and pass it any options that fit your needs.
 * When your component renders, `usePaydaysQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePaydaysQuery({
 *   variables: {
 *      householdId: // value for 'householdId'
 *   },
 * });
 */
export function usePaydaysQuery(baseOptions: Apollo.QueryHookOptions<PaydaysQuery, PaydaysQueryVariables> & ({ variables: PaydaysQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PaydaysQuery, PaydaysQueryVariables>(PaydaysDocument, options);
      }
export function usePaydaysLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PaydaysQuery, PaydaysQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PaydaysQuery, PaydaysQueryVariables>(PaydaysDocument, options);
        }
// @ts-ignore
export function usePaydaysSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<PaydaysQuery, PaydaysQueryVariables>): Apollo.UseSuspenseQueryResult<PaydaysQuery, PaydaysQueryVariables>;
export function usePaydaysSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<PaydaysQuery, PaydaysQueryVariables>): Apollo.UseSuspenseQueryResult<PaydaysQuery | undefined, PaydaysQueryVariables>;
export function usePaydaysSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<PaydaysQuery, PaydaysQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<PaydaysQuery, PaydaysQueryVariables>(PaydaysDocument, options);
        }
export type PaydaysQueryHookResult = ReturnType<typeof usePaydaysQuery>;
export type PaydaysLazyQueryHookResult = ReturnType<typeof usePaydaysLazyQuery>;
export type PaydaysSuspenseQueryHookResult = ReturnType<typeof usePaydaysSuspenseQuery>;
export type PaydaysQueryResult = Apollo.QueryResult<PaydaysQuery, PaydaysQueryVariables>;
export const CreatePaydayDocument = gql`
    mutation CreatePayday($input: CreatePaydayInput!) {
  createPayday(input: $input) {
    ...PaydayFields
  }
}
    ${PaydayFieldsFragmentDoc}`;
export type CreatePaydayMutationFn = Apollo.MutationFunction<CreatePaydayMutation, CreatePaydayMutationVariables>;

/**
 * __useCreatePaydayMutation__
 *
 * To run a mutation, you first call `useCreatePaydayMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePaydayMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPaydayMutation, { data, loading, error }] = useCreatePaydayMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreatePaydayMutation(baseOptions?: Apollo.MutationHookOptions<CreatePaydayMutation, CreatePaydayMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreatePaydayMutation, CreatePaydayMutationVariables>(CreatePaydayDocument, options);
      }
export type CreatePaydayMutationHookResult = ReturnType<typeof useCreatePaydayMutation>;
export type CreatePaydayMutationResult = Apollo.MutationResult<CreatePaydayMutation>;
export type CreatePaydayMutationOptions = Apollo.BaseMutationOptions<CreatePaydayMutation, CreatePaydayMutationVariables>;
export const DeletePaydayDocument = gql`
    mutation DeletePayday($householdId: ID!, $id: ID!) {
  deletePayday(householdId: $householdId, id: $id)
}
    `;
export type DeletePaydayMutationFn = Apollo.MutationFunction<DeletePaydayMutation, DeletePaydayMutationVariables>;

/**
 * __useDeletePaydayMutation__
 *
 * To run a mutation, you first call `useDeletePaydayMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeletePaydayMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deletePaydayMutation, { data, loading, error }] = useDeletePaydayMutation({
 *   variables: {
 *      householdId: // value for 'householdId'
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeletePaydayMutation(baseOptions?: Apollo.MutationHookOptions<DeletePaydayMutation, DeletePaydayMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeletePaydayMutation, DeletePaydayMutationVariables>(DeletePaydayDocument, options);
      }
export type DeletePaydayMutationHookResult = ReturnType<typeof useDeletePaydayMutation>;
export type DeletePaydayMutationResult = Apollo.MutationResult<DeletePaydayMutation>;
export type DeletePaydayMutationOptions = Apollo.BaseMutationOptions<DeletePaydayMutation, DeletePaydayMutationVariables>;
export const MeDocument = gql`
    query Me {
  me {
    id
    email
    name
    createdAt
    isDemo
  }
}
    `;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
// @ts-ignore
export function useMeSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<MeQuery, MeQueryVariables>): Apollo.UseSuspenseQueryResult<MeQuery, MeQueryVariables>;
export function useMeSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MeQuery, MeQueryVariables>): Apollo.UseSuspenseQueryResult<MeQuery | undefined, MeQueryVariables>;
export function useMeSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeSuspenseQueryHookResult = ReturnType<typeof useMeSuspenseQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;
export const DemoUsersDocument = gql`
    query DemoUsers {
  demoUsers {
    email
    name
    role
    description
  }
}
    `;

/**
 * __useDemoUsersQuery__
 *
 * To run a query within a React component, call `useDemoUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useDemoUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDemoUsersQuery({
 *   variables: {
 *   },
 * });
 */
export function useDemoUsersQuery(baseOptions?: Apollo.QueryHookOptions<DemoUsersQuery, DemoUsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DemoUsersQuery, DemoUsersQueryVariables>(DemoUsersDocument, options);
      }
export function useDemoUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DemoUsersQuery, DemoUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DemoUsersQuery, DemoUsersQueryVariables>(DemoUsersDocument, options);
        }
// @ts-ignore
export function useDemoUsersSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<DemoUsersQuery, DemoUsersQueryVariables>): Apollo.UseSuspenseQueryResult<DemoUsersQuery, DemoUsersQueryVariables>;
export function useDemoUsersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<DemoUsersQuery, DemoUsersQueryVariables>): Apollo.UseSuspenseQueryResult<DemoUsersQuery | undefined, DemoUsersQueryVariables>;
export function useDemoUsersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<DemoUsersQuery, DemoUsersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<DemoUsersQuery, DemoUsersQueryVariables>(DemoUsersDocument, options);
        }
export type DemoUsersQueryHookResult = ReturnType<typeof useDemoUsersQuery>;
export type DemoUsersLazyQueryHookResult = ReturnType<typeof useDemoUsersLazyQuery>;
export type DemoUsersSuspenseQueryHookResult = ReturnType<typeof useDemoUsersSuspenseQuery>;
export type DemoUsersQueryResult = Apollo.QueryResult<DemoUsersQuery, DemoUsersQueryVariables>;
export const RegisterDocument = gql`
    mutation Register($input: RegisterInput!) {
  register(input: $input) {
    accessToken
    user {
      id
      email
      name
      createdAt
      isDemo
    }
  }
}
    `;
export type RegisterMutationFn = Apollo.MutationFunction<RegisterMutation, RegisterMutationVariables>;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRegisterMutation(baseOptions?: Apollo.MutationHookOptions<RegisterMutation, RegisterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, options);
      }
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = Apollo.BaseMutationOptions<RegisterMutation, RegisterMutationVariables>;
export const LoginDocument = gql`
    mutation Login($input: LoginInput!) {
  login(input: $input) {
    accessToken
    user {
      id
      email
      name
      createdAt
      isDemo
    }
  }
}
    `;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const DemoLoginDocument = gql`
    mutation DemoLogin($input: DemoLoginInput!) {
  demoLogin(input: $input) {
    accessToken
    user {
      id
      email
      name
      createdAt
      isDemo
    }
  }
}
    `;
export type DemoLoginMutationFn = Apollo.MutationFunction<DemoLoginMutation, DemoLoginMutationVariables>;

/**
 * __useDemoLoginMutation__
 *
 * To run a mutation, you first call `useDemoLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDemoLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [demoLoginMutation, { data, loading, error }] = useDemoLoginMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useDemoLoginMutation(baseOptions?: Apollo.MutationHookOptions<DemoLoginMutation, DemoLoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DemoLoginMutation, DemoLoginMutationVariables>(DemoLoginDocument, options);
      }
export type DemoLoginMutationHookResult = ReturnType<typeof useDemoLoginMutation>;
export type DemoLoginMutationResult = Apollo.MutationResult<DemoLoginMutation>;
export type DemoLoginMutationOptions = Apollo.BaseMutationOptions<DemoLoginMutation, DemoLoginMutationVariables>;
export const BudgetsDocument = gql`
    query Budgets($householdId: ID!) {
  budgets(householdId: $householdId) {
    ...BudgetFields
  }
}
    ${BudgetFieldsFragmentDoc}`;

/**
 * __useBudgetsQuery__
 *
 * To run a query within a React component, call `useBudgetsQuery` and pass it any options that fit your needs.
 * When your component renders, `useBudgetsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBudgetsQuery({
 *   variables: {
 *      householdId: // value for 'householdId'
 *   },
 * });
 */
export function useBudgetsQuery(baseOptions: Apollo.QueryHookOptions<BudgetsQuery, BudgetsQueryVariables> & ({ variables: BudgetsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<BudgetsQuery, BudgetsQueryVariables>(BudgetsDocument, options);
      }
export function useBudgetsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<BudgetsQuery, BudgetsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<BudgetsQuery, BudgetsQueryVariables>(BudgetsDocument, options);
        }
// @ts-ignore
export function useBudgetsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<BudgetsQuery, BudgetsQueryVariables>): Apollo.UseSuspenseQueryResult<BudgetsQuery, BudgetsQueryVariables>;
export function useBudgetsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<BudgetsQuery, BudgetsQueryVariables>): Apollo.UseSuspenseQueryResult<BudgetsQuery | undefined, BudgetsQueryVariables>;
export function useBudgetsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<BudgetsQuery, BudgetsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<BudgetsQuery, BudgetsQueryVariables>(BudgetsDocument, options);
        }
export type BudgetsQueryHookResult = ReturnType<typeof useBudgetsQuery>;
export type BudgetsLazyQueryHookResult = ReturnType<typeof useBudgetsLazyQuery>;
export type BudgetsSuspenseQueryHookResult = ReturnType<typeof useBudgetsSuspenseQuery>;
export type BudgetsQueryResult = Apollo.QueryResult<BudgetsQuery, BudgetsQueryVariables>;
export const BudgetDocument = gql`
    query Budget($householdId: ID!, $id: ID!) {
  budget(householdId: $householdId, id: $id) {
    ...BudgetFields
  }
}
    ${BudgetFieldsFragmentDoc}`;

/**
 * __useBudgetQuery__
 *
 * To run a query within a React component, call `useBudgetQuery` and pass it any options that fit your needs.
 * When your component renders, `useBudgetQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBudgetQuery({
 *   variables: {
 *      householdId: // value for 'householdId'
 *      id: // value for 'id'
 *   },
 * });
 */
export function useBudgetQuery(baseOptions: Apollo.QueryHookOptions<BudgetQuery, BudgetQueryVariables> & ({ variables: BudgetQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<BudgetQuery, BudgetQueryVariables>(BudgetDocument, options);
      }
export function useBudgetLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<BudgetQuery, BudgetQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<BudgetQuery, BudgetQueryVariables>(BudgetDocument, options);
        }
// @ts-ignore
export function useBudgetSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<BudgetQuery, BudgetQueryVariables>): Apollo.UseSuspenseQueryResult<BudgetQuery, BudgetQueryVariables>;
export function useBudgetSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<BudgetQuery, BudgetQueryVariables>): Apollo.UseSuspenseQueryResult<BudgetQuery | undefined, BudgetQueryVariables>;
export function useBudgetSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<BudgetQuery, BudgetQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<BudgetQuery, BudgetQueryVariables>(BudgetDocument, options);
        }
export type BudgetQueryHookResult = ReturnType<typeof useBudgetQuery>;
export type BudgetLazyQueryHookResult = ReturnType<typeof useBudgetLazyQuery>;
export type BudgetSuspenseQueryHookResult = ReturnType<typeof useBudgetSuspenseQuery>;
export type BudgetQueryResult = Apollo.QueryResult<BudgetQuery, BudgetQueryVariables>;
export const BudgetsWithSpendingDocument = gql`
    query BudgetsWithSpending($householdId: ID!, $startDate: String, $endDate: String) {
  budgetsWithSpending(
    householdId: $householdId
    startDate: $startDate
    endDate: $endDate
  ) {
    ...BudgetWithSpendingFields
  }
}
    ${BudgetWithSpendingFieldsFragmentDoc}`;

/**
 * __useBudgetsWithSpendingQuery__
 *
 * To run a query within a React component, call `useBudgetsWithSpendingQuery` and pass it any options that fit your needs.
 * When your component renders, `useBudgetsWithSpendingQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBudgetsWithSpendingQuery({
 *   variables: {
 *      householdId: // value for 'householdId'
 *      startDate: // value for 'startDate'
 *      endDate: // value for 'endDate'
 *   },
 * });
 */
export function useBudgetsWithSpendingQuery(baseOptions: Apollo.QueryHookOptions<BudgetsWithSpendingQuery, BudgetsWithSpendingQueryVariables> & ({ variables: BudgetsWithSpendingQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<BudgetsWithSpendingQuery, BudgetsWithSpendingQueryVariables>(BudgetsWithSpendingDocument, options);
      }
export function useBudgetsWithSpendingLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<BudgetsWithSpendingQuery, BudgetsWithSpendingQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<BudgetsWithSpendingQuery, BudgetsWithSpendingQueryVariables>(BudgetsWithSpendingDocument, options);
        }
// @ts-ignore
export function useBudgetsWithSpendingSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<BudgetsWithSpendingQuery, BudgetsWithSpendingQueryVariables>): Apollo.UseSuspenseQueryResult<BudgetsWithSpendingQuery, BudgetsWithSpendingQueryVariables>;
export function useBudgetsWithSpendingSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<BudgetsWithSpendingQuery, BudgetsWithSpendingQueryVariables>): Apollo.UseSuspenseQueryResult<BudgetsWithSpendingQuery | undefined, BudgetsWithSpendingQueryVariables>;
export function useBudgetsWithSpendingSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<BudgetsWithSpendingQuery, BudgetsWithSpendingQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<BudgetsWithSpendingQuery, BudgetsWithSpendingQueryVariables>(BudgetsWithSpendingDocument, options);
        }
export type BudgetsWithSpendingQueryHookResult = ReturnType<typeof useBudgetsWithSpendingQuery>;
export type BudgetsWithSpendingLazyQueryHookResult = ReturnType<typeof useBudgetsWithSpendingLazyQuery>;
export type BudgetsWithSpendingSuspenseQueryHookResult = ReturnType<typeof useBudgetsWithSpendingSuspenseQuery>;
export type BudgetsWithSpendingQueryResult = Apollo.QueryResult<BudgetsWithSpendingQuery, BudgetsWithSpendingQueryVariables>;
export const BudgetSummaryDocument = gql`
    query BudgetSummary($householdId: ID!) {
  budgetSummary(householdId: $householdId) {
    totalBudget
    totalSpent
    totalRemaining
    overBudgetCategories {
      category
      budget
      spent
      overage
    }
  }
}
    `;

/**
 * __useBudgetSummaryQuery__
 *
 * To run a query within a React component, call `useBudgetSummaryQuery` and pass it any options that fit your needs.
 * When your component renders, `useBudgetSummaryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBudgetSummaryQuery({
 *   variables: {
 *      householdId: // value for 'householdId'
 *   },
 * });
 */
export function useBudgetSummaryQuery(baseOptions: Apollo.QueryHookOptions<BudgetSummaryQuery, BudgetSummaryQueryVariables> & ({ variables: BudgetSummaryQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<BudgetSummaryQuery, BudgetSummaryQueryVariables>(BudgetSummaryDocument, options);
      }
export function useBudgetSummaryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<BudgetSummaryQuery, BudgetSummaryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<BudgetSummaryQuery, BudgetSummaryQueryVariables>(BudgetSummaryDocument, options);
        }
// @ts-ignore
export function useBudgetSummarySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<BudgetSummaryQuery, BudgetSummaryQueryVariables>): Apollo.UseSuspenseQueryResult<BudgetSummaryQuery, BudgetSummaryQueryVariables>;
export function useBudgetSummarySuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<BudgetSummaryQuery, BudgetSummaryQueryVariables>): Apollo.UseSuspenseQueryResult<BudgetSummaryQuery | undefined, BudgetSummaryQueryVariables>;
export function useBudgetSummarySuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<BudgetSummaryQuery, BudgetSummaryQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<BudgetSummaryQuery, BudgetSummaryQueryVariables>(BudgetSummaryDocument, options);
        }
export type BudgetSummaryQueryHookResult = ReturnType<typeof useBudgetSummaryQuery>;
export type BudgetSummaryLazyQueryHookResult = ReturnType<typeof useBudgetSummaryLazyQuery>;
export type BudgetSummarySuspenseQueryHookResult = ReturnType<typeof useBudgetSummarySuspenseQuery>;
export type BudgetSummaryQueryResult = Apollo.QueryResult<BudgetSummaryQuery, BudgetSummaryQueryVariables>;
export const CreateBudgetDocument = gql`
    mutation CreateBudget($input: CreateBudgetInput!) {
  createBudget(input: $input) {
    ...BudgetFields
  }
}
    ${BudgetFieldsFragmentDoc}`;
export type CreateBudgetMutationFn = Apollo.MutationFunction<CreateBudgetMutation, CreateBudgetMutationVariables>;

/**
 * __useCreateBudgetMutation__
 *
 * To run a mutation, you first call `useCreateBudgetMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateBudgetMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createBudgetMutation, { data, loading, error }] = useCreateBudgetMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateBudgetMutation(baseOptions?: Apollo.MutationHookOptions<CreateBudgetMutation, CreateBudgetMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateBudgetMutation, CreateBudgetMutationVariables>(CreateBudgetDocument, options);
      }
export type CreateBudgetMutationHookResult = ReturnType<typeof useCreateBudgetMutation>;
export type CreateBudgetMutationResult = Apollo.MutationResult<CreateBudgetMutation>;
export type CreateBudgetMutationOptions = Apollo.BaseMutationOptions<CreateBudgetMutation, CreateBudgetMutationVariables>;
export const UpdateBudgetDocument = gql`
    mutation UpdateBudget($householdId: ID!, $id: ID!, $input: UpdateBudgetInput!) {
  updateBudget(householdId: $householdId, id: $id, input: $input) {
    ...BudgetFields
  }
}
    ${BudgetFieldsFragmentDoc}`;
export type UpdateBudgetMutationFn = Apollo.MutationFunction<UpdateBudgetMutation, UpdateBudgetMutationVariables>;

/**
 * __useUpdateBudgetMutation__
 *
 * To run a mutation, you first call `useUpdateBudgetMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateBudgetMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateBudgetMutation, { data, loading, error }] = useUpdateBudgetMutation({
 *   variables: {
 *      householdId: // value for 'householdId'
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateBudgetMutation(baseOptions?: Apollo.MutationHookOptions<UpdateBudgetMutation, UpdateBudgetMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateBudgetMutation, UpdateBudgetMutationVariables>(UpdateBudgetDocument, options);
      }
export type UpdateBudgetMutationHookResult = ReturnType<typeof useUpdateBudgetMutation>;
export type UpdateBudgetMutationResult = Apollo.MutationResult<UpdateBudgetMutation>;
export type UpdateBudgetMutationOptions = Apollo.BaseMutationOptions<UpdateBudgetMutation, UpdateBudgetMutationVariables>;
export const DeleteBudgetDocument = gql`
    mutation DeleteBudget($householdId: ID!, $id: ID!) {
  deleteBudget(householdId: $householdId, id: $id)
}
    `;
export type DeleteBudgetMutationFn = Apollo.MutationFunction<DeleteBudgetMutation, DeleteBudgetMutationVariables>;

/**
 * __useDeleteBudgetMutation__
 *
 * To run a mutation, you first call `useDeleteBudgetMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteBudgetMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteBudgetMutation, { data, loading, error }] = useDeleteBudgetMutation({
 *   variables: {
 *      householdId: // value for 'householdId'
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteBudgetMutation(baseOptions?: Apollo.MutationHookOptions<DeleteBudgetMutation, DeleteBudgetMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteBudgetMutation, DeleteBudgetMutationVariables>(DeleteBudgetDocument, options);
      }
export type DeleteBudgetMutationHookResult = ReturnType<typeof useDeleteBudgetMutation>;
export type DeleteBudgetMutationResult = Apollo.MutationResult<DeleteBudgetMutation>;
export type DeleteBudgetMutationOptions = Apollo.BaseMutationOptions<DeleteBudgetMutation, DeleteBudgetMutationVariables>;
export const DebtsDocument = gql`
    query Debts($householdId: ID!) {
  debts(householdId: $householdId) {
    ...DebtFields
  }
}
    ${DebtFieldsFragmentDoc}`;

/**
 * __useDebtsQuery__
 *
 * To run a query within a React component, call `useDebtsQuery` and pass it any options that fit your needs.
 * When your component renders, `useDebtsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDebtsQuery({
 *   variables: {
 *      householdId: // value for 'householdId'
 *   },
 * });
 */
export function useDebtsQuery(baseOptions: Apollo.QueryHookOptions<DebtsQuery, DebtsQueryVariables> & ({ variables: DebtsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DebtsQuery, DebtsQueryVariables>(DebtsDocument, options);
      }
export function useDebtsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DebtsQuery, DebtsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DebtsQuery, DebtsQueryVariables>(DebtsDocument, options);
        }
// @ts-ignore
export function useDebtsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<DebtsQuery, DebtsQueryVariables>): Apollo.UseSuspenseQueryResult<DebtsQuery, DebtsQueryVariables>;
export function useDebtsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<DebtsQuery, DebtsQueryVariables>): Apollo.UseSuspenseQueryResult<DebtsQuery | undefined, DebtsQueryVariables>;
export function useDebtsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<DebtsQuery, DebtsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<DebtsQuery, DebtsQueryVariables>(DebtsDocument, options);
        }
export type DebtsQueryHookResult = ReturnType<typeof useDebtsQuery>;
export type DebtsLazyQueryHookResult = ReturnType<typeof useDebtsLazyQuery>;
export type DebtsSuspenseQueryHookResult = ReturnType<typeof useDebtsSuspenseQuery>;
export type DebtsQueryResult = Apollo.QueryResult<DebtsQuery, DebtsQueryVariables>;
export const DebtDocument = gql`
    query Debt($householdId: ID!, $id: ID!) {
  debt(householdId: $householdId, id: $id) {
    ...DebtFields
  }
}
    ${DebtFieldsFragmentDoc}`;

/**
 * __useDebtQuery__
 *
 * To run a query within a React component, call `useDebtQuery` and pass it any options that fit your needs.
 * When your component renders, `useDebtQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDebtQuery({
 *   variables: {
 *      householdId: // value for 'householdId'
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDebtQuery(baseOptions: Apollo.QueryHookOptions<DebtQuery, DebtQueryVariables> & ({ variables: DebtQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DebtQuery, DebtQueryVariables>(DebtDocument, options);
      }
export function useDebtLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DebtQuery, DebtQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DebtQuery, DebtQueryVariables>(DebtDocument, options);
        }
// @ts-ignore
export function useDebtSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<DebtQuery, DebtQueryVariables>): Apollo.UseSuspenseQueryResult<DebtQuery, DebtQueryVariables>;
export function useDebtSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<DebtQuery, DebtQueryVariables>): Apollo.UseSuspenseQueryResult<DebtQuery | undefined, DebtQueryVariables>;
export function useDebtSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<DebtQuery, DebtQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<DebtQuery, DebtQueryVariables>(DebtDocument, options);
        }
export type DebtQueryHookResult = ReturnType<typeof useDebtQuery>;
export type DebtLazyQueryHookResult = ReturnType<typeof useDebtLazyQuery>;
export type DebtSuspenseQueryHookResult = ReturnType<typeof useDebtSuspenseQuery>;
export type DebtQueryResult = Apollo.QueryResult<DebtQuery, DebtQueryVariables>;
export const DebtSummaryDocument = gql`
    query DebtSummary($householdId: ID!) {
  debtSummary(householdId: $householdId) {
    totalDebt
    totalMinimumPayment
    highestInterestRate
    lowestBalance
    debtCount
  }
}
    `;

/**
 * __useDebtSummaryQuery__
 *
 * To run a query within a React component, call `useDebtSummaryQuery` and pass it any options that fit your needs.
 * When your component renders, `useDebtSummaryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDebtSummaryQuery({
 *   variables: {
 *      householdId: // value for 'householdId'
 *   },
 * });
 */
export function useDebtSummaryQuery(baseOptions: Apollo.QueryHookOptions<DebtSummaryQuery, DebtSummaryQueryVariables> & ({ variables: DebtSummaryQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DebtSummaryQuery, DebtSummaryQueryVariables>(DebtSummaryDocument, options);
      }
export function useDebtSummaryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DebtSummaryQuery, DebtSummaryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DebtSummaryQuery, DebtSummaryQueryVariables>(DebtSummaryDocument, options);
        }
// @ts-ignore
export function useDebtSummarySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<DebtSummaryQuery, DebtSummaryQueryVariables>): Apollo.UseSuspenseQueryResult<DebtSummaryQuery, DebtSummaryQueryVariables>;
export function useDebtSummarySuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<DebtSummaryQuery, DebtSummaryQueryVariables>): Apollo.UseSuspenseQueryResult<DebtSummaryQuery | undefined, DebtSummaryQueryVariables>;
export function useDebtSummarySuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<DebtSummaryQuery, DebtSummaryQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<DebtSummaryQuery, DebtSummaryQueryVariables>(DebtSummaryDocument, options);
        }
export type DebtSummaryQueryHookResult = ReturnType<typeof useDebtSummaryQuery>;
export type DebtSummaryLazyQueryHookResult = ReturnType<typeof useDebtSummaryLazyQuery>;
export type DebtSummarySuspenseQueryHookResult = ReturnType<typeof useDebtSummarySuspenseQuery>;
export type DebtSummaryQueryResult = Apollo.QueryResult<DebtSummaryQuery, DebtSummaryQueryVariables>;
export const DebtPayoffScenarioDocument = gql`
    query DebtPayoffScenario($input: PayoffInput!) {
  debtPayoffScenario(input: $input) {
    ...PayoffScenarioFields
  }
}
    ${PayoffScenarioFieldsFragmentDoc}`;

/**
 * __useDebtPayoffScenarioQuery__
 *
 * To run a query within a React component, call `useDebtPayoffScenarioQuery` and pass it any options that fit your needs.
 * When your component renders, `useDebtPayoffScenarioQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDebtPayoffScenarioQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useDebtPayoffScenarioQuery(baseOptions: Apollo.QueryHookOptions<DebtPayoffScenarioQuery, DebtPayoffScenarioQueryVariables> & ({ variables: DebtPayoffScenarioQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DebtPayoffScenarioQuery, DebtPayoffScenarioQueryVariables>(DebtPayoffScenarioDocument, options);
      }
export function useDebtPayoffScenarioLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DebtPayoffScenarioQuery, DebtPayoffScenarioQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DebtPayoffScenarioQuery, DebtPayoffScenarioQueryVariables>(DebtPayoffScenarioDocument, options);
        }
// @ts-ignore
export function useDebtPayoffScenarioSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<DebtPayoffScenarioQuery, DebtPayoffScenarioQueryVariables>): Apollo.UseSuspenseQueryResult<DebtPayoffScenarioQuery, DebtPayoffScenarioQueryVariables>;
export function useDebtPayoffScenarioSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<DebtPayoffScenarioQuery, DebtPayoffScenarioQueryVariables>): Apollo.UseSuspenseQueryResult<DebtPayoffScenarioQuery | undefined, DebtPayoffScenarioQueryVariables>;
export function useDebtPayoffScenarioSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<DebtPayoffScenarioQuery, DebtPayoffScenarioQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<DebtPayoffScenarioQuery, DebtPayoffScenarioQueryVariables>(DebtPayoffScenarioDocument, options);
        }
export type DebtPayoffScenarioQueryHookResult = ReturnType<typeof useDebtPayoffScenarioQuery>;
export type DebtPayoffScenarioLazyQueryHookResult = ReturnType<typeof useDebtPayoffScenarioLazyQuery>;
export type DebtPayoffScenarioSuspenseQueryHookResult = ReturnType<typeof useDebtPayoffScenarioSuspenseQuery>;
export type DebtPayoffScenarioQueryResult = Apollo.QueryResult<DebtPayoffScenarioQuery, DebtPayoffScenarioQueryVariables>;
export const CompareStrategiesDocument = gql`
    query CompareStrategies($householdId: ID!, $extraMonthlyPayment: Float) {
  compareStrategies(
    householdId: $householdId
    extraMonthlyPayment: $extraMonthlyPayment
  ) {
    avalanche {
      ...PayoffScenarioFields
    }
    snowball {
      ...PayoffScenarioFields
    }
    interestSaved
    monthsDifference
    recommendedStrategy
  }
}
    ${PayoffScenarioFieldsFragmentDoc}`;

/**
 * __useCompareStrategiesQuery__
 *
 * To run a query within a React component, call `useCompareStrategiesQuery` and pass it any options that fit your needs.
 * When your component renders, `useCompareStrategiesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCompareStrategiesQuery({
 *   variables: {
 *      householdId: // value for 'householdId'
 *      extraMonthlyPayment: // value for 'extraMonthlyPayment'
 *   },
 * });
 */
export function useCompareStrategiesQuery(baseOptions: Apollo.QueryHookOptions<CompareStrategiesQuery, CompareStrategiesQueryVariables> & ({ variables: CompareStrategiesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CompareStrategiesQuery, CompareStrategiesQueryVariables>(CompareStrategiesDocument, options);
      }
export function useCompareStrategiesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CompareStrategiesQuery, CompareStrategiesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CompareStrategiesQuery, CompareStrategiesQueryVariables>(CompareStrategiesDocument, options);
        }
// @ts-ignore
export function useCompareStrategiesSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<CompareStrategiesQuery, CompareStrategiesQueryVariables>): Apollo.UseSuspenseQueryResult<CompareStrategiesQuery, CompareStrategiesQueryVariables>;
export function useCompareStrategiesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<CompareStrategiesQuery, CompareStrategiesQueryVariables>): Apollo.UseSuspenseQueryResult<CompareStrategiesQuery | undefined, CompareStrategiesQueryVariables>;
export function useCompareStrategiesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<CompareStrategiesQuery, CompareStrategiesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<CompareStrategiesQuery, CompareStrategiesQueryVariables>(CompareStrategiesDocument, options);
        }
export type CompareStrategiesQueryHookResult = ReturnType<typeof useCompareStrategiesQuery>;
export type CompareStrategiesLazyQueryHookResult = ReturnType<typeof useCompareStrategiesLazyQuery>;
export type CompareStrategiesSuspenseQueryHookResult = ReturnType<typeof useCompareStrategiesSuspenseQuery>;
export type CompareStrategiesQueryResult = Apollo.QueryResult<CompareStrategiesQuery, CompareStrategiesQueryVariables>;
export const CreateDebtDocument = gql`
    mutation CreateDebt($input: CreateDebtInput!) {
  createDebt(input: $input) {
    ...DebtFields
  }
}
    ${DebtFieldsFragmentDoc}`;
export type CreateDebtMutationFn = Apollo.MutationFunction<CreateDebtMutation, CreateDebtMutationVariables>;

/**
 * __useCreateDebtMutation__
 *
 * To run a mutation, you first call `useCreateDebtMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateDebtMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createDebtMutation, { data, loading, error }] = useCreateDebtMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateDebtMutation(baseOptions?: Apollo.MutationHookOptions<CreateDebtMutation, CreateDebtMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateDebtMutation, CreateDebtMutationVariables>(CreateDebtDocument, options);
      }
export type CreateDebtMutationHookResult = ReturnType<typeof useCreateDebtMutation>;
export type CreateDebtMutationResult = Apollo.MutationResult<CreateDebtMutation>;
export type CreateDebtMutationOptions = Apollo.BaseMutationOptions<CreateDebtMutation, CreateDebtMutationVariables>;
export const UpdateDebtDocument = gql`
    mutation UpdateDebt($householdId: ID!, $id: ID!, $input: UpdateDebtInput!) {
  updateDebt(householdId: $householdId, id: $id, input: $input) {
    ...DebtFields
  }
}
    ${DebtFieldsFragmentDoc}`;
export type UpdateDebtMutationFn = Apollo.MutationFunction<UpdateDebtMutation, UpdateDebtMutationVariables>;

/**
 * __useUpdateDebtMutation__
 *
 * To run a mutation, you first call `useUpdateDebtMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateDebtMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateDebtMutation, { data, loading, error }] = useUpdateDebtMutation({
 *   variables: {
 *      householdId: // value for 'householdId'
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateDebtMutation(baseOptions?: Apollo.MutationHookOptions<UpdateDebtMutation, UpdateDebtMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateDebtMutation, UpdateDebtMutationVariables>(UpdateDebtDocument, options);
      }
export type UpdateDebtMutationHookResult = ReturnType<typeof useUpdateDebtMutation>;
export type UpdateDebtMutationResult = Apollo.MutationResult<UpdateDebtMutation>;
export type UpdateDebtMutationOptions = Apollo.BaseMutationOptions<UpdateDebtMutation, UpdateDebtMutationVariables>;
export const DeleteDebtDocument = gql`
    mutation DeleteDebt($householdId: ID!, $id: ID!) {
  deleteDebt(householdId: $householdId, id: $id)
}
    `;
export type DeleteDebtMutationFn = Apollo.MutationFunction<DeleteDebtMutation, DeleteDebtMutationVariables>;

/**
 * __useDeleteDebtMutation__
 *
 * To run a mutation, you first call `useDeleteDebtMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteDebtMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteDebtMutation, { data, loading, error }] = useDeleteDebtMutation({
 *   variables: {
 *      householdId: // value for 'householdId'
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteDebtMutation(baseOptions?: Apollo.MutationHookOptions<DeleteDebtMutation, DeleteDebtMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteDebtMutation, DeleteDebtMutationVariables>(DeleteDebtDocument, options);
      }
export type DeleteDebtMutationHookResult = ReturnType<typeof useDeleteDebtMutation>;
export type DeleteDebtMutationResult = Apollo.MutationResult<DeleteDebtMutation>;
export type DeleteDebtMutationOptions = Apollo.BaseMutationOptions<DeleteDebtMutation, DeleteDebtMutationVariables>;
export const HouseholdsDocument = gql`
    query Households {
  households {
    ...HouseholdFields
  }
}
    ${HouseholdFieldsFragmentDoc}`;

/**
 * __useHouseholdsQuery__
 *
 * To run a query within a React component, call `useHouseholdsQuery` and pass it any options that fit your needs.
 * When your component renders, `useHouseholdsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useHouseholdsQuery({
 *   variables: {
 *   },
 * });
 */
export function useHouseholdsQuery(baseOptions?: Apollo.QueryHookOptions<HouseholdsQuery, HouseholdsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<HouseholdsQuery, HouseholdsQueryVariables>(HouseholdsDocument, options);
      }
export function useHouseholdsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<HouseholdsQuery, HouseholdsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<HouseholdsQuery, HouseholdsQueryVariables>(HouseholdsDocument, options);
        }
// @ts-ignore
export function useHouseholdsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<HouseholdsQuery, HouseholdsQueryVariables>): Apollo.UseSuspenseQueryResult<HouseholdsQuery, HouseholdsQueryVariables>;
export function useHouseholdsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<HouseholdsQuery, HouseholdsQueryVariables>): Apollo.UseSuspenseQueryResult<HouseholdsQuery | undefined, HouseholdsQueryVariables>;
export function useHouseholdsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<HouseholdsQuery, HouseholdsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<HouseholdsQuery, HouseholdsQueryVariables>(HouseholdsDocument, options);
        }
export type HouseholdsQueryHookResult = ReturnType<typeof useHouseholdsQuery>;
export type HouseholdsLazyQueryHookResult = ReturnType<typeof useHouseholdsLazyQuery>;
export type HouseholdsSuspenseQueryHookResult = ReturnType<typeof useHouseholdsSuspenseQuery>;
export type HouseholdsQueryResult = Apollo.QueryResult<HouseholdsQuery, HouseholdsQueryVariables>;
export const HouseholdDocument = gql`
    query Household($id: ID!) {
  household(id: $id) {
    ...HouseholdFields
    accounts {
      id
      name
      type
      balance
      interestRate
      institution
      createdAt
    }
  }
}
    ${HouseholdFieldsFragmentDoc}`;

/**
 * __useHouseholdQuery__
 *
 * To run a query within a React component, call `useHouseholdQuery` and pass it any options that fit your needs.
 * When your component renders, `useHouseholdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useHouseholdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useHouseholdQuery(baseOptions: Apollo.QueryHookOptions<HouseholdQuery, HouseholdQueryVariables> & ({ variables: HouseholdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<HouseholdQuery, HouseholdQueryVariables>(HouseholdDocument, options);
      }
export function useHouseholdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<HouseholdQuery, HouseholdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<HouseholdQuery, HouseholdQueryVariables>(HouseholdDocument, options);
        }
// @ts-ignore
export function useHouseholdSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<HouseholdQuery, HouseholdQueryVariables>): Apollo.UseSuspenseQueryResult<HouseholdQuery, HouseholdQueryVariables>;
export function useHouseholdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<HouseholdQuery, HouseholdQueryVariables>): Apollo.UseSuspenseQueryResult<HouseholdQuery | undefined, HouseholdQueryVariables>;
export function useHouseholdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<HouseholdQuery, HouseholdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<HouseholdQuery, HouseholdQueryVariables>(HouseholdDocument, options);
        }
export type HouseholdQueryHookResult = ReturnType<typeof useHouseholdQuery>;
export type HouseholdLazyQueryHookResult = ReturnType<typeof useHouseholdLazyQuery>;
export type HouseholdSuspenseQueryHookResult = ReturnType<typeof useHouseholdSuspenseQuery>;
export type HouseholdQueryResult = Apollo.QueryResult<HouseholdQuery, HouseholdQueryVariables>;
export const CreateHouseholdDocument = gql`
    mutation CreateHousehold($input: CreateHouseholdInput!) {
  createHousehold(input: $input) {
    ...HouseholdFields
  }
}
    ${HouseholdFieldsFragmentDoc}`;
export type CreateHouseholdMutationFn = Apollo.MutationFunction<CreateHouseholdMutation, CreateHouseholdMutationVariables>;

/**
 * __useCreateHouseholdMutation__
 *
 * To run a mutation, you first call `useCreateHouseholdMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateHouseholdMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createHouseholdMutation, { data, loading, error }] = useCreateHouseholdMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateHouseholdMutation(baseOptions?: Apollo.MutationHookOptions<CreateHouseholdMutation, CreateHouseholdMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateHouseholdMutation, CreateHouseholdMutationVariables>(CreateHouseholdDocument, options);
      }
export type CreateHouseholdMutationHookResult = ReturnType<typeof useCreateHouseholdMutation>;
export type CreateHouseholdMutationResult = Apollo.MutationResult<CreateHouseholdMutation>;
export type CreateHouseholdMutationOptions = Apollo.BaseMutationOptions<CreateHouseholdMutation, CreateHouseholdMutationVariables>;
export const UpdateHouseholdDocument = gql`
    mutation UpdateHousehold($id: ID!, $input: UpdateHouseholdInput!) {
  updateHousehold(id: $id, input: $input) {
    ...HouseholdFields
  }
}
    ${HouseholdFieldsFragmentDoc}`;
export type UpdateHouseholdMutationFn = Apollo.MutationFunction<UpdateHouseholdMutation, UpdateHouseholdMutationVariables>;

/**
 * __useUpdateHouseholdMutation__
 *
 * To run a mutation, you first call `useUpdateHouseholdMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateHouseholdMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateHouseholdMutation, { data, loading, error }] = useUpdateHouseholdMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateHouseholdMutation(baseOptions?: Apollo.MutationHookOptions<UpdateHouseholdMutation, UpdateHouseholdMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateHouseholdMutation, UpdateHouseholdMutationVariables>(UpdateHouseholdDocument, options);
      }
export type UpdateHouseholdMutationHookResult = ReturnType<typeof useUpdateHouseholdMutation>;
export type UpdateHouseholdMutationResult = Apollo.MutationResult<UpdateHouseholdMutation>;
export type UpdateHouseholdMutationOptions = Apollo.BaseMutationOptions<UpdateHouseholdMutation, UpdateHouseholdMutationVariables>;
export const DeleteHouseholdDocument = gql`
    mutation DeleteHousehold($id: ID!) {
  deleteHousehold(id: $id)
}
    `;
export type DeleteHouseholdMutationFn = Apollo.MutationFunction<DeleteHouseholdMutation, DeleteHouseholdMutationVariables>;

/**
 * __useDeleteHouseholdMutation__
 *
 * To run a mutation, you first call `useDeleteHouseholdMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteHouseholdMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteHouseholdMutation, { data, loading, error }] = useDeleteHouseholdMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteHouseholdMutation(baseOptions?: Apollo.MutationHookOptions<DeleteHouseholdMutation, DeleteHouseholdMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteHouseholdMutation, DeleteHouseholdMutationVariables>(DeleteHouseholdDocument, options);
      }
export type DeleteHouseholdMutationHookResult = ReturnType<typeof useDeleteHouseholdMutation>;
export type DeleteHouseholdMutationResult = Apollo.MutationResult<DeleteHouseholdMutation>;
export type DeleteHouseholdMutationOptions = Apollo.BaseMutationOptions<DeleteHouseholdMutation, DeleteHouseholdMutationVariables>;
export const AddMemberDocument = gql`
    mutation AddMember($input: AddMemberInput!) {
  addMember(input: $input) {
    ...HouseholdMemberFields
  }
}
    ${HouseholdMemberFieldsFragmentDoc}`;
export type AddMemberMutationFn = Apollo.MutationFunction<AddMemberMutation, AddMemberMutationVariables>;

/**
 * __useAddMemberMutation__
 *
 * To run a mutation, you first call `useAddMemberMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddMemberMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addMemberMutation, { data, loading, error }] = useAddMemberMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAddMemberMutation(baseOptions?: Apollo.MutationHookOptions<AddMemberMutation, AddMemberMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddMemberMutation, AddMemberMutationVariables>(AddMemberDocument, options);
      }
export type AddMemberMutationHookResult = ReturnType<typeof useAddMemberMutation>;
export type AddMemberMutationResult = Apollo.MutationResult<AddMemberMutation>;
export type AddMemberMutationOptions = Apollo.BaseMutationOptions<AddMemberMutation, AddMemberMutationVariables>;
export const UpdateMemberRoleDocument = gql`
    mutation UpdateMemberRole($input: UpdateMemberRoleInput!) {
  updateMemberRole(input: $input) {
    ...HouseholdMemberFields
  }
}
    ${HouseholdMemberFieldsFragmentDoc}`;
export type UpdateMemberRoleMutationFn = Apollo.MutationFunction<UpdateMemberRoleMutation, UpdateMemberRoleMutationVariables>;

/**
 * __useUpdateMemberRoleMutation__
 *
 * To run a mutation, you first call `useUpdateMemberRoleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateMemberRoleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateMemberRoleMutation, { data, loading, error }] = useUpdateMemberRoleMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateMemberRoleMutation(baseOptions?: Apollo.MutationHookOptions<UpdateMemberRoleMutation, UpdateMemberRoleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateMemberRoleMutation, UpdateMemberRoleMutationVariables>(UpdateMemberRoleDocument, options);
      }
export type UpdateMemberRoleMutationHookResult = ReturnType<typeof useUpdateMemberRoleMutation>;
export type UpdateMemberRoleMutationResult = Apollo.MutationResult<UpdateMemberRoleMutation>;
export type UpdateMemberRoleMutationOptions = Apollo.BaseMutationOptions<UpdateMemberRoleMutation, UpdateMemberRoleMutationVariables>;
export const RemoveMemberDocument = gql`
    mutation RemoveMember($input: RemoveMemberInput!) {
  removeMember(input: $input)
}
    `;
export type RemoveMemberMutationFn = Apollo.MutationFunction<RemoveMemberMutation, RemoveMemberMutationVariables>;

/**
 * __useRemoveMemberMutation__
 *
 * To run a mutation, you first call `useRemoveMemberMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveMemberMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeMemberMutation, { data, loading, error }] = useRemoveMemberMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRemoveMemberMutation(baseOptions?: Apollo.MutationHookOptions<RemoveMemberMutation, RemoveMemberMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveMemberMutation, RemoveMemberMutationVariables>(RemoveMemberDocument, options);
      }
export type RemoveMemberMutationHookResult = ReturnType<typeof useRemoveMemberMutation>;
export type RemoveMemberMutationResult = Apollo.MutationResult<RemoveMemberMutation>;
export type RemoveMemberMutationOptions = Apollo.BaseMutationOptions<RemoveMemberMutation, RemoveMemberMutationVariables>;
export const PreferencesDocument = gql`
    query Preferences {
  preferences {
    ...UserPreferenceFields
  }
}
    ${UserPreferenceFieldsFragmentDoc}`;

/**
 * __usePreferencesQuery__
 *
 * To run a query within a React component, call `usePreferencesQuery` and pass it any options that fit your needs.
 * When your component renders, `usePreferencesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePreferencesQuery({
 *   variables: {
 *   },
 * });
 */
export function usePreferencesQuery(baseOptions?: Apollo.QueryHookOptions<PreferencesQuery, PreferencesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PreferencesQuery, PreferencesQueryVariables>(PreferencesDocument, options);
      }
export function usePreferencesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PreferencesQuery, PreferencesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PreferencesQuery, PreferencesQueryVariables>(PreferencesDocument, options);
        }
// @ts-ignore
export function usePreferencesSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<PreferencesQuery, PreferencesQueryVariables>): Apollo.UseSuspenseQueryResult<PreferencesQuery, PreferencesQueryVariables>;
export function usePreferencesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<PreferencesQuery, PreferencesQueryVariables>): Apollo.UseSuspenseQueryResult<PreferencesQuery | undefined, PreferencesQueryVariables>;
export function usePreferencesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<PreferencesQuery, PreferencesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<PreferencesQuery, PreferencesQueryVariables>(PreferencesDocument, options);
        }
export type PreferencesQueryHookResult = ReturnType<typeof usePreferencesQuery>;
export type PreferencesLazyQueryHookResult = ReturnType<typeof usePreferencesLazyQuery>;
export type PreferencesSuspenseQueryHookResult = ReturnType<typeof usePreferencesSuspenseQuery>;
export type PreferencesQueryResult = Apollo.QueryResult<PreferencesQuery, PreferencesQueryVariables>;
export const UpdatePreferencesDocument = gql`
    mutation UpdatePreferences($input: UpdatePreferencesInput!) {
  updatePreferences(input: $input) {
    ...UserPreferenceFields
  }
}
    ${UserPreferenceFieldsFragmentDoc}`;
export type UpdatePreferencesMutationFn = Apollo.MutationFunction<UpdatePreferencesMutation, UpdatePreferencesMutationVariables>;

/**
 * __useUpdatePreferencesMutation__
 *
 * To run a mutation, you first call `useUpdatePreferencesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePreferencesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePreferencesMutation, { data, loading, error }] = useUpdatePreferencesMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdatePreferencesMutation(baseOptions?: Apollo.MutationHookOptions<UpdatePreferencesMutation, UpdatePreferencesMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdatePreferencesMutation, UpdatePreferencesMutationVariables>(UpdatePreferencesDocument, options);
      }
export type UpdatePreferencesMutationHookResult = ReturnType<typeof useUpdatePreferencesMutation>;
export type UpdatePreferencesMutationResult = Apollo.MutationResult<UpdatePreferencesMutation>;
export type UpdatePreferencesMutationOptions = Apollo.BaseMutationOptions<UpdatePreferencesMutation, UpdatePreferencesMutationVariables>;
export const TransactionsDocument = gql`
    query Transactions($filter: TransactionFilterInput!) {
  transactions(filter: $filter) {
    items {
      ...TransactionFields
    }
    total
    limit
    offset
    hasMore
  }
}
    ${TransactionFieldsFragmentDoc}`;

/**
 * __useTransactionsQuery__
 *
 * To run a query within a React component, call `useTransactionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useTransactionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTransactionsQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useTransactionsQuery(baseOptions: Apollo.QueryHookOptions<TransactionsQuery, TransactionsQueryVariables> & ({ variables: TransactionsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TransactionsQuery, TransactionsQueryVariables>(TransactionsDocument, options);
      }
export function useTransactionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TransactionsQuery, TransactionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TransactionsQuery, TransactionsQueryVariables>(TransactionsDocument, options);
        }
// @ts-ignore
export function useTransactionsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<TransactionsQuery, TransactionsQueryVariables>): Apollo.UseSuspenseQueryResult<TransactionsQuery, TransactionsQueryVariables>;
export function useTransactionsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<TransactionsQuery, TransactionsQueryVariables>): Apollo.UseSuspenseQueryResult<TransactionsQuery | undefined, TransactionsQueryVariables>;
export function useTransactionsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<TransactionsQuery, TransactionsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<TransactionsQuery, TransactionsQueryVariables>(TransactionsDocument, options);
        }
export type TransactionsQueryHookResult = ReturnType<typeof useTransactionsQuery>;
export type TransactionsLazyQueryHookResult = ReturnType<typeof useTransactionsLazyQuery>;
export type TransactionsSuspenseQueryHookResult = ReturnType<typeof useTransactionsSuspenseQuery>;
export type TransactionsQueryResult = Apollo.QueryResult<TransactionsQuery, TransactionsQueryVariables>;
export const TransactionDocument = gql`
    query Transaction($householdId: ID!, $id: ID!) {
  transaction(householdId: $householdId, id: $id) {
    ...TransactionFields
  }
}
    ${TransactionFieldsFragmentDoc}`;

/**
 * __useTransactionQuery__
 *
 * To run a query within a React component, call `useTransactionQuery` and pass it any options that fit your needs.
 * When your component renders, `useTransactionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTransactionQuery({
 *   variables: {
 *      householdId: // value for 'householdId'
 *      id: // value for 'id'
 *   },
 * });
 */
export function useTransactionQuery(baseOptions: Apollo.QueryHookOptions<TransactionQuery, TransactionQueryVariables> & ({ variables: TransactionQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TransactionQuery, TransactionQueryVariables>(TransactionDocument, options);
      }
export function useTransactionLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TransactionQuery, TransactionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TransactionQuery, TransactionQueryVariables>(TransactionDocument, options);
        }
// @ts-ignore
export function useTransactionSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<TransactionQuery, TransactionQueryVariables>): Apollo.UseSuspenseQueryResult<TransactionQuery, TransactionQueryVariables>;
export function useTransactionSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<TransactionQuery, TransactionQueryVariables>): Apollo.UseSuspenseQueryResult<TransactionQuery | undefined, TransactionQueryVariables>;
export function useTransactionSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<TransactionQuery, TransactionQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<TransactionQuery, TransactionQueryVariables>(TransactionDocument, options);
        }
export type TransactionQueryHookResult = ReturnType<typeof useTransactionQuery>;
export type TransactionLazyQueryHookResult = ReturnType<typeof useTransactionLazyQuery>;
export type TransactionSuspenseQueryHookResult = ReturnType<typeof useTransactionSuspenseQuery>;
export type TransactionQueryResult = Apollo.QueryResult<TransactionQuery, TransactionQueryVariables>;
export const TransactionCategoriesDocument = gql`
    query TransactionCategories($householdId: ID!) {
  transactionCategories(householdId: $householdId)
}
    `;

/**
 * __useTransactionCategoriesQuery__
 *
 * To run a query within a React component, call `useTransactionCategoriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useTransactionCategoriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTransactionCategoriesQuery({
 *   variables: {
 *      householdId: // value for 'householdId'
 *   },
 * });
 */
export function useTransactionCategoriesQuery(baseOptions: Apollo.QueryHookOptions<TransactionCategoriesQuery, TransactionCategoriesQueryVariables> & ({ variables: TransactionCategoriesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TransactionCategoriesQuery, TransactionCategoriesQueryVariables>(TransactionCategoriesDocument, options);
      }
export function useTransactionCategoriesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TransactionCategoriesQuery, TransactionCategoriesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TransactionCategoriesQuery, TransactionCategoriesQueryVariables>(TransactionCategoriesDocument, options);
        }
// @ts-ignore
export function useTransactionCategoriesSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<TransactionCategoriesQuery, TransactionCategoriesQueryVariables>): Apollo.UseSuspenseQueryResult<TransactionCategoriesQuery, TransactionCategoriesQueryVariables>;
export function useTransactionCategoriesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<TransactionCategoriesQuery, TransactionCategoriesQueryVariables>): Apollo.UseSuspenseQueryResult<TransactionCategoriesQuery | undefined, TransactionCategoriesQueryVariables>;
export function useTransactionCategoriesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<TransactionCategoriesQuery, TransactionCategoriesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<TransactionCategoriesQuery, TransactionCategoriesQueryVariables>(TransactionCategoriesDocument, options);
        }
export type TransactionCategoriesQueryHookResult = ReturnType<typeof useTransactionCategoriesQuery>;
export type TransactionCategoriesLazyQueryHookResult = ReturnType<typeof useTransactionCategoriesLazyQuery>;
export type TransactionCategoriesSuspenseQueryHookResult = ReturnType<typeof useTransactionCategoriesSuspenseQuery>;
export type TransactionCategoriesQueryResult = Apollo.QueryResult<TransactionCategoriesQuery, TransactionCategoriesQueryVariables>;
export const RecentTransactionsDocument = gql`
    query RecentTransactions($householdId: ID!, $limit: Int) {
  recentTransactions(householdId: $householdId, limit: $limit) {
    ...TransactionFields
  }
}
    ${TransactionFieldsFragmentDoc}`;

/**
 * __useRecentTransactionsQuery__
 *
 * To run a query within a React component, call `useRecentTransactionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useRecentTransactionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRecentTransactionsQuery({
 *   variables: {
 *      householdId: // value for 'householdId'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useRecentTransactionsQuery(baseOptions: Apollo.QueryHookOptions<RecentTransactionsQuery, RecentTransactionsQueryVariables> & ({ variables: RecentTransactionsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<RecentTransactionsQuery, RecentTransactionsQueryVariables>(RecentTransactionsDocument, options);
      }
export function useRecentTransactionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RecentTransactionsQuery, RecentTransactionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<RecentTransactionsQuery, RecentTransactionsQueryVariables>(RecentTransactionsDocument, options);
        }
// @ts-ignore
export function useRecentTransactionsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<RecentTransactionsQuery, RecentTransactionsQueryVariables>): Apollo.UseSuspenseQueryResult<RecentTransactionsQuery, RecentTransactionsQueryVariables>;
export function useRecentTransactionsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<RecentTransactionsQuery, RecentTransactionsQueryVariables>): Apollo.UseSuspenseQueryResult<RecentTransactionsQuery | undefined, RecentTransactionsQueryVariables>;
export function useRecentTransactionsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<RecentTransactionsQuery, RecentTransactionsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<RecentTransactionsQuery, RecentTransactionsQueryVariables>(RecentTransactionsDocument, options);
        }
export type RecentTransactionsQueryHookResult = ReturnType<typeof useRecentTransactionsQuery>;
export type RecentTransactionsLazyQueryHookResult = ReturnType<typeof useRecentTransactionsLazyQuery>;
export type RecentTransactionsSuspenseQueryHookResult = ReturnType<typeof useRecentTransactionsSuspenseQuery>;
export type RecentTransactionsQueryResult = Apollo.QueryResult<RecentTransactionsQuery, RecentTransactionsQueryVariables>;
export const CreateTransactionDocument = gql`
    mutation CreateTransaction($householdId: ID!, $input: CreateTransactionInput!) {
  createTransaction(householdId: $householdId, input: $input) {
    ...TransactionFields
  }
}
    ${TransactionFieldsFragmentDoc}`;
export type CreateTransactionMutationFn = Apollo.MutationFunction<CreateTransactionMutation, CreateTransactionMutationVariables>;

/**
 * __useCreateTransactionMutation__
 *
 * To run a mutation, you first call `useCreateTransactionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTransactionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTransactionMutation, { data, loading, error }] = useCreateTransactionMutation({
 *   variables: {
 *      householdId: // value for 'householdId'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateTransactionMutation(baseOptions?: Apollo.MutationHookOptions<CreateTransactionMutation, CreateTransactionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateTransactionMutation, CreateTransactionMutationVariables>(CreateTransactionDocument, options);
      }
export type CreateTransactionMutationHookResult = ReturnType<typeof useCreateTransactionMutation>;
export type CreateTransactionMutationResult = Apollo.MutationResult<CreateTransactionMutation>;
export type CreateTransactionMutationOptions = Apollo.BaseMutationOptions<CreateTransactionMutation, CreateTransactionMutationVariables>;
export const UpdateTransactionDocument = gql`
    mutation UpdateTransaction($householdId: ID!, $id: ID!, $input: UpdateTransactionInput!) {
  updateTransaction(householdId: $householdId, id: $id, input: $input) {
    ...TransactionFields
  }
}
    ${TransactionFieldsFragmentDoc}`;
export type UpdateTransactionMutationFn = Apollo.MutationFunction<UpdateTransactionMutation, UpdateTransactionMutationVariables>;

/**
 * __useUpdateTransactionMutation__
 *
 * To run a mutation, you first call `useUpdateTransactionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTransactionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTransactionMutation, { data, loading, error }] = useUpdateTransactionMutation({
 *   variables: {
 *      householdId: // value for 'householdId'
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateTransactionMutation(baseOptions?: Apollo.MutationHookOptions<UpdateTransactionMutation, UpdateTransactionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateTransactionMutation, UpdateTransactionMutationVariables>(UpdateTransactionDocument, options);
      }
export type UpdateTransactionMutationHookResult = ReturnType<typeof useUpdateTransactionMutation>;
export type UpdateTransactionMutationResult = Apollo.MutationResult<UpdateTransactionMutation>;
export type UpdateTransactionMutationOptions = Apollo.BaseMutationOptions<UpdateTransactionMutation, UpdateTransactionMutationVariables>;
export const DeleteTransactionDocument = gql`
    mutation DeleteTransaction($householdId: ID!, $id: ID!) {
  deleteTransaction(householdId: $householdId, id: $id)
}
    `;
export type DeleteTransactionMutationFn = Apollo.MutationFunction<DeleteTransactionMutation, DeleteTransactionMutationVariables>;

/**
 * __useDeleteTransactionMutation__
 *
 * To run a mutation, you first call `useDeleteTransactionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteTransactionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteTransactionMutation, { data, loading, error }] = useDeleteTransactionMutation({
 *   variables: {
 *      householdId: // value for 'householdId'
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteTransactionMutation(baseOptions?: Apollo.MutationHookOptions<DeleteTransactionMutation, DeleteTransactionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteTransactionMutation, DeleteTransactionMutationVariables>(DeleteTransactionDocument, options);
      }
export type DeleteTransactionMutationHookResult = ReturnType<typeof useDeleteTransactionMutation>;
export type DeleteTransactionMutationResult = Apollo.MutationResult<DeleteTransactionMutation>;
export type DeleteTransactionMutationOptions = Apollo.BaseMutationOptions<DeleteTransactionMutation, DeleteTransactionMutationVariables>;