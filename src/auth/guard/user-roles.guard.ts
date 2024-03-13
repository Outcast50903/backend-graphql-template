import { ForbiddenError } from '@nestjs/apollo';
import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';
import { Observable } from 'rxjs';

import { DefaultActions } from '@/common/enums';
import { ResourceType } from '@/common/interfaces';

import { hasAbility } from '../../common/helpers/roles';
import { META_ACTION } from '../decorators';
import { META_RESOURCE } from '../decorators/resourse-protected.decorator';

@Injectable()
export class UserRolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const resource = this.reflector.get<ResourceType>(
      META_RESOURCE,
      context.getHandler(),
    );

    const action = this.reflector.get<DefaultActions>(
      META_ACTION,
      context.getHandler(),
    );

    if (!action) return false;
    if (action.includes('read')) return true;

    const user = GqlExecutionContext.create(context).getContext().req.user;
    if (!user) throw new BadRequestException('User not found');

    if (!hasAbility(user.roles, resource, action))
      throw new ForbiddenError(
        'Do not have permission to access this resource',
      );

    return true;
  }
}
