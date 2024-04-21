import { PrismaService } from 'nestjs-prisma';
import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { PostIdArgs } from './args/post-id.args';
import { UserIdArgs } from './args/user-id.args';
import { Profile } from './models/profile.model';
import { UpsertProfileInput } from './dto/upsertProfile.input';
import { UploadPhotosInput } from './dto/uploadPhoto.input';

@Resolver(() => Profile)
@UseGuards(GqlAuthGuard)
export class ProfilesResolver {
  constructor(private prisma: PrismaService) {}

  @Mutation(() => Profile)
  @UseGuards(GqlAuthGuard)
  async upsertProfile(@Args('data') data: UpsertProfileInput) {
    const newProfile = this.prisma.profile.upsert({
      create: {
        ...data,
        userId: data.userId,
      },
      update: {
        ...data,
        userId: data.userId,
      },
      where: {
        id: data.id,
      },
    });
    return newProfile;
  }

  @Mutation(() => String)
  async uploadProfilePhotos(@Args('data') data: UploadPhotosInput) {
    // TODO: update logic here with working multi-upload.
    console.log('debug', data);
    return 'ok';
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
