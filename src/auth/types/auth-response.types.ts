import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AuthResponse {
  @Field(() => String)
  token: string;

  @Field(() => String)
  refresh_token: string;
}
