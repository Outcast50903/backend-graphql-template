import { applyDecorators, UseGuards } from '@nestjs/common';

import { RoleProtected } from '@/auth/decorators';
import { ResourceProtected } from '@/auth/decorators/resourse-protected.decorator';
import { JWTAuthGuard, UserRolesGuard } from '@/auth/guard';

import { DefaultActions } from '../enums';
import { ResourceType } from '../interfaces';

export function Auth(resource: ResourceType, action?: DefaultActions) {
  return applyDecorators(
    RoleProtected(action),
    ResourceProtected(resource),
    UseGuards(JWTAuthGuard, UserRolesGuard),
  );
}
