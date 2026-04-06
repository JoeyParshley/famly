import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Household } from '../../households/entities/household.entity';

@Entity('accounts')
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Household, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'household_id' })
  household: Household;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column('numeric', { precision: 12, scale: 2, default: 0 })
  balance: number;

  @Column('numeric', { name: 'interest_rate', precision: 6, scale: 4, default: 0 })
  interestRate: number;

  @Column({ nullable: true })
  institution: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
