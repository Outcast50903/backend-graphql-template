import { applyDecorators, UseGuards } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { RoleProtected } from '@/auth/decorators';
import { ResourceProtected } from '@/auth/decorators/resourse-protected.decorator';
import { JWTAuthGuard, UserRolesGuard } from '@/auth/guard';

import { DefaultActions } from '../enums';

export function Auth(resource: Prisma.ModelName, action?: DefaultActions) {
  return applyDecorators(
    RoleProtected(action),
    ResourceProtected(resource),
    UseGuards(JWTAuthGuard, UserRolesGuard),
  );
}
