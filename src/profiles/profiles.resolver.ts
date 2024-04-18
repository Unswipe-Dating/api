import { PrismaService } from 'nestjs-prisma';
import { Resolver, Query, Args, Subscription, Mutation } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { UseGuards } from '@nestjs/common';
import { UserEntity } from '../common/decorators/user.decorator';
import { User } from '../users/models/user.model';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { PostIdArgs } from './args/post-id.args';
import { UserIdArgs } from './args/user-id.args';
import { Profile } from './models/profile.model';
import { CreateProfileInput } from './dto/createProfile.input';

const pubSub = new PubSub();

@Resolver(() => Profile)
export class ProfilesResolver {
  constructor(private prisma: PrismaService) {}

  @Subscription(() => Profile)
  postCreated() {
    return pubSub.asyncIterator('postCreated');
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Profile)
  async createProfile(
    @UserEntity() user: User,
    @Args('data') data: CreateProfileInput,
  ) {
    const newProfile = this.prisma.profile.create({
      data: {
        completed: false,
        name: '',
        showTruncatedName: false,
        userId: user.id,
      },
    });
    return newProfile;
  }
  @Query(() => Profile)
  userProfile(@Args() id: UserIdArgs) {
    return this.prisma.user.findUnique({ where: { id: id.userId } });
  }

  @Query(() => Profile)
  async profile(@Args() id: PostIdArgs) {
    return this.prisma.profile.findUnique({ where: { id: id.profileId } });
  }
}
