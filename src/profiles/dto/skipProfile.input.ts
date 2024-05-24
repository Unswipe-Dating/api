import { InputType, Field, ObjectType } from '@nestjs/graphql';

@InputType()
@ObjectType()
export class SkipProfileInput {
  @Field({ nullable: true })
  id: string;
}
