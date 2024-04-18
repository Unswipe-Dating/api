import {
  Resolver,
  Mutation,
  Args,
  Parent,
  ResolveField,
} from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { Auth } from './models/auth.model';
import { Token } from './models/token.model';
import { LoginInput } from './dto/login.input';
import { SignupInput } from './dto/signup.input';
import { RefreshTokenInput } from './dto/refresh-token.input';
import { User } from '../users/models/user.model';
import msg91 from 'msg91';

const templateId = '661ed944d6fc050636222b82';
const otpLength = 6;
const msg91AuthKey = '420161AEOVz4bOJl661ed50bP1';

msg91.initialize({ authKey: msg91AuthKey });

@Resolver(() => Auth)
export class AuthResolver {
  constructor(
    private readonly auth: AuthService,
    private readonly userService: UsersService,
  ) {}

  @Mutation(() => Auth)
  async signup(@Args('data') data: SignupInput) {
    const { accessToken, refreshToken } = await this.auth.createUser(data);
    return {
      accessToken,
      refreshToken,
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

  @Mutation(() => Token)
  async validateOTP(@Args('data') { id, otp, phone }: LoginInput) {
    console.log('OTP recieved for login:', otp);
    const user = await this.userService.createUserIfDoesntExist(id);
    try {
      const msg91Instance = msg91.getOTP(templateId, { length: otpLength });
      const result = await msg91Instance.verify(phone, otp);
      console.log('result', result);
    } catch (error) {
      console.log('error validating OTP', error?.response);
    }
    const { accessToken, refreshToken } = await this.auth.generateTokens({
      userId: user.id,
    });

    return {
      accessToken,
      refreshToken,
    };
  }
  @Mutation(() => String)
  async requestOTP(@Args('data') { id, phone }: LoginInput) {
    console.log('Requesting OTP on: ', phone, ' id: ', id);
    const otp = msg91.getOTP(templateId, { length: otpLength });
    console.log('otp', otp, msg91);
    const result = await otp.send(phone, {
      templateId: templateId,
      length: otpLength,
    });
    console.log('result', result);
    return 'ok';
  }
}
