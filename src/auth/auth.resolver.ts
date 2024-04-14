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
    //TODO: check if userId, if not throw
    console.log('Refresh accessToken for user:', userId);
    return this.auth.refreshToken(token);
  }

  @ResolveField('user', () => User)
  async user(@Parent() auth: Auth) {
    return await this.auth.getUserFromToken(auth.accessToken);
  }

  @Mutation(() => Token)
  async validateOTP(@Args('data') { id, otp }: LoginInput) {
    // TODO: Double check with external OTP provider here.
    console.log('OTP recieved for login:', otp);
    const user = await this.userService.createUserIfDoesntExist(id);
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
    // TODO: Use the third party provider to request for OTP to the given phone number.
    console.log('Requesting OTP on: ', phone, ' id: ', id);
    return 'ok';
  }
}
