import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';

import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { ValidRoles } from '@/auth/enums/valid-roles.enum';
import { JWTAuthGuard } from '@/auth/guard/jwt-auth.guard';
import { PaginationArgs } from '@/prisma/paginated/dto';

import { ValidRolesArgs } from './dto/args/valid-roles.args';
import { User } from './dto/entities/user.entity';
import { PaginatedUsers } from './dto/inputs/paginated-user.inputs';
import { UpdateUserInput } from './dto/inputs/update-user.input';
import { UsersService } from './users.service';

@Resolver(() => User)
@UseGuards(JWTAuthGuard)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => PaginatedUsers, { name: 'users' })
  findAll(@Args() pagination: PaginationArgs): Promise<PaginatedUsers> {
    return this.usersService.findAll(pagination);
  }

  @Query(() => User, { name: 'user' })
  findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
  ): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Mutation(() => User, { name: 'updateUser' })
  updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @CurrentUser([ValidRoles.ADMIN]) user: User,
  ): Promise<User> {
    return this.usersService.update(updateUserInput, user);
  }

  @Mutation(() => User, { name: 'blockUser' })
  blockUser(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser([ValidRoles.ADMIN]) user: User,
  ): Promise<User> {
    return this.usersService.block(id, user);
  }
}
