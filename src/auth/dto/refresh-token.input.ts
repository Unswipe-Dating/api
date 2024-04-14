import { Field, InputType } from '@nestjs/graphql';
import { IsJWT, IsNotEmpty } from 'class-validator';
import { GraphQLJWT } from 'graphql-scalars';

@InputType()
export class RefreshTokenInput {
  @IsNotEmpty()
  @IsJWT()
  @Field(() => GraphQLJWT)
  token: string;

  @Field({ nullable: true })
  userId: string;
}
