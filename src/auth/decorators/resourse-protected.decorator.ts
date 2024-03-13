import { SetMetadata } from '@nestjs/common';

import { ResourceType } from '@/common/interfaces';

export const META_RESOURCE = 'resource';

export const ResourceProtected = (resource: ResourceType) =>
  SetMetadata(META_RESOURCE, resource);
