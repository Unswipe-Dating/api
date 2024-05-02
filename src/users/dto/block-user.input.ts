import { InputType, Field, ObjectType } from '@nestjs/graphql';
import { IsPhoneNumber } from 'class-validator';

@ObjectType()
@InputType()
export class BlockUserInput {
  @Field()
  @IsPhoneNumber()
  id: string;

  @Field({ nullable: true })
  name?: string;
}
