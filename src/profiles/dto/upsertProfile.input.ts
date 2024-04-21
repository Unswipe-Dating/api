import {
  InputType,
  Field,
  registerEnumType,
  ObjectType,
} from '@nestjs/graphql';
import { DatingPreference } from '@prisma/client';
import { IsNotEmpty } from 'class-validator';

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

  @Field({ nullable: true })
  gender: string;

  @Field({ nullable: true })
  pronouns: string;

  @Field({ nullable: true })
  blockedListUserIds: string[];

  @Field(() => DatingPreference, { nullable: true })
  datingPreference: DatingPreference;

  @Field({ nullable: true })
  interests: string;

  getInterests(): any {
    return JSON.parse(this.interests);
  }

  setInterest(interests: any) {
    this.interests = JSON.stringify(interests);
  }
}
