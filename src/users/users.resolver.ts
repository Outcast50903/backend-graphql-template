import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';

import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { ValidRoles } from '@/auth/enums';
import { JWTAuthGuard } from '@/auth/guard';
import { Auth } from '@/common/decorators';
import { DefaultActions } from '@/common/enums';
import { PaginationArgs } from '@/prisma/paginated/dto';

import { User } from './dto/entities/user.entity';
import { PaginatedUsers } from './dto/inputs/paginated-user.inputs';
import { UpdateUserInput } from './dto/inputs/update-user.input';
import { UsersService } from './users.service';

@Resolver(() => User)
@UseGuards(JWTAuthGuard)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Auth('User', DefaultActions.readMany)
  @Query(() => PaginatedUsers, { name: 'users' })
  findAll(@Args() pagination: PaginationArgs): Promise<PaginatedUsers> {
    return this.usersService.findAll(pagination);
  }

  @Auth('User', DefaultActions.read)
  @Query(() => User, { name: 'user' })
  findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
  ): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Auth('User', DefaultActions.update)
  @Mutation(() => User, { name: 'updateUser' })
  updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @CurrentUser([ValidRoles.ADMIN]) user: User,
  ): Promise<User> {
    return this.usersService.update(updateUserInput, user);
  }

  @Auth('User', DefaultActions.delete)
  @Mutation(() => User, { name: 'blockUser' })
  blockUser(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser([ValidRoles.ADMIN]) user: User,
  ): Promise<User> {
    return this.usersService.block(id, user);
  }
}
