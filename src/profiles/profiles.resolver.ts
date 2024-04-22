import { PrismaService } from 'nestjs-prisma';
import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { PostIdArgs } from './args/post-id.args';
import { UserIdArgs } from './args/user-id.args';
import { Profile } from './models/profile.model';
import { UpsertProfileInput } from './dto/upsertProfile.input';
import { UploadPhotosInput } from './dto/uploadPhoto.input';
import { DatabaseService } from '../database/database.service';

@Resolver(() => Profile)
@UseGuards(GqlAuthGuard)
export class ProfilesResolver {
  constructor(private readonly databaseService: DatabaseService) {}
  @Mutation(() => Profile)
  @UseGuards(GqlAuthGuard)
  async updateProfile(@Args('data') data: UpsertProfileInput) {
    const upsertProfile =
      await this.databaseService.extendedClient.profile.update({
        data,
        where: {
          userId: data.userId,
        },
      });
    return upsertProfile;
  }

  @Mutation(() => Profile)
  @UseGuards(GqlAuthGuard)
  async createProfile(@Args('data') data: UpsertProfileInput) {
    const upsertProfile =
      await this.databaseService.extendedClient.profile.create({
        data: {
          userId: data.userId,
          completed: data.completed,
          datingPreference: data.datingPreference,
          dob: data.dob,
          gender: data.gender,
          interests: data.interests,
          name: data.name,
          pronouns: data.pronouns,
          showTruncatedName: data.showTruncatedName,
        },
      });
    return upsertProfile;
  }

  @Mutation(() => String)
  async uploadProfilePhotos(@Args('data') data: UploadPhotosInput) {
    // TODO: update logic here with working multi-upload.
    console.log('debug', data);
    return 'ok';
  }

  @Query(() => Profile)
  userProfile(@Args() id: UserIdArgs) {
    return this.databaseService.extendedClient.profile.findUnique({
      where: { userId: id.userId },
    });
  }

  @Query(() => Profile)
  async profile(@Args() id: PostIdArgs) {
    return this.databaseService.extendedClient.profile.findUnique({
      where: { id: id.profileId },
    });
  }
}
