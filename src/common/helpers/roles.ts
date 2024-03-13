import { Prisma } from '@prisma/client';

import { DefaultActions } from '../enums';

export const PERMISSIONS: Record<
  string,
  DefaultActions[] | Record<Prisma.ModelName, DefaultActions[]>
> = {
  USER: {
    User: [],
    Accounts: [],
    Session: [],
    VerificationToken: [],
    Logger: [],
  },
  ADMIN: [DefaultActions.manage],
};

export const hasAbility = (
  roles: string[],
  resource: Prisma.ModelName,
  action: DefaultActions,
) => {
  const hasPermission = roles.some((role) => {
    if (!PERMISSIONS[role]) return false;

    if (Array.isArray(PERMISSIONS[role])) {
      const permissions = PERMISSIONS[role] as DefaultActions[];
      if (permissions.includes(DefaultActions.manage)) return true;
    }

    if (Array.isArray(PERMISSIONS[role][resource])) {
      return PERMISSIONS[role][resource].includes(action);
    }

    return false;
  });

  return hasPermission;
};
