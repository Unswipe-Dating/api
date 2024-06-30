import {
  InputType,
  Field,
  registerEnumType,
  ObjectType,
} from '@nestjs/graphql';
import { DatingPreference, ZodiacSign } from '@prisma/client';
import { IsNotEmpty } from 'class-validator';
import { GraphQLJSONObject } from 'graphql-type-json';

registerEnumType(DatingPreference, {
  name: 'DatingPreference',
  description: 'Dating Preference enum',
});

registerEnumType(ZodiacSign, {
  name: 'ZodiacSign',
  description: 'ZodiacSign enum',
});

@InputType()
@ObjectType()
export class UpsertProfileInput {
  @Field()
  @IsNotEmpty()
  userId: string;

  @Field({ nullable: true })
  id: string;

  @Field({ nullable: true })
  createdAt: string;

  @Field({ nullable: true })
  updatedAt: string;

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

  @Field({ nullable: true })
  blockedListUserIds: string[];

  @Field(() => DatingPreference, { nullable: true })
  datingPreference: DatingPreference;

  @Field(() => GraphQLJSONObject, { nullable: true })
  interests: string;

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

  @Field(() => GraphQLJSONObject, { nullable: true })
  work: string;

  @Field(() => GraphQLJSONObject, { nullable: true })
  lifestyle: string;

  @Field(() => GraphQLJSONObject, { nullable: true })
  values: string;
}
