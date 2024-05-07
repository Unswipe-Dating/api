import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { UserEntity } from 'src/common/decorators/user.decorator';
import { User } from 'src/users/models/user.model';
import { RequestService } from './request.service';
import { Request } from './models/request.model';
import { RequestStatus } from '@prisma/client';

@Resolver()
@UseGuards(GqlAuthGuard)
export class RequestResolver {
  constructor(private requestService: RequestService) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Request)
  async createRequest(
    @UserEntity() user: User,
    @Args('data') requestData: Request,
  ) {
    return this.requestService.createRequest(user?.id, requestData);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Request)
  async rejectRequest(@UserEntity() user: User, @Args('data') data: Request) {
    return this.requestService.updateRequest(user?.id, {
      ...data,
      status: RequestStatus.REJECTED,
    });
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Request)
  async updateRequest(@UserEntity() user: User, @Args('data') data: Request) {
    return this.requestService.updateRequest(user?.id, data);
  }
}
