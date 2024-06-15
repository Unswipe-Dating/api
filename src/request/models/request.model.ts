import { ObjectType, registerEnumType, Field } from '@nestjs/graphql';
import { IsDateString } from 'class-validator';
import { BaseModel } from '../../common/models/base.model';
import {
  RequestType,
  RequestStatus,
  ChallengeVerificationStatus,
} from '@prisma/client';
import { GraphQLJSONObject } from 'graphql-type-json';

registerEnumType(RequestType, {
  name: 'RequestType',
  description: 'Defines the type of request',
});

registerEnumType(RequestStatus, {
  name: 'RequestStatus',
  description: 'Defines the status of the request',
});

registerEnumType(ChallengeVerificationStatus, {
  name: 'ChallengeVerificationStatus',
  description:
    'Defines the verification status of a challenge within a request',
});

@ObjectType()
export class Request extends BaseModel {
  @Field(() => RequestType)
  type: RequestType;

  @Field(() => String, { nullable: true })
  userId?: string;

  @Field(() => String, { nullable: true })
  requesteeUserId?: string;

  @Field(() => String, { nullable: true })
  requesterProfileId?: string;

  @Field(() => String, { nullable: true })
  requesteeProfileId?: string;

  @Field(() => String, { nullable: true })
  userProfileImage?: string;

  @Field(() => String, { nullable: true })
  requesteeProfileImage?: string;

  @Field()
  @IsDateString()
  expiry: Date;

  @Field(() => RequestStatus)
  status: RequestStatus;

  @Field(() => GraphQLJSONObject, { nullable: true })
  challenge?: Record<string, any>; // JSON stringified challenge

  @Field(() => String, { nullable: true })
  challengeVerification?: Record<string, any>; // JSON stringified challenge verification

  @Field(() => ChallengeVerificationStatus)
  challengeVerificationStatus: ChallengeVerificationStatus;
}
