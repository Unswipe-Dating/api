import { IsEmail, IsNotEmpty, MinLength, IsPhoneNumber } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class SignupInput {
  @Field({ nullable: false })
  @IsPhoneNumber()
  phone: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @Field({ nullable: true })
  firstname?: string;

  @Field({ nullable: true })
  lastname?: string;

  @Field()
  country: string;

  @Field()
  tAndCConsent: boolean;
}
