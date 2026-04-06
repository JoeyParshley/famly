import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Household } from '../../households/entities/household.entity';

@Entity('budgets')
export class Budget {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Household, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'household_id' })
  household: Household;

  @Column()
  category: string;

  @Column('numeric', { precision: 12, scale: 2 })
  amount: number;

  @Column({ default: 'monthly' })
  period: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
