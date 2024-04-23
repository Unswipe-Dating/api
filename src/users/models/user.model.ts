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
import { RequestType } from '@prisma/client';

registerEnumType(RequestType, {
  name: 'RequestType',
  description: 'Request role',
});

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
  profile?: Profile | null;

  @HideField()
  password: string;

  @Field()
  tAndCConsent: boolean;
}
