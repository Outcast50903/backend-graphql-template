import { DefaultActions } from '../enums';
import { ResourceType } from '../interfaces';

export const PERMISSIONS: Record<
  string,
  DefaultActions[] | Record<ResourceType, DefaultActions[]>
> = {
  USER: {
    User: [],
  },
  ADMIN: [DefaultActions.manage],
};

export const hasAbility = (
  roles: string[],
  resource: ResourceType,
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
