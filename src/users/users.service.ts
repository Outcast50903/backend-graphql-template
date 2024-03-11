import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { SingUpInput } from '@/auth/dto/signup.inputs';
import { handleErrors } from '@/helpers';
import { PrismaService } from '@/prisma';
import { PaginationArgs } from '@/prisma/paginated/dto';

import { User } from './dto/entities/user.entity';
import { PaginatedUsers } from './dto/inputs/paginated-user.inputs';
import { UpdateUserInput } from './dto/inputs/update-user.input';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create({ email, password, ...res }: SingUpInput): Promise<User> {
    try {
      return await this.prisma.user.create({
        data: {
          ...res,
          email: email.toLocaleLowerCase().trim(),
          password: bcrypt.hashSync(password, 10),
          image: null,
        },
      });
    } catch (error) {
      handleErrors(error, 'UsersService.create');
    }
  }
  async findAll(pagination: PaginationArgs): Promise<PaginatedUsers> {
    try {
      return (await this.prisma.extensions.user.paginate({
        limit: pagination.limit,
        page: pagination.page,
      })) as PaginatedUsers;
    } catch (error) {
      handleErrors(error, 'UsersService.findAll');
    }
  }

  async findOne(term: string): Promise<User> {
    try {
      const user = await this.prisma.user.findFirstOrThrow({
        where: {
          OR: [{ id: term }, { email: term.toLocaleLowerCase() }],
          isEnabled: true,
        },
      });

      return user;
    } catch (error) {
      handleErrors(error, 'UsersService.findOne');
    }
  }

  async update(updateUser: UpdateUserInput, user: User): Promise<User> {
    try {
      const user = await this.prisma.user.update({
        where: { id: updateUser.id },
        data: {
          ...updateUser,
          roles: {
            set: updateUser.roles.map((role) => role.toUpperCase()) as Role[],
          },
        },
      });

      return user;
    } catch (error) {
      handleErrors(error, 'UsersService.update');
    }
  }

  async block(id: string, currentUser: User): Promise<User> {
    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: { isEnabled: false },
      });

      return user;
    } catch (error) {
      handleErrors(error, 'UsersService.block');
    }
  }
}
