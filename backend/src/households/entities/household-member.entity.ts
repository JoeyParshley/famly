import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Household } from './household.entity';
import { User } from '../../auth/entities/user.entity';
import { HouseholdRole } from '../../common/enums/role.enum';

@Entity('household_members')
@Unique(['household', 'user'])
export class HouseholdMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Household, (household) => household.members, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'household_id' })
  household: Household;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ default: HouseholdRole.VIEW })
  role: HouseholdRole;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
