import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsNumber, Min } from 'class-validator';

@ArgsType()
export class PaginationArgs {
  @Field(() => Int, { nullable: true })
  @IsNumber()
  @Min(1)
  limit: number;

  @Field(() => Int, { nullable: true })
  @IsNumber()
  @Min(1)
  page: number;
}
