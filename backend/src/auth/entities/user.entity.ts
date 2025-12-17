import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text', unique: true })
    email: string;

    @Column({ type: 'text' })
    name: string;

    @Column({ type: 'text', name: 'password_hash' })
    @Exclude()
    passwordHash: string;

    @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
    createdAt: Date;
}
