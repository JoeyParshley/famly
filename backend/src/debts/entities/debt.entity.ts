import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Household } from '../../households/entities/household.entity';

@Entity('debts')
export class Debt {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Household, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'household_id' })
  household: Household;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column('numeric', { precision: 12, scale: 2 })
  amount: number;

  @Column('numeric', { name: 'interest_rate', precision: 6, scale: 4, default: 0 })
  interestRate: number;

  @Column('numeric', { name: 'minimum_payment', precision: 12, scale: 2, default: 0 })
  minimumPayment: number;

  @Column({ name: 'payment_due_day', nullable: true })
  paymentDueDay: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
