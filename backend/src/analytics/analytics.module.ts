import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { Transaction } from '../transactions/entities/transaction.entity';
import { Account } from '../accounts/entities/account.entity';
import { Payday } from './entities/payday.entity';
import { Household } from '../households/entities/household.entity';
import { HouseholdMember } from '../households/entities/household-member.entity';
import { AnalyticsResolver } from './graphql/analytics.resolver';
import { PreferencesModule } from '../preferences/preferences.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Transaction,
      Account,
      Payday,
      Household,
      HouseholdMember,
    ]),
    PreferencesModule,
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService, AnalyticsResolver],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
