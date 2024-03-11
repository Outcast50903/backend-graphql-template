import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { User } from '@/users/dto/entities/user.entity';
import { UsersService } from '@/users/users.service';

import { AuthResponse } from './types/auth-response.types';
import { SignInInput, SingUpInput } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(singUpInput: SingUpInput): Promise<AuthResponse> {
    const user = await this.usersService.create(singUpInput);

    return {
      token: this.getJwtToken(user.id),
    };
  }

  async singIn({ email, password }: SignInInput): Promise<AuthResponse> {
    const user = await this.usersService.findOne(email);

    if (!bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      token: this.getJwtToken(user.id),
    };
  }

  revalidateToken(user: User): AuthResponse {
    return {
      token: this.getJwtToken(user.id),
    };
  }

  async validateUser(id: string): Promise<User> {
    const user = await this.usersService.findOne(id);
    if (!user.isEnabled) {
      throw new UnauthorizedException('User is not enabled');
    }

    return user;
  }

  private getJwtToken(id: string): string {
    return this.jwtService.sign({ id });
  }
}
