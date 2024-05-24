import 'reflect-metadata';
import {
  ObjectType,
  registerEnumType,
  HideField,
  Field,
} from '@nestjs/graphql';
import { IsEmail, IsPhoneNumber } from 'class-validator';
import { Profile } from '../../profiles/models/profile.model';
import { BaseModel } from '../../common/models/base.model';

@ObjectType()
export class User extends BaseModel {
  @Field()
  @IsPhoneNumber()
  id: string;

  @Field()
  @IsPhoneNumber()
  phone: string;

  @Field(() => String, { nullable: true })
  firstname?: string;

  @Field(() => String, { nullable: true })
  lastname?: string;

  @Field(() => Profile, { nullable: true })
  Profile: Profile;

  @Field({ nullable: true })
  profileId: string;

  @HideField()
  password: string;

  @Field()
  tAndCConsent: boolean;

  @Field()
  country: string;

  @Field({ nullable: true })
  firebaseCustomToken: string;

  @Field({ nullable: true })
  fcmRegisterationTokens: string[];
}
