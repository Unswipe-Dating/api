import { registerEnumType, Field, InputType } from '@nestjs/graphql';
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

@InputType()
export class UpdateRequestInput extends BaseModel {
  @Field(() => String)
  id: string;

  @Field(() => RequestType)
  type: RequestType;

  @Field(() => String, { nullable: true })
  requesterProfileId?: string;

  @Field(() => String, { nullable: true })
  requesteeProfileId?: string;

  @Field()
  expiry: string;

  @Field(() => RequestStatus)
  status: RequestStatus;

  @Field(() => GraphQLJSONObject, { nullable: true })
  challenge?: string; // JSON stringified challenge

  @Field(() => String, { nullable: true })
  challengeVerification?: string; // JSON stringified challenge verification

  @Field(() => ChallengeVerificationStatus)
  challengeVerificationStatus?: ChallengeVerificationStatus;
}
