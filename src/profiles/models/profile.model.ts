import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { BaseModel } from '../../common/models/base.model';
import { IsNotEmpty } from 'class-validator';
import { DatingPreference, ZodiacSign } from '@prisma/client';
import { GraphQLJSONObject } from 'graphql-type-json';
import { User } from 'src/users/models/user.model';
import { Request } from 'src/request/models/request.model';

@ObjectType()
export class Profile extends BaseModel {
  @Field()
  @IsNotEmpty()
  userId: string;

  @Field({ nullable: true })
  id: string;

  @Field({ nullable: true })
  completed: boolean;

  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  showTruncatedName: boolean;

  @Field({ nullable: true })
  dob: string;

  @Field(() => DatingPreference, { nullable: true })
  gender: DatingPreference;

  @Field({ nullable: true })
  pronouns: string;

  @Field(() => DatingPreference, { nullable: true })
  datingPreference: DatingPreference;

  @Field(() => GraphQLJSONObject, { nullable: true })
  interests: string;

  @Field(() => User, { nullable: true })
  user?: User;

  @Field({ nullable: true })
  photoURLs: string[];

  @Field({ nullable: true })
  hometown?: string;

  @Field({ nullable: true })
  height?: string; // x'y" in ft'inches" format

  @Field({ nullable: true })
  location?: string;

  @Field(() => [String], { nullable: true })
  locationCoordinates?: string[];

  @Field(() => [String], { nullable: true })
  languages?: string[];

  @Field(() => ZodiacSign, { nullable: true })
  zodiac?: ZodiacSign;

  @Field(() => Request, { nullable: true })
  request?: Request;
}
