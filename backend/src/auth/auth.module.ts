import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';
import { User } from './entities/user.entity';
import { AuthResolver } from './graphql/auth.resolver';
import { DemoModule } from '../demo/demo.module';

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const expiresIn = configService.get<string>('JWT_EXPIRES_IN', '24h');
        return {
          secret: configService.get<string>('JWT_SECRET', 'secret123'),
          signOptions: {
            expiresIn: expiresIn as any,
          },
        };
      },
      inject: [ConfigService],
    }),
    forwardRef(() => DemoModule),
  ],
  providers: [AuthService, JwtStrategy, JwtAuthGuard, AuthResolver],
  controllers: [AuthController],
  exports: [JwtModule, AuthService, JwtAuthGuard],
})
export class AuthModule {}
