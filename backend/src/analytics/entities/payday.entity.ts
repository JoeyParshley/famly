import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Household } from '../../households/entities/household.entity';

@Entity('paydays')
export class Payday {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Household, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'household_id' })
  household: Household;

  @Column()
  name: string;

  @Column('numeric', { precision: 12, scale: 2 })
  amount: number;

  @Column()
  frequency: string;

  @Column({ name: 'next_date', type: 'date' })
  nextDate: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
