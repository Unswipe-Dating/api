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
import { UserIdPaginatedArgs } from './args/user-id-paginated.args';
import { User } from 'src/users/models/user.model';
import { UserEntity } from 'src/common/decorators/user.decorator';

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
          hometown: data.hometown,
          height: data.height,
          location: data.location,
          locationCoordinates: data.locationCoordinates,
          zodiac: data.zodiac,
          languages: data.languages,
        },
      });

    await this.databaseService.extendedClient.user.update({
      where: {
        id: data.userId,
      },
      data: {
        profileId: createdProfile.id,
      },
      include: {
        Profile: true,
      },
    });
    return createdProfile;
  }

  @Mutation(() => String)
  @UseGuards(GqlAuthGuard)
  async uploadProfilePhotos(
    @UserEntity() user: User,
    @Args('data') data: UploadProfilePhotosInput,
  ) {
    const { files } = data;
    const uploadedImages = await Promise.all(
      files.map((f) => this.uploaderService.uploadImage(user.id, f)),
    );
    if (files && uploadedImages) {
      await this.databaseService.extendedClient.profile.update({
        where: { userId: user.id },
        data: {
          photoURLs: uploadedImages,
        },
      });
      return 'ok';
    }
  }

  @Query(() => Profile)
  userProfile(@Args() id: UserIdArgs) {
    return this.databaseService.extendedClient.profile.findUnique({
      where: { userId: id.userId },
    });
  }

  @Query(() => [Profile])
  async browseProfiles(@Args('data') data: UserIdPaginatedArgs) {
    const user = await this.databaseService.extendedClient.user.findFirst({
      where: { id: data.userId },
    });
    const currentUserProfile =
      await this.databaseService.extendedClient.profile.findUnique({
        where: { userId: data.userId },
      });

    const profiles = await this.databaseService.extendedClient.profile.findMany(
      {
        where: {
          userId: {
            not: {
              in: [data.userId, ...user.blockedListUserIds],
            },
          },
        },
      },
    );

    const sortedProfiles = profiles.sort((a, b) => {
      const distanceA = Math.sqrt(
        Math.pow(
          Number(a.locationCoordinates[0]) -
            Number(currentUserProfile.locationCoordinates[0]),
          2,
        ) +
          Math.pow(
            Number(a.locationCoordinates[1]) -
              Number(currentUserProfile.locationCoordinates[1]),
            2,
          ),
      );
      const distanceB = Math.sqrt(
        Math.pow(
          Number(b.locationCoordinates[0]) -
            Number(currentUserProfile.locationCoordinates[0]),
          2,
        ) +
          Math.pow(
            Number(b.locationCoordinates[1]) -
              Number(currentUserProfile.locationCoordinates[1]),
            2,
          ),
      );
      return distanceA - distanceB;
    });

    const result = sortedProfiles.slice(
      data.cursor,
      data.cursor + data.page_size,
    );
    return result;
  }

  @Query(() => Profile)
  async profile(@Args() id: PostIdArgs) {
    return this.databaseService.extendedClient.profile.findUnique({
      where: { id: id.profileId },
    });
  }
}
