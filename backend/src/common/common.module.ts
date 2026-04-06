import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesGuard } from './guards/roles.guard';
import { HouseholdMember } from '../households/entities/household-member.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([HouseholdMember])],
  providers: [RolesGuard],
  exports: [RolesGuard, TypeOrmModule],
})
export class CommonModule {}
