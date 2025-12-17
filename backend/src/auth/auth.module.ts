import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
    imports: [
        PassportModule,
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
    ],
    providers: [],
    controllers: [],
    exports: [JwtModule],
})
export class AuthModule {}

// export the JwtModule so other modules can use  
