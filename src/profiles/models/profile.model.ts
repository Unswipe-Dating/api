import { Field, ObjectType } from '@nestjs/graphql';
import { BaseModel } from '../../common/models/base.model';
import { IsNotEmpty } from 'class-validator';
import { DatingPreference } from '@prisma/client';
import { GraphQLJSONObject } from 'graphql-type-json';
import { User } from 'src/users/models/user.model';

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

  @Field({ nullable: true })
  blockedListUserIds: string[];

  @Field(() => DatingPreference, { nullable: true })
  datingPreference: DatingPreference;

  @Field(() => GraphQLJSONObject, { nullable: true })
  interests: Record<string, any>;

  @Field(() => User, { nullable: true })
  user?: User;

  @Field({ nullable: true })
  photoURLs: string[];
}
