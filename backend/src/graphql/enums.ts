import { registerEnumType } from '@nestjs/graphql';

export enum HouseholdRole {
  VIEW = 'view',
  EDIT = 'edit',
  ADMIN = 'admin',
}

export enum PayoffStrategy {
  AVALANCHE = 'avalanche',
  SNOWBALL = 'snowball',
}

export enum BudgetPeriod {
  WEEKLY = 'weekly',
  BIWEEKLY = 'biweekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

export enum AccountType {
  CHECKING = 'checking',
  SAVINGS = 'savings',
  CREDIT = 'credit',
  INVESTMENT = 'investment',
  CASH = 'cash',
}

export enum DebtType {
  MORTGAGE = 'mortgage',
  AUTO_LOAN = 'auto_loan',
  STUDENT_LOAN = 'student_loan',
  CREDIT_CARD = 'credit_card',
  PERSONAL_LOAN = 'personal_loan',
  MEDICAL = 'medical',
  OTHER = 'other',
}

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
}

export enum PaydayFrequency {
  WEEKLY = 'weekly',
  BIWEEKLY = 'biweekly',
  MONTHLY = 'monthly',
}

registerEnumType(HouseholdRole, {
  name: 'HouseholdRole',
  description: 'The role of a member in a household',
});

registerEnumType(PayoffStrategy, {
  name: 'PayoffStrategy',
  description: 'Strategy for debt payoff calculation',
});

registerEnumType(BudgetPeriod, {
  name: 'BudgetPeriod',
  description: 'Time period for budget tracking',
});

registerEnumType(AccountType, {
  name: 'AccountType',
  description: 'Type of financial account',
});

registerEnumType(DebtType, {
  name: 'DebtType',
  description: 'Type of debt',
});

registerEnumType(Theme, {
  name: 'Theme',
  description: 'UI theme preference',
});

registerEnumType(PaydayFrequency, {
  name: 'PaydayFrequency',
  description: 'Frequency of payday',
});
