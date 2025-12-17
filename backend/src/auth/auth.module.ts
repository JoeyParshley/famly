import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
    imports: [
        PassportModule,
        JwtModule.register({
          secret: 'secret123',
          signOptions: { expiresIn: '24h' },
        }),
    ],
    providers: [],
    controllers: [],
    exports: [JwtModule],
})
export class AuthModule {}

// export the JwtModule so other modules can use  
