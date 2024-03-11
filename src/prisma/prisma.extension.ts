import { Prisma } from '@prisma/client';

import { PaginationOptions, PrismaModel } from './paginated/types';
import { paginated } from './paginated';

export async function exists<T>(
  this: T,
  where: Prisma.Args<T, 'findFirst'>['where'],
): Promise<boolean> {
  // Get the current model at runtime
  const context = Prisma.getExtensionContext(this);

  const result = await (context as any).findFirst({ where });
  return result !== null;
}

export async function paginate<T>(
  this: T,
  args: Prisma.Exact<
    T,
    Omit<Prisma.Args<T, 'findMany'>, 'take' | 'skip'> & PaginationOptions
  >,
) {
  const context = Prisma.getExtensionContext(this);
  const { page, limit, ...res } = args as Omit<
    Prisma.Args<T, 'findMany'>,
    'take' | 'skip'
  > &
    PaginationOptions;
  const query = (res ?? {}) as any;

  return await paginated(context as PrismaModel, query, {
    limit,
    page,
  });
}
