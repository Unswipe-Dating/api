import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Request } from './models/request.model';

@Injectable()
export class RequestService {
  constructor(private prisma: PrismaService) {}

  async updateRequest(userId: string, requestObj: Request) {
    return this.prisma.request.update({
      data: requestObj,
      where: {
        id: requestObj.id,
      },
    });
  }

  async createRequest(userId: string, requestObj: Request) {
    return this.prisma.request.create({
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
  }
}
