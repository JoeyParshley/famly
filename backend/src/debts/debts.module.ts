import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DebtsService } from './debts.service';
import { DebtsController } from './debts.controller';
import { Debt } from './entities/debt.entity';
import { Household } from '../households/entities/household.entity';
import { HouseholdMember } from '../households/entities/household-member.entity';
import { DebtCalculatorService } from './services/debt-calculator.service';
import { DebtsResolver } from './graphql/debts.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Debt, Household, HouseholdMember])],
  controllers: [DebtsController],
  providers: [DebtsService, DebtCalculatorService, DebtsResolver],
  exports: [DebtsService, DebtCalculatorService],
})
export class DebtsModule {}
