import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { PreferencesService } from '../preferences.service';
import { UserPreferenceModel } from './user-preference.model';
import { UpdatePreferencesInput } from './preferences.input';
import { GqlAuthGuard } from '../../graphql/guards/gql-auth.guard';
import { CurrentUser } from '../../graphql/decorators/current-user.decorator';

@Resolver(() => UserPreferenceModel)
export class PreferencesResolver {
  constructor(private preferencesService: PreferencesService) {}

  @Query(() => UserPreferenceModel)
  @UseGuards(GqlAuthGuard)
  async preferences(
    @CurrentUser() user: { id: string },
  ): Promise<UserPreferenceModel> {
    const prefs = await this.preferencesService.getPreferences(user.id);
    return {
      id: prefs.id,
      userId: user.id,
      theme: prefs.theme as any,
      balanceAlertThreshold: Number(prefs.balanceAlertThreshold),
      createdAt: prefs.createdAt,
      updatedAt: prefs.updatedAt,
    };
  }

  @Mutation(() => UserPreferenceModel)
  @UseGuards(GqlAuthGuard)
  async updatePreferences(
    @Args('input') input: UpdatePreferencesInput,
    @CurrentUser() user: { id: string },
  ): Promise<UserPreferenceModel> {
    const prefs = await this.preferencesService.updatePreferences(user.id, {
      theme: input.theme as any,
      balanceAlertThreshold: input.balanceAlertThreshold,
    });
    return {
      id: prefs.id,
      userId: user.id,
      theme: prefs.theme as any,
      balanceAlertThreshold: Number(prefs.balanceAlertThreshold),
      createdAt: prefs.createdAt,
      updatedAt: prefs.updatedAt,
    };
  }
}
