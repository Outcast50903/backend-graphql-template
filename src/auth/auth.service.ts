import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

import { PrismaService } from '@/prisma';
import { User } from '@/users/dto/entities/user.entity';
import { UsersService } from '@/users/users.service';

import { AuthResponse } from './types/auth-response.types';
import { SignInInput, SingUpInput } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}

  async signup(singUpInput: SingUpInput): Promise<AuthResponse> {
    const user = await this.usersService.create(singUpInput);

    const token = this.getJwtToken(user.id);
    const refresh_token = this.generateRefreshToken();

    await this.createUserSession(token, refresh_token);

    return {
      token,
      refresh_token,
    };
  }

  async singIn({ email, password }: SignInInput): Promise<AuthResponse> {
    const user = await this.usersService.findOne(email);

    if (!bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.getJwtToken(user.id);
    const refresh_token = this.generateRefreshToken();

    await this.updateUserSession(token, refresh_token);

    return {
      token,
      refresh_token,
    };
  }

  async revalidateToken(
    user: User,
    refreshToken: string,
  ): Promise<AuthResponse> {
    const account = await this.prismaService.accounts.findUniqueOrThrow({
      where: {
        userId: user.id,
        refresh_token: refreshToken,
        isEnabled: true,
      },
    });

    if (account.expires_at <= new Date().getTime()) {
      this.prismaService.accounts.update({
        data: {
          isEnabled: false,
          refresh_token: null,
          id_token: null,
          expires_at: null,
        },
        where: { id: account.id },
      });

      this.prismaService.session.delete({
        where: { userId: user.id },
      });
    }

    const token = this.getJwtToken(user.id);
    const refresh_token = this.generateRefreshToken();

    await this.updateUserSession(token, refresh_token);

    return {
      token,
      refresh_token,
    };
  }

  async validateUser(id: string): Promise<User> {
    const user = await this.usersService.findOne(id);
    if (!user.isEnabled) {
      throw new UnauthorizedException('User is not enabled');
    }

    return user;
  }

  private async createUserSession(
    token: string,
    refreshToken: string,
  ): Promise<void> {
    const decode = this.jwtService.decode(token) as { exp: number; id: string };

    const [account, session] = await this.prismaService.$transaction([
      this.prismaService.accounts.create({
        data: {
          provider: 'local',
          userId: decode.id,
          providerAccountId: process.env.LOCAL_PROVIDER,
          type: 'manually',
          createdAt: new Date(),
          refresh_token: refreshToken,
          id_token: token,
          expires_at: decode.exp + 60 * 60 * 24 * 7,
          token_type: 'Bearer',
          isEnabled: true,
        },
      }),
      this.prismaService.session.create({
        data: {
          sessionToken: token,
          userId: decode.id,
          expires: new Date(decode.exp),
        },
      }),
    ]);

    if (!session || !account) {
      this.prismaService.user.delete({ where: { id: decode.id } });
      throw new UnauthorizedException('Error creating account');
    }
  }

  private async updateUserSession(
    token: string,
    refreshToken: string,
  ): Promise<void> {
    const decode = this.jwtService.decode(token) as { exp: number; id: string };

    const [account, session] = await this.prismaService.$transaction([
      this.prismaService.accounts.update({
        data: {
          updatedAt: new Date(),
          refresh_token: refreshToken,
          id_token: token,
          expires_at: decode.exp + 60 * 60 * 24 * 7,
        },
        where: {
          userId: decode.id,
        },
      }),
      this.prismaService.session.update({
        data: {
          sessionToken: token,
          expires: new Date(decode.exp),
        },
        where: {
          userId: decode.id,
        },
      }),
    ]);

    if (!session || !account) {
      throw new UnauthorizedException('Error to generate new token');
    }
  }

  private getJwtToken(id: string): string {
    return this.jwtService.sign({ id });
  }

  private generateRefreshToken(): string {
    return bcrypt.hashSync(Math.random().toString(36).substring(2), 10);
  }
}
