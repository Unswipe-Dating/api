import { Injectable } from '@nestjs/common';
import { RequestInput } from './dto/createRequest.input';
import { DatabaseService } from 'src/database/database.service';
import { Request } from './models/request.model';
import { UserIdPaginatedArgs } from 'src/profiles/args/user-id-paginated.args';

@Injectable()
export class RequestService {
  constructor(private readonly databaseService: DatabaseService) {}

  async updateRequest(requestObj: Partial<RequestInput>) {
    return this.databaseService.extendedClient.request.update({
      data: requestObj,
      where: {
        id: requestObj.id,
      },
    });

    // TODO: Add reject userIds to rejectedList of a user (similar to blockedUsers)
  }

  async createRequest(userId: string, requestObj: RequestInput) {
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

  async getRequestsByUser(data: UserIdPaginatedArgs) {
    const currentUserProfile =
      await this.databaseService.extendedClient.profile.findUnique({
        where: { userId: data.userId },
      });
    const requests = await this.databaseService.extendedClient.request.findMany(
      {
        where: {
          requesteeProfileId: currentUserProfile.id,
        },
      },
    );
    console.log('DEBUG', requests);
    const profileIds = requests.map((r) => r.requesterProfileId);
    console.log('DEBUG', profileIds);
    const profiles = await this.databaseService.extendedClient.profile.findMany(
      {
        where: {
          id: {
            in: profileIds,
          },
        },
      },
    );
    console.log('DEBUG', profiles);
    return profiles;
  }

  async getRequest(requestId: string): Promise<Request> {
    return await this.databaseService.extendedClient.request.findUnique({
      where: { id: requestId },
    });
  }
}
