import {
  InputType,
  Field,
  registerEnumType,
  ObjectType,
} from '@nestjs/graphql';
import { DatingPreference } from '@prisma/client';
import { IsNotEmpty } from 'class-validator';
import { GraphQLJSONObject } from 'graphql-type-json';

registerEnumType(DatingPreference, {
  name: 'DatingPreference',
  description: 'Dating Preference enum',
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
}
