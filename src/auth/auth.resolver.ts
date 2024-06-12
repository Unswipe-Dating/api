import {
  Resolver,
  Mutation,
  Args,
  Parent,
  ResolveField,
  Query,
} from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { Auth } from './models/auth.model';
import { Token } from './models/token.model';
import { LoginInput } from './dto/login.input';
import { SignupInput } from './dto/signup.input';
import { RefreshTokenInput } from './dto/refresh-token.input';
import { User } from '../users/models/user.model';
import { OTPLessConfig } from 'src/common/configs/config.interface';
import { ConfigService } from '@nestjs/config';
import { Otp } from './models/otp.model';
import * as otpless from 'otpless-node-js-auth-sdk';
import GraphQLJSON from 'graphql-type-json';
import { GqlAuthGuard } from './gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { UserEntity } from 'src/common/decorators/user.decorator';
import { DatabaseService } from 'src/database/database.service';
import { ChatStatus } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

const otpLength = 6;

@Resolver(() => Auth)
export class AuthResolver {
  constructor(
    private readonly auth: AuthService,
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
    private readonly databaseService: DatabaseService,
    private readonly prismaService: PrismaService,
  ) {}

  @Query(() => GraphQLJSON)
  @UseGuards(GqlAuthGuard)
  async getConfig(@UserEntity() user: User) {
    const currentUserProfile =
      await this.databaseService.extendedClient.profile.findUnique({
        where: { userId: user.id },
      });
    const currentUserActiveChat = await this.prismaService.chat.findFirst({
      where: {
        userId: user.id,
        status: ChatStatus.ACTIVE,
      },
    });
    let request;
    if (currentUserProfile) {
      request = await this.databaseService.extendedClient.request.findFirst({
        where: {
          AND: [
            {
              { userId: user.id },
            },
            {
              OR: [{ status: 'ACTIVE' }, { status: 'MATCHED' }],
            },
          ],
        },
      });
    }

    console.log('request', request, currentUserProfile);
    const timeLeftForExpiry = request?.expiry
      ? new Date(new Date(request.expiry).getTime() - Date.now()).toISOString()
      : null;

    return {
      firebase: { ...this.configService.get('firebase'), customToken: '' }, // TODO: Implement custom token for a jwt
      reclaim: this.configService.get('reclaim'),
      timeLeftForExpiry,
      status: request?.status,
      request: request,
      chat: currentUserActiveChat,
    };
  }

  @Mutation(() => Auth)
  async signup(@Args('data') data: SignupInput) {
    const { accessToken, refreshToken, user } = await this.auth.signupOrLogin(
      data,
    );
    return {
      accessToken,
      refreshToken,
      user,
    };
  }

  @Mutation(() => Auth)
  async login(@Args('data') { phone, id }: LoginInput) {
    const { accessToken, refreshToken } = await this.auth.login(phone, id);

    return {
      accessToken,
      refreshToken,
    };
  }

  @Mutation(() => Token)
  async refreshToken(@Args('data') { token, userId }: RefreshTokenInput) {
    if (!userId) {
      throw new Error('userId is required to refresh tokens');
    }
    console.log('Refresh accessToken for user:', userId);
    return this.auth.refreshToken(token);
  }

  @ResolveField('user', () => User)
  async user(@Parent() auth: Auth) {
    return await this.auth.getUserFromToken(auth.accessToken);
  }

  @Mutation(() => Token, { nullable: true })
  async validateOTP(
    @Args('data')
    { id, otp, phone, otpOrderId, fcmRegisterationToken }: LoginInput,
  ) {
    console.log('OTP recieved for login:', otp);
    const user = await this.userService.createUserIfDoesntExist(id, {
      fcmRegisterationToken: fcmRegisterationToken,
    });
    const otplessConfig = this.configService.get<OTPLessConfig>('otpless');
    try {
      const result = await otpless.verifyOTP(
        undefined,
        phone,
        otpOrderId,
        otp,
        otplessConfig.clientId,
        otplessConfig.clientSecret,
      );
      if (result.isOTPVerified) {
        console.log('result', result);
        const { accessToken, refreshToken } = await this.auth.generateTokens({
          userId: user.id,
        });

        return {
          accessToken,
          refreshToken,
        };
      } else {
        console.log('error validating otp', result);
        return {
          error: String(result?.reason),
        };
      }
    } catch (error) {
      console.log('error validating OTP', error?.response);
    }
  }
  @Mutation(() => Otp)
  async requestOTP(@Args('data') { id, phone }: LoginInput) {
    console.log('Requesting OTP on: ', phone, ' id: ', id);
    const otplessConfig = this.configService.get<OTPLessConfig>('otpless');
    console.log('otplessConfig', otplessConfig, otpLength, phone);
    const result = await otpless.sendOTP(
      phone,
      undefined,
      'SMS',
      'hash',
      undefined,
      300, // 5 mins
      otpLength,
      otplessConfig.clientId,
      otplessConfig.clientSecret,
    );
    console.log('result', result);
    return result;
  }
}
