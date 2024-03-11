import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { PrismaModule } from '@/prisma';
import { UsersModule } from '@/users/users.module';

import { JWTStrategy } from './strategies/jwt.strategy';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  providers: [AuthResolver, AuthService, JWTStrategy],
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        verifyOptions: { algorithms: ['ES256'] },
        secret: configService.getOrThrow('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
    PrismaModule,
    ConfigModule,
    forwardRef(() => UsersModule),
  ],
  exports: [AuthService, JWTStrategy, JwtModule, PassportModule],
  controllers: [AuthController],
})
export class AuthModule {}