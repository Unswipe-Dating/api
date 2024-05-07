import { registerEnumType, Field, InputType } from '@nestjs/graphql';
import { IsDateString } from 'class-validator';
import { BaseModel } from '../../common/models/base.model';
import {
  RequestType,
  RequestStatus,
  ChallengeVerificationStatus,
} from '@prisma/client';

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
export class RejectRequestInput extends BaseModel {
  @Field(() => String)
  id: string;
}
