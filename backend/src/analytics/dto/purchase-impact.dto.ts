import { IsNumber, IsUUID, IsNotEmpty, Min } from 'class-validator';

export class PurchaseImpactDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  amount: number;

  @IsUUID()
  @IsNotEmpty()
  accountId: string;
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
  dailyProjections: {
    date: string;
    balance: number;
    isPayday: boolean;
  }[];
}
