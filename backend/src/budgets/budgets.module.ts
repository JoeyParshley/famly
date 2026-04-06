import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BudgetsService } from './budgets.service';
import { BudgetsController } from './budgets.controller';
import { Budget } from './entities/budget.entity';
import { Household } from '../households/entities/household.entity';
import { Transaction } from '../transactions/entities/transaction.entity';
import { HouseholdMember } from '../households/entities/household-member.entity';
import { BudgetsResolver } from './graphql/budgets.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([Budget, Household, Transaction, HouseholdMember]),
  ],
  controllers: [BudgetsController],
  providers: [BudgetsService, BudgetsResolver],
  exports: [BudgetsService],
})
export class BudgetsModule {}
