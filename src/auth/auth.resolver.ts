import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';

import { User } from '@/users/dto/entities/user.entity';

import { CurrentUser } from './decorators/current-user.decorator';
import { JWTAuthGuard } from './guard/jwt-auth.guard';
import { AuthResponse } from './types/auth-response.types';
import { AuthService } from './auth.service';

@Resolver(() => AuthResponse)
@UseGuards(JWTAuthGuard)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => AuthResponse, { name: 'revalidate' })
  revalidateToken(@CurrentUser() user: User): AuthResponse {
    return this.authService.revalidateToken(user);
  }
}
