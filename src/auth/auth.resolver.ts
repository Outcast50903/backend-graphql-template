import { UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';

import { User } from '@/users/dto/entities/user.entity';

import { CurrentUser } from './decorators/current-user.decorator';
import { AuthResponse } from './types/auth-response.types';
import { AuthService } from './auth.service';
import { JWTAuthGuard } from './guard';

@Resolver(() => AuthResponse)
@UseGuards(JWTAuthGuard)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => AuthResponse, { name: 'revalidate' })
  revalidateToken(
    @Args('refreshToken') refreshToken: string,
    @CurrentUser() user: User,
  ): Promise<AuthResponse> {
    return this.authService.revalidateToken(user, refreshToken);
  }
}
