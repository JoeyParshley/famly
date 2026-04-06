import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HouseholdsService } from './households.service';
import { HouseholdsController } from './households.controller';
import { Household } from './entities/household.entity';
import { HouseholdMember } from './entities/household-member.entity';
import { User } from '../auth/entities/user.entity';
import { HouseholdsResolver } from './graphql/households.resolver';
import { AccountsModule } from '../accounts/accounts.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Household, HouseholdMember, User]),
    forwardRef(() => AccountsModule),
  ],
  controllers: [HouseholdsController],
  providers: [HouseholdsService, HouseholdsResolver],
  exports: [HouseholdsService, TypeOrmModule],
})
export class HouseholdsModule {}
