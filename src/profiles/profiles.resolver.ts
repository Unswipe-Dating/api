import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { PostIdArgs } from './args/post-id.args';
import { UserIdArgs } from './args/user-id.args';
import { Profile } from './models/profile.model';
import { UpsertProfileInput } from './dto/upsertProfile.input';
import { UploadProfilePhotosInput } from './dto/uploadPhoto.input';
import { DatabaseService } from '../database/database.service';
import { UploaderService } from 'src/uploader/uploader.service';

@Resolver(() => Profile)
@UseGuards(GqlAuthGuard)
export class ProfilesResolver {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly uploaderService: UploaderService,
  ) {}
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
    const createdProfile =
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
          // FIXME: profile is not being connected to the user -> this is not working
          // user: {
          //   connect: {
          //     id: data.userId,
          //   },
          // },
        },
        include: {
          user: true,
        },
      });
    return createdProfile;
  }

  @Mutation(() => String)
  @UseGuards(GqlAuthGuard)
  async uploadProfilePhotos(@Args('data') data: UploadProfilePhotosInput) {
    // TODO: Have photos be mapped to the profile & user.
    const { files } = data;
    console.log('uploading the following photos', data, files);
    files.forEach(async (f) => {
      const uploadResult = await this.uploaderService.uploadImage(1, f);
      console.log('uploadResult', uploadResult);
    });
    if (files) {
      return 'ok';
    }
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
