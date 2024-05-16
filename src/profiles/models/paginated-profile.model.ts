import { ObjectType, Field } from '@nestjs/graphql';
import { Profile } from './profile.model';

@ObjectType()
export class PaginatedProfile {
  @Field(() => [Profile], { nullable: true })
  profiles: Profile;

  @Field({ nullable: true })
  hasNext: boolean;

  @Field({ nullable: true })
  nextCursor: number;
}
