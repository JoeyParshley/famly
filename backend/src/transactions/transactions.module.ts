import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { Transaction } from './entities/transaction.entity';
import { Account } from '../accounts/entities/account.entity';
import { HouseholdMember } from '../households/entities/household-member.entity';
import { TransactionsResolver } from './graphql/transactions.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, Account, HouseholdMember])],
  controllers: [TransactionsController],
  providers: [TransactionsService, TransactionsResolver],
  exports: [TransactionsService],
})
export class TransactionsModule {}
