import { SetMetadata } from '@nestjs/common';

import { DefaultActions } from '@/common/enums';

export const META_ACTION = 'action';

export const RoleProtected = (action: DefaultActions) =>
  SetMetadata(META_ACTION, action);
