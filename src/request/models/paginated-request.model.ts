import { ObjectType, Field } from '@nestjs/graphql';
import { Request } from './request.model';

@ObjectType()
export class PaginatedRequest {
  @Field(() => [Request], { nullable: true })
  requests: Request;

  @Field({ nullable: true })
  hasNext: boolean;

  @Field({ nullable: true })
  nextCursor: number;
}
