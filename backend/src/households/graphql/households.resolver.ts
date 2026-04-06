import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { HouseholdsService } from '../households.service';
import { AccountsService } from '../../accounts/accounts.service';
import { HouseholdModel } from './household.model';
import { HouseholdMemberModel } from './household-member.model';
import {
  CreateHouseholdInput,
  UpdateHouseholdInput,
  AddMemberInput,
  UpdateMemberRoleInput,
  RemoveMemberInput,
} from './household.input';
import { GqlAuthGuard } from '../../graphql/guards/gql-auth.guard';
import { CurrentUser } from '../../graphql/decorators/current-user.decorator';
import { AccountModel } from '../../accounts/graphql/account.model';

@Resolver(() => HouseholdModel)
export class HouseholdsResolver {
  constructor(
    private householdsService: HouseholdsService,
    private accountsService: AccountsService,
  ) {}

  @Query(() => [HouseholdModel])
  @UseGuards(GqlAuthGuard)
  async households(
    @CurrentUser() user: { id: string },
  ): Promise<HouseholdModel[]> {
    const households = await this.householdsService.findAllForUser(user.id);
    return households.map((h) => ({
      id: h.id,
      name: h.name,
      createdAt: h.createdAt,
      members: h.members?.map((m) => ({
        id: m.id,
        user: {
          id: m.user.id,
          email: m.user.email,
          name: m.user.name,
          createdAt: m.user.createdAt,
          isDemo: m.user.isDemo,
        },
        role: m.role as any,
        createdAt: m.createdAt,
      })),
    }));
  }

  @Query(() => HouseholdModel)
  @UseGuards(GqlAuthGuard)
  async household(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: { id: string },
  ): Promise<HouseholdModel> {
    const h = await this.householdsService.findOne(id, user.id);
    return {
      id: h.id,
      name: h.name,
      createdAt: h.createdAt,
      members: h.members?.map((m) => ({
        id: m.id,
        user: {
          id: m.user.id,
          email: m.user.email,
          name: m.user.name,
          createdAt: m.user.createdAt,
          isDemo: m.user.isDemo,
        },
        role: m.role as any,
        createdAt: m.createdAt,
      })),
    };
  }

  @ResolveField(() => [AccountModel])
  async accounts(@Parent() household: HouseholdModel): Promise<AccountModel[]> {
    const accounts = await this.accountsService.findAll(household.id);
    return accounts.map((a) => ({
      id: a.id,
      householdId: household.id,
      name: a.name,
      type: a.type as any,
      balance: Number(a.balance),
      interestRate: a.interestRate != null ? Number(a.interestRate) : undefined,
      institution: a.institution,
      createdAt: a.createdAt,
    }));
  }

  @Mutation(() => HouseholdModel)
  @UseGuards(GqlAuthGuard)
  async createHousehold(
    @Args('input') input: CreateHouseholdInput,
    @CurrentUser() user: { id: string },
  ): Promise<HouseholdModel> {
    const h = await this.householdsService.create(input, user.id);
    return {
      id: h.id,
      name: h.name,
      createdAt: h.createdAt,
      members: h.members?.map((m) => ({
        id: m.id,
        user: {
          id: m.user.id,
          email: m.user.email,
          name: m.user.name,
          createdAt: m.user.createdAt,
          isDemo: m.user.isDemo,
        },
        role: m.role as any,
        createdAt: m.createdAt,
      })),
    };
  }

  @Mutation(() => HouseholdModel)
  @UseGuards(GqlAuthGuard)
  async updateHousehold(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateHouseholdInput,
  ): Promise<HouseholdModel> {
    const h = await this.householdsService.update(id, input);
    return {
      id: h.id,
      name: h.name,
      createdAt: h.createdAt,
      members: h.members?.map((m) => ({
        id: m.id,
        user: {
          id: m.user.id,
          email: m.user.email,
          name: m.user.name,
          createdAt: m.user.createdAt,
          isDemo: m.user.isDemo,
        },
        role: m.role as any,
        createdAt: m.createdAt,
      })),
    };
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deleteHousehold(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    await this.householdsService.remove(id);
    return true;
  }

  @Mutation(() => HouseholdMemberModel)
  @UseGuards(GqlAuthGuard)
  async addMember(
    @Args('input') input: AddMemberInput,
  ): Promise<HouseholdMemberModel> {
    const member = await this.householdsService.addMember(input.householdId, {
      email: input.email,
      role: input.role as any,
    });
    return {
      id: member.id,
      user: {
        id: member.user.id,
        email: member.user.email,
        name: member.user.name,
        createdAt: member.user.createdAt,
        isDemo: member.user.isDemo,
      },
      role: member.role as any,
      createdAt: member.createdAt,
    };
  }

  @Mutation(() => HouseholdMemberModel)
  @UseGuards(GqlAuthGuard)
  async updateMemberRole(
    @Args('input') input: UpdateMemberRoleInput,
    @CurrentUser() user: { id: string },
  ): Promise<HouseholdMemberModel> {
    const member = await this.householdsService.updateMemberRole(
      input.householdId,
      input.memberId,
      { role: input.role as any },
      user.id,
    );
    return {
      id: member.id,
      user: {
        id: member.user.id,
        email: member.user.email,
        name: member.user.name,
        createdAt: member.user.createdAt,
        isDemo: member.user.isDemo,
      },
      role: member.role as any,
      createdAt: member.createdAt,
    };
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async removeMember(
    @Args('input') input: RemoveMemberInput,
    @CurrentUser() user: { id: string },
  ): Promise<boolean> {
    await this.householdsService.removeMember(
      input.householdId,
      input.memberId,
      user.id,
    );
    return true;
  }
}
