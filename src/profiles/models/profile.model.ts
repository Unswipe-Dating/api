import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { BaseModel } from '../../common/models/base.model';
import { IsNotEmpty } from 'class-validator';
import { DatingPreference } from '@prisma/client';

registerEnumType(DatingPreference, {
  name: 'DatingPreference',
  description: 'Dating Preference enum',
});

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
