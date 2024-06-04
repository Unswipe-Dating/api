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

@Resolver()
// @UseGuards(GqlAuthGuard)
export class RequestResolver {
  constructor(
    private requestService: RequestService,
    private readonly notificationService: NotificationService,
    private readonly prismaService: PrismaService,
  ) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Request)
  async createRequest(
    @UserEntity() user: User,
    @Args('data') requestData: RequestInput,
  ) {
    const requesteeProfile = await this.prismaService.profile.findFirst({
      where: {
        id: requestData.requesteeProfileId,
      },
      include: {
        user: true,
      },
    });

    const requesterProfile = await this.prismaService.profile.findFirst({
      where: {
        id: requestData.requesterProfileId,
      },
    });

    const request = await this.requestService.createRequest(user?.id, {
      ...requestData,
      expiry: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      requesteeUserId: requesteeProfile.userId,
    });

    try {
      // Send notification for the request to the user
      const userWithTokens = await this.prismaService.user.findUnique({
        where: { id: requesteeProfile?.userId },
        select: { fcmRegisterationTokens: true, id: true },
      });

      console.log('DEBUG', userWithTokens);
      // Send message to each of the tokens stored for this requestee.
      userWithTokens?.fcmRegisterationTokens.forEach(async (token) => {
        const result = await this.notificationService.sendMessage({
          token: token,
          notification: {
            title: `${requesterProfile.name} gave up swiping for you.`,
            body: '', // TODO: Add data field here if needed.
          },
        });
        console.log('result', result);
      });
    } catch (error) {
      console.error('Could not send notifcation to', request.id);
    }
    return request;
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
  @Mutation(() => Request)
  async matchRequest(@Args('data') data: MatchRequestInput) {
    const request = await this.requestService.updateRequest({
      id: data.id,
      status: RequestStatus.MATCHED,
    });
    try {
      const requesterProfile = await this.prismaService.profile.findFirst({
        where: {
          id: request.requesterProfileId,
        },
        include: {
          user: true,
        },
      });

      // Send notification for the matched requester
      const userWithTokens = await this.prismaService.user.findUnique({
        where: { id: requesterProfile?.userId },
        select: { fcmRegisterationTokens: true },
      });

      console.log('DEBUG (match) request', userWithTokens);
      // Send message to each of the tokens stored for this requestee.
      userWithTokens?.fcmRegisterationTokens.forEach(async (token) => {
        const result = await this.notificationService.sendMessage({
          token: token,
          notification: {
            title: 'You found a match!',
            body: 'Open the app to see who it is', // TODO: Add data field here if needed.
          },
        });
        console.log('result', result);
      });
    } catch (error) {
      console.error('Could not send notifcation to', request.id);
    }

    return request;
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
