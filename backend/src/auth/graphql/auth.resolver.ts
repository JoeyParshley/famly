import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from '../auth.service';
import { DemoService } from '../../demo/demo.service';
import { User } from '../entities/user.entity';
import { UserModel } from './user.model';
import { AuthPayload } from './auth-payload.model';
import { RegisterInput, LoginInput, DemoLoginInput } from './auth.input';
import { GqlAuthGuard } from '../../graphql/guards/gql-auth.guard';
import { CurrentUser } from '../../graphql/decorators/current-user.decorator';
import { DemoUserModel } from '../../demo/graphql/demo-user.model';
import { HouseholdRole } from '../../graphql/enums';

@Resolver(() => UserModel)
export class AuthResolver {
  constructor(
    private authService: AuthService,
    private demoService: DemoService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  @Query(() => UserModel)
  @UseGuards(GqlAuthGuard)
  async me(@CurrentUser() user: { id: string }): Promise<UserModel> {
    const foundUser = await this.authService.validateUser(user.id);
    if (!foundUser) {
      throw new UnauthorizedException('User not found');
    }
    return {
      id: foundUser.id,
      email: foundUser.email,
      name: foundUser.name,
      createdAt: foundUser.createdAt,
      isDemo: foundUser.isDemo,
    };
  }

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
  async register(@Args('input') input: RegisterInput): Promise<AuthPayload> {
    const user = await this.authService.register(
      input.email,
      input.password,
      input.name,
    );
    const { access_token } = await this.authService.login(
      input.email,
      input.password,
    );
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

  @Mutation(() => AuthPayload)
  async login(@Args('input') input: LoginInput): Promise<AuthPayload> {
    const { access_token } = await this.authService.login(
      input.email,
      input.password,
    );
    const user = await this.userRepository.findOne({
      where: { email: input.email },
    });
    if (!user) {
      throw new UnauthorizedException('User not found');
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
