import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService: JwtService,
    ) {}

    async register(email: string, password: string, name: string): Promise<User> {
        // Check if user already exists
        const existingUser = await this.userRepository.findOne({
            where: { email },
        });

        if (existingUser) {
            throw new ConflictException('User with this email already exists');
        }

        // Hash password
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Create and save user
        const user = this.userRepository.create({
            email,
            passwordHash: passwordHash,
            name,
        });

        return await this.userRepository.save(user);
    }

    async login(email: string, password: string): Promise<{ access_token: string }> {
        // Find user by email
        const user = await this.userRepository.findOne({
            where: { email },
        });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Validate password
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Generate JWT token
        const payload = { sub: user.id, email: user.email };
        const access_token = await this.jwtService.signAsync(payload);

        return { access_token };
    }

    async validateUser(userId: string): Promise<User | null> {
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });

        if (!user) {
            return null;
        }

        return user;
    }
}
