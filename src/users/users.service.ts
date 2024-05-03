import { PrismaService } from 'nestjs-prisma';
import { Injectable, BadRequestException } from '@nestjs/common';
import { PasswordService } from '../auth/password.service';
import { ChangePasswordInput } from './dto/change-password.input';
import { SignupInput } from 'src/auth/dto/signup.input';
import { ConfigService } from '@nestjs/config';
import { SecurityConfig } from 'src/common/configs/config.interface';
import { User } from './models/user.model';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private passwordService: PasswordService,
    private readonly configService: ConfigService,
  ) {}

  async updateUser(userId: string, newUserData: SignupInput) {
    return this.prisma.user.upsert({
      update: newUserData,
      create: {
        ...newUserData,
        password:
          this.configService.get<SecurityConfig>('security').defaultPassword,
      },
      where: {
        id: userId,
      },
    });
  }

  async createUserIfDoesntExist(id: string, userInput?: Partial<SignupInput>) {
    let user = await this.prisma.user.findFirst({ where: { id: id } });
    if (!user) {
      user = await this.updateUser(id, {
        id: id,
        phone: id,
        email: userInput?.email,
        country: userInput?.country || '',
        tAndCConsent: userInput?.tAndCConsent || false,
      });
    }
    return user;
  }

  async blockUsersForId(id: string, users: string[]) {
    console.log('DEBUG', id, users);
    return await this.prisma.user.update({
      where: { id: id },
      data: {
        blockedListUserIds: users,
      },
    });
  }
  async changePassword(
    userId: string,
    userPassword: string,
    changePassword: ChangePasswordInput,
  ) {
    const passwordValid = await this.passwordService.validatePassword(
      changePassword.oldPassword,
      userPassword,
    );

    if (!passwordValid) {
      throw new BadRequestException('Invalid password');
    }

    const hashedPassword = await this.passwordService.hashPassword(
      changePassword.newPassword,
    );

    return this.prisma.user.update({
      data: {
        password: hashedPassword,
      },
      where: { id: userId },
    });
  }
}
