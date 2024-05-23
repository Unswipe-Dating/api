import { PrismaService } from 'nestjs-prisma';
import { Injectable, BadRequestException } from '@nestjs/common';
import { PasswordService } from '../auth/password.service';
import { ChangePasswordInput } from './dto/change-password.input';
import { SignupInput } from 'src/auth/dto/signup.input';
import { ConfigService } from '@nestjs/config';
import { SecurityConfig } from 'src/common/configs/config.interface';
import admin from 'firebase-admin';

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

console.log('serviceAccount', serviceAccount);

@Injectable()
export class UsersService {
  private readonly firebaseApp: any;
  constructor(
    private prisma: PrismaService,
    private passwordService: PasswordService,
    private readonly configService: ConfigService,
  ) {
    if (!admin.apps.length) {
      this.firebaseApp = admin.initializeApp(
        {
          credential: admin.credential.cert(
            serviceAccount as admin.ServiceAccount,
          ),
        },
        'unswipe',
      );
    }
  }

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
      const firebaseCustomToken = await this.firebaseApp
        .auth()
        .createCustomToken(id);
      user = await this.updateUser(id, {
        id: id,
        phone: id,
        email: userInput?.email,
        country: userInput?.country || '',
        tAndCConsent: userInput?.tAndCConsent || false,
        firebaseCustomToken: firebaseCustomToken,
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
