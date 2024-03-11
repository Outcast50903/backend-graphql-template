import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field(() => Boolean)
  isEnabled: boolean;

  @Field(() => String)
  email: string;

  @HideField()
  password?: string;

  @Field(() => String, { nullable: true })
  fullName?: string;

  @Field(() => [String])
  roles: string[];

  @Field(() => String, { nullable: true })
  image?: string;
}
