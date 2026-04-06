import { Resolver, Query, Mutation, Args, ID, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { TransactionsService } from '../transactions.service';
import { TransactionModel, TransactionCategory } from './transaction.model';
import { TransactionConnection } from './transaction-connection.model';
import {
  CreateTransactionInput,
  UpdateTransactionInput,
  TransactionFilterInput,
} from './transaction.input';
import { GqlAuthGuard } from '../../graphql/guards/gql-auth.guard';

@Resolver(() => TransactionModel)
export class TransactionsResolver {
  constructor(private transactionsService: TransactionsService) {}

  @Query(() => TransactionConnection)
  @UseGuards(GqlAuthGuard)
  async transactions(
    @Args('filter') filter: TransactionFilterInput,
  ): Promise<TransactionConnection> {
    const { transactions, total } = await this.transactionsService.findAll(
      filter.householdId,
      {
        accountId: filter.accountId,
        category: filter.category,
        startDate: filter.startDate,
        endDate: filter.endDate,
        limit: filter.limit || 50,
        offset: filter.offset || 0,
      },
    );

    return {
      items: transactions.map((t) => ({
        id: t.id,
        accountId: t.account?.id,
        amount: Number(t.amount),
        category: t.category,
        description: t.description,
        occurredOn: t.occurredOn,
        createdAt: t.createdAt,
      })),
      total,
      limit: filter.limit || 50,
      offset: filter.offset || 0,
      hasMore: (filter.offset || 0) + (filter.limit || 50) < total,
    };
  }

  @Query(() => TransactionModel)
  @UseGuards(GqlAuthGuard)
  async transaction(
    @Args('householdId', { type: () => ID }) householdId: string,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<TransactionModel> {
    const t = await this.transactionsService.findOne(householdId, id);
    return {
      id: t.id,
      accountId: t.account?.id,
      amount: Number(t.amount),
      category: t.category,
      description: t.description,
      occurredOn: t.occurredOn,
      createdAt: t.createdAt,
    };
  }

  @Query(() => [String])
  @UseGuards(GqlAuthGuard)
  async transactionCategories(
    @Args('householdId', { type: () => ID }) householdId: string,
  ): Promise<string[]> {
    return this.transactionsService.getCategories(householdId);
  }

  @Query(() => [TransactionModel])
  @UseGuards(GqlAuthGuard)
  async recentTransactions(
    @Args('householdId', { type: () => ID }) householdId: string,
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 10 })
    limit: number,
  ): Promise<TransactionModel[]> {
    const transactions = await this.transactionsService.getRecentTransactions(
      householdId,
      limit,
    );
    return transactions.map((t) => ({
      id: t.id,
      accountId: t.account?.id,
      amount: Number(t.amount),
      category: t.category,
      description: t.description,
      occurredOn: t.occurredOn,
      createdAt: t.createdAt,
    }));
  }

  @Mutation(() => TransactionModel)
  @UseGuards(GqlAuthGuard)
  async createTransaction(
    @Args('householdId', { type: () => ID }) householdId: string,
    @Args('input') input: CreateTransactionInput,
  ): Promise<TransactionModel> {
    const t = await this.transactionsService.create(householdId, {
      accountId: input.accountId,
      amount: input.amount,
      category: input.category,
      description: input.description,
      occurredOn: input.occurredOn,
    });
    return {
      id: t.id,
      accountId: t.account?.id,
      amount: Number(t.amount),
      category: t.category,
      description: t.description,
      occurredOn: t.occurredOn,
      createdAt: t.createdAt,
    };
  }

  @Mutation(() => TransactionModel)
  @UseGuards(GqlAuthGuard)
  async updateTransaction(
    @Args('householdId', { type: () => ID }) householdId: string,
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateTransactionInput,
  ): Promise<TransactionModel> {
    const t = await this.transactionsService.update(householdId, id, {
      accountId: input.accountId,
      amount: input.amount,
      category: input.category,
      description: input.description,
      occurredOn: input.occurredOn,
    });
    return {
      id: t.id,
      accountId: t.account?.id,
      amount: Number(t.amount),
      category: t.category,
      description: t.description,
      occurredOn: t.occurredOn,
      createdAt: t.createdAt,
    };
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deleteTransaction(
    @Args('householdId', { type: () => ID }) householdId: string,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    await this.transactionsService.remove(householdId, id);
    return true;
  }
}
