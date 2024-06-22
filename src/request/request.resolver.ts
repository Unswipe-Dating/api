import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { UserEntity } from 'src/common/decorators/user.decorator';
import { User } from 'src/users/models/user.model';
import { RequestService } from './request.service';
import { Request } from './models/request.model';
import { RequestStatus } from '@prisma/client';
import { RequestInput } from './dto/createRequest.input';
import { RejectRequestInput } from './dto/rejectRequest.input';
import { UpdateRequestInput } from './dto/updateRequest.input';
import { RequestIdArgs } from './args/request-id.args';
import { MatchRequestInput } from './dto/matchRequest.input';
import { PaginatedRequest } from './models/paginated-request.model';
import { UserIdPaginatedArgs } from 'src/profiles/args/user-id-paginated.args';
import { Profile } from 'src/profiles/models/profile.model';
import { NotificationService } from './notifications.service';
import { PrismaService } from 'nestjs-prisma';
import { CreateRequest } from './models/create-request';
import { DatabaseService } from 'src/database/database.service';
import { SkipProfileInput } from './dto/skipProfile.input';

@Resolver()
// @UseGuards(GqlAuthGuard)
export class RequestResolver {
  constructor(
    private requestService: RequestService,
    private readonly databaseService: DatabaseService
  ) { }

  @Mutation(() => String)
  @UseGuards(GqlAuthGuard)
  async skipProfile(
    @UserEntity() user: User,
    @Args('data') data: SkipProfileInput,
  ) {
    const reverseRequest =
      await this.databaseService.extendedClient.request.findFirst({
        where: {
          requesterProfileId: data.id,
          requesteeProfileId: user.profileId,
          status: "ACTIVE"
        },
      });

    if (reverseRequest) {
      await this.requestService.updateRequest({
        id: reverseRequest.id,
        status: RequestStatus.REJECTED,
      });;
    }

    const userToSkip =
      await this.databaseService.extendedClient.profile.findFirst({
        where: {
          id: data.id,
        },
        select: {
          userId: true,
        },
      });

    const skippedUsers = Array.from(
      new Set([...(user.skippedUserIds || []), userToSkip.userId]),
    );
    await this.databaseService.extendedClient.user.update({
      where: {
        id: user.id,
      },
      data: {
        skippedUserIds: {
          set: skippedUsers,
        },
      },
    });

    return userToSkip.userId;
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => CreateRequest)
  async createRequest(
    @UserEntity() user: User,
    @Args('data') requestData: RequestInput,
  ) {

    const reverseRequest =
      await this.databaseService.extendedClient.request.findFirst({
        where: {
          requesterProfileId: requestData.requesteeProfileId,
          requesteeProfileId: requestData.requesterProfileId,
          status: "ACTIVE"
        },
      });

    if (reverseRequest) {
      return this.requestService.matchRequestById(reverseRequest.id);
    }

    return await this.requestService.createNewRequest(requestData, user);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Request)
  async rejectRequest(@Args('data') data: RejectRequestInput) {
    return this.requestService.updateRequest({
      id: data.id,
      status: RequestStatus.REJECTED,
    });
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => CreateRequest)
  async matchRequest(@Args('data') data: MatchRequestInput) {
    return await this.requestService.matchRequestById(data.id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Request)
  async updateRequest(@Args('data') data: UpdateRequestInput) {
    return this.requestService.updateRequest({ ...data, id: data.id });
  }

  @Query(() => Request)
  async getRequest(@Args() data: RequestIdArgs) {
    return await this.requestService.getRequest(data.id);
  }

  @Query(() => [Profile])
  async getRequestedProfilesForUser(@Args('data') data: UserIdPaginatedArgs) {
    return await this.requestService.getRequestsByUser(data);
  }
}
