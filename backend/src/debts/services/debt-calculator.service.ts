import { Injectable } from '@nestjs/common';
import { Debt } from '../entities/debt.entity';
import { PayoffStrategy } from '../dto/payoff-request.dto';

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

interface DebtState {
  id: string;
  name: string;
  balance: number;
  interestRate: number;
  minimumPayment: number;
  originalBalance: number;
  totalPaid: number;
  totalInterest: number;
  monthsToPayoff: number;
  paidOff: boolean;
}

@Injectable()
export class DebtCalculatorService {
  calculatePayoffScenario(
    debts: Debt[],
    extraMonthlyPayment: number = 0,
    strategy: PayoffStrategy = PayoffStrategy.AVALANCHE,
  ): PayoffScenario {
    if (debts.length === 0) {
      return {
        strategy,
        extraMonthlyPayment,
        totalMonths: 0,
        totalPaid: 0,
        totalInterest: 0,
        debtFreeDate: new Date().toISOString().split('T')[0],
        debtResults: [],
        monthlySchedule: [],
      };
    }

    // Initialize debt states
    const debtStates: DebtState[] = debts.map((debt) => ({
      id: debt.id,
      name: debt.name,
      balance: Number(debt.amount),
      interestRate: Number(debt.interestRate) / 100 / 12, // Monthly rate
      minimumPayment: Number(debt.minimumPayment),
      originalBalance: Number(debt.amount),
      totalPaid: 0,
      totalInterest: 0,
      monthsToPayoff: 0,
      paidOff: false,
    }));

    const monthlySchedule: MonthlyPayment[] = [];
    let month = 0;
    const maxMonths = 600; // 50 years max to prevent infinite loops

    while (
      debtStates.some((d) => !d.paidOff) &&
      month < maxMonths
    ) {
      month++;
      const currentDate = new Date();
      currentDate.setMonth(currentDate.getMonth() + month);
      const dateStr = currentDate.toISOString().split('T')[0];

      // Calculate total minimum payments for active debts
      const totalMinPayments = debtStates
        .filter((d) => !d.paidOff)
        .reduce((sum, d) => sum + d.minimumPayment, 0);

      // Available extra payment this month
      let availableExtra = extraMonthlyPayment;

      // Add freed-up minimum payments from paid-off debts
      const paidOffMinPayments = debtStates
        .filter((d) => d.paidOff)
        .reduce((sum, d) => sum + d.minimumPayment, 0);
      availableExtra += paidOffMinPayments;

      // Sort active debts by strategy
      const activeDebts = debtStates.filter((d) => !d.paidOff);
      if (strategy === PayoffStrategy.AVALANCHE) {
        // Highest interest rate first
        activeDebts.sort((a, b) => b.interestRate - a.interestRate);
      } else {
        // Snowball: Lowest balance first
        activeDebts.sort((a, b) => a.balance - b.balance);
      }

      // Process each active debt
      for (const debt of activeDebts) {
        if (debt.paidOff) continue;

        // Calculate monthly interest
        const monthlyInterest = debt.balance * debt.interestRate;
        debt.totalInterest += monthlyInterest;
        debt.balance += monthlyInterest;

        // Determine payment amount
        let payment = debt.minimumPayment;

        // Apply extra payment to the priority debt
        if (debt === activeDebts[0] && availableExtra > 0) {
          payment += availableExtra;
          availableExtra = 0;
        }

        // Don't overpay
        if (payment > debt.balance) {
          payment = debt.balance;
        }

        // Calculate principal
        const principal = payment - monthlyInterest;

        // Apply payment
        debt.balance -= payment;
        debt.totalPaid += payment;

        // Record payment
        monthlySchedule.push({
          month,
          date: dateStr,
          debtId: debt.id,
          debtName: debt.name,
          payment: Math.round(payment * 100) / 100,
          principal: Math.round(principal * 100) / 100,
          interest: Math.round(monthlyInterest * 100) / 100,
          remainingBalance: Math.max(0, Math.round(debt.balance * 100) / 100),
        });

        // Check if paid off
        if (debt.balance <= 0.01) {
          debt.paidOff = true;
          debt.monthsToPayoff = month;
          debt.balance = 0;
        }
      }
    }

    // Build results
    const debtResults: DebtPayoffResult[] = debtStates.map((d) => {
      const payoffDate = new Date();
      payoffDate.setMonth(payoffDate.getMonth() + d.monthsToPayoff);

      return {
        debtId: d.id,
        debtName: d.name,
        originalBalance: Math.round(d.originalBalance * 100) / 100,
        totalPaid: Math.round(d.totalPaid * 100) / 100,
        totalInterest: Math.round(d.totalInterest * 100) / 100,
        monthsToPayoff: d.monthsToPayoff,
        payoffDate: payoffDate.toISOString().split('T')[0],
      };
    });

    const totalPaid = debtStates.reduce((sum, d) => sum + d.totalPaid, 0);
    const totalInterest = debtStates.reduce((sum, d) => sum + d.totalInterest, 0);
    const maxPayoffMonth = Math.max(...debtStates.map((d) => d.monthsToPayoff));

    const debtFreeDate = new Date();
    debtFreeDate.setMonth(debtFreeDate.getMonth() + maxPayoffMonth);

    return {
      strategy,
      extraMonthlyPayment,
      totalMonths: maxPayoffMonth,
      totalPaid: Math.round(totalPaid * 100) / 100,
      totalInterest: Math.round(totalInterest * 100) / 100,
      debtFreeDate: debtFreeDate.toISOString().split('T')[0],
      debtResults,
      monthlySchedule,
    };
  }

  compareStrategies(
    debts: Debt[],
    extraMonthlyPayment: number = 0,
  ): {
    avalanche: PayoffScenario;
    snowball: PayoffScenario;
    savings: {
      interestSaved: number;
      monthsSaved: number;
      recommendedStrategy: PayoffStrategy;
    };
  } {
    const avalanche = this.calculatePayoffScenario(
      debts,
      extraMonthlyPayment,
      PayoffStrategy.AVALANCHE,
    );

    const snowball = this.calculatePayoffScenario(
      debts,
      extraMonthlyPayment,
      PayoffStrategy.SNOWBALL,
    );

    const interestSaved = snowball.totalInterest - avalanche.totalInterest;
    const monthsSaved = snowball.totalMonths - avalanche.totalMonths;

    return {
      avalanche,
      snowball,
      savings: {
        interestSaved: Math.round(interestSaved * 100) / 100,
        monthsSaved,
        recommendedStrategy:
          interestSaved > 0 ? PayoffStrategy.AVALANCHE : PayoffStrategy.SNOWBALL,
      },
    };
  }

  calculateMinimumPaymentTotal(debts: Debt[]): number {
    return debts.reduce((sum, d) => sum + Number(d.minimumPayment), 0);
  }

  getTotalDebt(debts: Debt[]): number {
    return debts.reduce((sum, d) => sum + Number(d.amount), 0);
  }
}
