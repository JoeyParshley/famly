import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UnauthorizedException } from '@nestjs/common';
import { DemoService } from '../demo.service';
import { DemoUserModel } from './demo-user.model';
import { AuthPayload } from '../../auth/graphql/auth-payload.model';
import { DemoLoginInput } from '../../auth/graphql/auth.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { HouseholdRole } from '../../graphql/enums';

@Resolver(() => DemoUserModel)
export class DemoResolver {
  constructor(
    private demoService: DemoService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  @Query(() => [DemoUserModel])
  demoUsers(): DemoUserModel[] {
    const users = this.demoService.getDemoUsers();
    return users.map((u) => ({
      email: u.email,
      name: u.name,
      role: u.role as HouseholdRole,
      description: u.description,
    }));
  }

  @Mutation(() => AuthPayload)
  async demoLogin(@Args('input') input: DemoLoginInput): Promise<AuthPayload> {
    const { access_token } = await this.demoService.demoLogin({
      email: input.email,
    });
    const user = await this.userRepository.findOne({
      where: { email: input.email },
    });
    if (!user) {
      throw new UnauthorizedException('Demo user not found');
    }
    return {
      accessToken: access_token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
        isDemo: user.isDemo,
      },
    };
  }
}
