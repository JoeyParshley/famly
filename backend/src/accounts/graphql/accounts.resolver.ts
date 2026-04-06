import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AccountsService } from '../accounts.service';
import { AccountModel, AccountsSummary } from './account.model';
import { CreateAccountInput, UpdateAccountInput } from './account.input';
import { GqlAuthGuard } from '../../graphql/guards/gql-auth.guard';

@Resolver(() => AccountModel)
export class AccountsResolver {
  constructor(private accountsService: AccountsService) {}

  @Query(() => [AccountModel])
  @UseGuards(GqlAuthGuard)
  async accounts(
    @Args('householdId', { type: () => ID }) householdId: string,
  ): Promise<AccountModel[]> {
    const accounts = await this.accountsService.findAll(householdId);
    return accounts.map((a) => ({
      id: a.id,
      householdId: householdId,
      name: a.name,
      type: a.type as any,
      balance: Number(a.balance),
      interestRate: a.interestRate != null ? Number(a.interestRate) : undefined,
      institution: a.institution,
      createdAt: a.createdAt,
    }));
  }

  @Query(() => AccountModel)
  @UseGuards(GqlAuthGuard)
  async account(
    @Args('householdId', { type: () => ID }) householdId: string,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<AccountModel> {
    const a = await this.accountsService.findOne(householdId, id);
    return {
      id: a.id,
      householdId: householdId,
      name: a.name,
      type: a.type as any,
      balance: Number(a.balance),
      interestRate: a.interestRate != null ? Number(a.interestRate) : undefined,
      institution: a.institution,
      createdAt: a.createdAt,
    };
  }

  @Query(() => AccountsSummary)
  @UseGuards(GqlAuthGuard)
  async accountsSummary(
    @Args('householdId', { type: () => ID }) householdId: string,
  ): Promise<AccountsSummary> {
    const netWorthData = await this.accountsService.getNetWorth(householdId);
    const totalBalance = await this.accountsService.getTotalBalance(householdId);
    return {
      totalBalance,
      totalAssets: netWorthData.assets,
      totalLiabilities: netWorthData.liabilities,
      netWorth: netWorthData.netWorth,
    };
  }

  @Mutation(() => AccountModel)
  @UseGuards(GqlAuthGuard)
  async createAccount(
    @Args('input') input: CreateAccountInput,
  ): Promise<AccountModel> {
    const a = await this.accountsService.create(input.householdId, {
      name: input.name,
      type: input.type as any,
      balance: input.balance,
      interestRate: input.interestRate,
      institution: input.institution,
    });
    return {
      id: a.id,
      householdId: input.householdId,
      name: a.name,
      type: a.type as any,
      balance: Number(a.balance),
      interestRate: a.interestRate != null ? Number(a.interestRate) : undefined,
      institution: a.institution,
      createdAt: a.createdAt,
    };
  }

  @Mutation(() => AccountModel)
  @UseGuards(GqlAuthGuard)
  async updateAccount(
    @Args('householdId', { type: () => ID }) householdId: string,
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateAccountInput,
  ): Promise<AccountModel> {
    const a = await this.accountsService.update(householdId, id, input as any);
    return {
      id: a.id,
      householdId: householdId,
      name: a.name,
      type: a.type as any,
      balance: Number(a.balance),
      interestRate: a.interestRate != null ? Number(a.interestRate) : undefined,
      institution: a.institution,
      createdAt: a.createdAt,
    };
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deleteAccount(
    @Args('householdId', { type: () => ID }) householdId: string,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    await this.accountsService.remove(householdId, id);
    return true;
  }
}
