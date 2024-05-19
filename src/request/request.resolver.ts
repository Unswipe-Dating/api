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

@Resolver()
// @UseGuards(GqlAuthGuard)
export class RequestResolver {
  constructor(private requestService: RequestService) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Request)
  async createRequest(
    @UserEntity() user: User,
    @Args('data') requestData: RequestInput,
  ) {
    return this.requestService.createRequest(user?.id, requestData);
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
    return this.requestService.updateRequest({
      id: data.id,
      status: RequestStatus.MATCHED,
    });
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
