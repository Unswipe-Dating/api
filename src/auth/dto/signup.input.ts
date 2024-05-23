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
  email: string;

  @Field({ nullable: true })
  country: string;

  @Field({ nullable: true })
  tAndCConsent: boolean;

  @Field({ nullable: true })
  firebaseCustomToken: string;

  @Field({ nullable: true })
  fcmRegisterationToken: string;
}
