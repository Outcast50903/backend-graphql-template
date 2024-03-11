import { ArgsType, Field } from '@nestjs/graphql';
import { IsNumber, IsOptional, Min } from 'class-validator';

@ArgsType()
export class PaginationArgs {
  @Field(() => Number, { defaultValue: 1 })
  @IsNumber()
  @IsOptional()
  @Min(1)
  page?: number = 1;

  @Field(() => Number, { defaultValue: 10 })
  @IsNumber()
  @IsOptional()
  @Min(10)
  limit?: number = 10;
}
