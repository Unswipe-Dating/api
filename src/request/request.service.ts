import { Injectable } from '@nestjs/common';
import { RequestInput } from './dto/createRequest.input';
import { DatabaseService } from 'src/database/database.service';
import { Request } from './models/request.model';
import { UserIdPaginatedArgs } from 'src/profiles/args/user-id-paginated.args';
import { NotificationService } from './notifications.service';
import { Profile } from 'src/profiles/models/profile.model';
import { RequestStatus } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { User } from 'src/users/models/user.model';
import { CreateRequest } from './models/create-request';

@Injectable()
export class RequestService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly prismaService: PrismaService,
    private readonly notificationService: NotificationService,
  ) { }

  async updateRequest(requestObj: Partial<RequestInput>) {
    return this.databaseService.extendedClient.request.update({
      data: requestObj,
      where: {
        id: requestObj.id,
      },
    });

    // TODO: Add reject userIds to rejectedList of a user (similar to blockedUsers)
  }

  async createRequest(userId: string, requestObj: RequestInput): Promise<Request> {
    const existingRequest =
      await this.databaseService.extendedClient.request.findFirst({
        where: {
          requesterProfileId: requestObj.requesterProfileId,
          requesteeProfileId: requestObj.requesteeProfileId,
        },
      });

    // TODO: Handle the case where requestee is already exclusive with someone else
    // TODO: Think & work around edge cases here.
    if (!existingRequest) {
      return this.databaseService.extendedClient.request.create({
        data: {
          id: requestObj.id,
          type: requestObj.type,
          userId: userId,
          requesterProfileId: requestObj.requesterProfileId,
          requesteeProfileId: requestObj.requesteeProfileId,
          requesteeUserId: requestObj.requesteeUserId,
          expiry: requestObj.expiry,
          status: requestObj.status,
          challenge: requestObj.challenge,
          challengeVerification: requestObj.challengeVerification,
          challengeVerificationStatus: requestObj.challengeVerificationStatus,
        },
      });
    } else {
      throw new Error('Request between these profiles already exists.');
    }
  }

  async createNewRequest(requestData: RequestInput, user: User): Promise<CreateRequest> {
    const [requesteeProfile, requesterProfile] = await Promise.all([
      this.prismaService.profile.findFirst({
        where: {
          id: requestData.requesteeProfileId,
        },
        include: {
          user: true,
        },
      }),
      this.prismaService.profile.findFirst({
        where: {
          id: requestData.requesterProfileId,
        },
      })
    ]);

    const request = await this.createRequest(user?.id, {
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
        const title = `${requesterProfile.name} gave up swiping for you.`;
        const body = ''; // TODO: Add data field here if needed.
        await this.sendNotification(token, title, body);

      });
    } catch (error) {
      console.error('Could not send notifcation to', request.id);
    }
    return {
      ...request,
      userProfileImage: requesterProfile?.photoURLs?.[0],
      requesteeProfileImage: requesteeProfile?.photoURLs?.[0]
    };
  }

  async getRequestsByUser(data: UserIdPaginatedArgs) {
    const currentUserProfile =
      await this.databaseService.extendedClient.profile.findUnique({
        where: { userId: data.userId },
      });
    const requests = await this.databaseService.extendedClient.request.findMany(
      {
        where: {
          requesteeProfileId: currentUserProfile.id,
          NOT: {
            status: "REJECTED"
          }
        },
      },
    );
    const profileIds = requests.map((r) => r.requesterProfileId);
    const profiles: Profile[] =
      await this.databaseService.extendedClient.profile.findMany({
        where: {
          id: {
            in: profileIds,
          },
        },
      });
    // Attach requests alongside profiles
    for (let i = 0; i < profiles.length; i++) {
      const p = profiles[i];
      const request = requests.find((req) => req.requesterProfileId === p.id);
      p.request = request;
    }

    return profiles;
  }

  async getRequest(requestId: string): Promise<Request> {
    return await this.databaseService.extendedClient.request.findUnique({
      where: { id: requestId },
    });
  }

  async matchRequestById(requestId: string): Promise<CreateRequest> {
    const request = await this.updateRequest({
      id: requestId,
      status: RequestStatus.MATCHED,
    });
    let userProfileImage = null;
    let requesteeProfileImage = null;
    try {
      const [requesterProfile, requesteeProfile] = await Promise.all([
        this.prismaService.profile.findFirst({
          where: {
            id: request.requesterProfileId,
          },
          include: {
            user: true,
          },
        }),
        this.prismaService.profile.findFirst({
          where: {
            id: request.requesteeProfileId,
          }
        })
      ]);
      userProfileImage = requesterProfile?.photoURLs?.[0];
      requesteeProfileImage = requesteeProfile?.photoURLs?.[0];
      // Send notification for the matched requester
      const userWithTokens = await this.prismaService.user.findUnique({
        where: { id: requesterProfile?.userId },
        select: { fcmRegisterationTokens: true },
      });

      console.log('DEBUG (match) request', userWithTokens);
      // Send message to each of the tokens stored for this requestee.
      userWithTokens?.fcmRegisterationTokens.forEach(async (token) => {
        const title = 'You found a match!';
        const body = 'Open the app to see who it is';
        await this.sendNotification(token, title, body);
      });
    } catch (error) {
      console.error('Could not send notifcation to', request.id);
    }

    return {
      ...request,
      userProfileImage: userProfileImage,
      requesteeProfileImage: requesteeProfileImage
    };
  }

  private async sendNotification(token: string, title: string, body: string) {
    try {
      const result = await this.notificationService.sendMessage({
        token: token,
        notification: {
          title: title,
          body: body, // TODO: Add data field here if needed.
        },
      });
      console.log('result', result);
    } catch (err) {
      console.log("Error sending notif", err);
    }
  }
}
