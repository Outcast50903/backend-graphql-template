import {
  createParamDecorator,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import { User } from '@/users/dto/entities/user.entity';

import { ValidRoles } from '../enums/valid-roles.enum';

export const CurrentUser = createParamDecorator(
  async (domain: ValidRoles[] = [], context) => {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    const user: User = await request.user;
    if (!user) throw new InternalServerErrorException('User not found');

    if (domain.length > 0) {
      const hasPermission = user.roles.some((userRole) =>
        domain.includes(userRole.toLowerCase() as ValidRoles),
      );

      if (!hasPermission) {
        throw new ForbiddenException('User does not have permission');
      }
    }

    return user;
  },
);
