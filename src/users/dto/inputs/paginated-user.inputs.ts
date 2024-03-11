import { ObjectType } from '@nestjs/graphql';

import { Pagination } from '@/prisma/paginated/dto/pagination-result.input';

import { User } from '../entities/user.entity';

@ObjectType()
export class PaginatedUsers extends Pagination(User) {}
