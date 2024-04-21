import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Otp {
  @Field()
  orderId: string;
}
