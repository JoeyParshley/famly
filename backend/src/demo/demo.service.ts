import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../auth/entities/user.entity';
import { DemoLoginDto } from './dto/demo-login.dto';

export interface DemoUser {
  id: string;
  email: string;
  name: string;
  role: string;
  description: string;
}

@Injectable()
export class DemoService {
  private readonly demoUsers: DemoUser[] = [
    {
      id: 'd0000001-0000-0000-0000-000000000001',
      email: 'peter@famly-demo.com',
      name: 'Peter Griffin',
      role: 'admin',
      description: 'Family patriarch with full access to manage everything',
    },
    {
      id: 'd0000001-0000-0000-0000-000000000002',
      email: 'lois@famly-demo.com',
      name: 'Lois Griffin',
      role: 'admin',
      description: 'Co-admin with full household management access',
    },
    {
      id: 'd0000001-0000-0000-0000-000000000003',
      email: 'chris@famly-demo.com',
      name: 'Chris Griffin',
      role: 'edit',
      description: 'Can view and edit transactions and accounts',
    },
    {
      id: 'd0000001-0000-0000-0000-000000000004',
      email: 'meg@famly-demo.com',
      name: 'Meg Griffin',
      role: 'view',
      description: 'View-only access to household finances',
    },
    {
      id: 'd0000001-0000-0000-0000-000000000005',
      email: 'stewie@famly-demo.com',
      name: 'Stewie Griffin',
      role: 'view',
      description: 'View-only access (world domination requires no budget)',
    },
    {
      id: 'd0000001-0000-0000-0000-000000000006',
      email: 'brian@famly-demo.com',
      name: 'Brian Griffin',
      role: 'edit',
      description: 'Can edit household finances (needs to track martini budget)',
    },
  ];

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  getDemoUsers(): DemoUser[] {
    return this.demoUsers;
  }

  async demoLogin(dto: DemoLoginDto): Promise<{ access_token: string }> {
    // Verify this is a demo user email
    const demoUser = this.demoUsers.find((u) => u.email === dto.email);
    if (!demoUser) {
      throw new UnauthorizedException('Invalid demo user email');
    }

    // Find the user in the database
    const user = await this.userRepository.findOne({
      where: { email: dto.email, isDemo: true },
    });

    if (!user) {
      throw new NotFoundException(
        'Demo user not found. Please run database migrations.',
      );
    }

    // Generate JWT token
    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload);

    return { access_token: token };
  }
}
