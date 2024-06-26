import { PrismaService } from 'nestjs-prisma';
import {
  Resolver,
  Query,
  Parent,
  Mutation,
  Args,
  ResolveField,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UserEntity } from '../common/decorators/user.decorator';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { UsersService } from './users.service';
import { User } from './models/user.model';
import { ChangePasswordInput } from './dto/change-password.input';
import { UpdateUserInput } from './dto/update-user.input';
import { SignupInput } from 'src/auth/dto/signup.input';
import { BlockUserInput } from './dto/block-user.input';

@Resolver(() => User)
@UseGuards(GqlAuthGuard)
export class UsersResolver {
  constructor(
    private usersService: UsersService,
    private prisma: PrismaService,
  ) {}

  @Query(() => User)
  async me(@UserEntity() user: User): Promise<User> {
    return user;
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => User)
  async createUser(
    @UserEntity() user: User,
    @Args('data') newUserData: SignupInput,
  ) {
    return this.usersService.updateUser(newUserData?.id, newUserData);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => User)
  async updateUser(
    @UserEntity() user: User,
    @Args('data') newUserData: SignupInput,
  ) {
    return this.usersService.updateUser(newUserData?.id, newUserData);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => User)
  async changePassword(
    @UserEntity() user: User,
    @Args('data') changePassword: ChangePasswordInput,
  ) {
    return this.usersService.changePassword(
      user.id,
      user.password,
      changePassword,
    );
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => [String])
  async blockUsers(@Args('id') id: string, @Args('data') data: BlockUserInput) {
    console.log('data', data);
    const blockedUsers = (
      await Promise.all(
        data?.phones?.map(async (phone) =>
          this.usersService.createUserIfDoesntExist(phone, {
            phone: phone,
            id: phone,
          }),
        ),
      )
    )
      .filter((u) => !(u === undefined && u === null))
      .map((u: any) => u.id as string);

    await this.usersService.blockUsersForId(id, blockedUsers);
    return blockedUsers;
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => String)
  async createActiveChatRoom(@UserEntity() user: User, @Args('id') id: string) {
    await this.usersService.upsertChatRoom({
      roomId: id,
      userId: user.id,
    });

    return 'ok';
  }
}
