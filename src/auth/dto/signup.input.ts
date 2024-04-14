import { IsEmail, IsNotEmpty, MinLength, IsPhoneNumber } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class SignupInput {
  @Field()
  @IsNotEmpty()
  @IsPhoneNumber()
  id: string;

  @Field()
  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;

  @Field({ nullable: true })
  @IsEmail()
  email: string;

  @Field({ nullable: true })
  country: string;

  @Field({ nullable: true })
  tAndCConsent: boolean;

  @Field({ nullable: true })
  firstname?: string;

  @Field({ nullable: true })
  lastname?: string;
}
