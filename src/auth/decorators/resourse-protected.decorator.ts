import { SetMetadata } from '@nestjs/common';
import { Prisma } from '@prisma/client';

export const META_RESOURCE = 'resource';

export const ResourceProtected = (resource: Prisma.ModelName) =>
  SetMetadata(META_RESOURCE, resource);
