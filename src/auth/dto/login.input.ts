import { IsPhoneNumber, IsNotEmpty, MinLength } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class LoginInput {
  @Field()
  @IsNotEmpty()
  @IsPhoneNumber()
  id: string;

  @Field()
  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;

  @Field({ nullable: true })
  otp: string;
}
