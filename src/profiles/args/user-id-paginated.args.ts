import { ArgsType, Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@ObjectType()
@InputType()
@ArgsType()
export class UserIdPaginatedArgs {
  @Field(() => String)
  @IsNotEmpty()
  userId: string;

  @Field(() => Number, { defaultValue: 10 })
  page_size: number;

  @Field(() => Number, { nullable: true, defaultValue: 0 })
  cursor: number;
}
