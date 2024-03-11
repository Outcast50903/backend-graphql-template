export type PrismaModel = {
  [k in 'findMany' | 'count']: CallableFunction;
};

export type PaginationOptions = {
  limit: number;
  page?: number;
};

export interface PaginatedResult<T> {
  isFirstPage: boolean;
  isLastPage: boolean;
  currentPage: number;
  previousPage: number;
  nextPage: number;
  pageCount: number;
  results: T[];
}
