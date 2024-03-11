import { Type } from '@nestjs/common';
import { Field, Int, ObjectType } from '@nestjs/graphql';

import { PaginatedResult } from '../types';

export function Pagination<T>(classRef: Type<T>) {
  @ObjectType({ isAbstract: true })
  abstract class PaginationResult implements PaginatedResult<T> {
    @Field(() => Boolean)
    isFirstPage: boolean;

    @Field(() => Boolean)
    isLastPage: boolean;

    @Field(() => Int)
    currentPage: number;

    @Field(() => Int)
    previousPage: number;

    @Field(() => Int)
    nextPage: number;

    @Field(() => Int)
    pageCount: number;

    @Field(() => [classRef])
    results: T[];
  }

  return PaginationResult;
}
