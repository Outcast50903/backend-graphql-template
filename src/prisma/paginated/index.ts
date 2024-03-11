import { Prisma } from '@prisma/client';

import { PaginationOptions, PrismaModel } from './types';

type PaginatedOptions = Required<PaginationOptions>;

export const paginated = async <T>(
  model: PrismaModel,
  query: Omit<Prisma.Args<T, 'findMany'>, 'take' | 'skip'>,
  { page, limit }: PaginatedOptions,
) => {
  const previousPage = page > 1 ? page - 1 : 0;

  const [results, totalCount] = await Promise.all([
    model.findMany({
      ...query,
      skip: (page - 1) * limit,
      take: limit,
    }),
    model.count({
      ...query,
    }),
  ]);

  const pageCount = Math.ceil(totalCount / limit);
  const nextPage = page < pageCount ? page + 1 : 0;

  return {
    isFirstPage: previousPage === 0,
    isLastPage: nextPage === 0,
    currentPage: page,
    previousPage,
    nextPage,
    pageCount,
    results,
  };
};
