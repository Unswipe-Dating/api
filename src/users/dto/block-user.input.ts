import { InputType, Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@InputType()
export class BlockUserInput {
  @Field(() => [String])
  phones: [string];
}
