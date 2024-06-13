import { PrismaService } from 'nestjs-prisma';
import { Injectable, BadRequestException } from '@nestjs/common';
import { PasswordService } from '../auth/password.service';
import { ChangePasswordInput } from './dto/change-password.input';
import { SignupInput } from 'src/auth/dto/signup.input';
import { ConfigService } from '@nestjs/config';
import { SecurityConfig } from 'src/common/configs/config.interface';
import admin from 'firebase-admin';
import { ChatStatus } from '@prisma/client';

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

console.log('serviceAccount', serviceAccount);

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private passwordService: PasswordService,
    private readonly configService: ConfigService,
  ) {
    if (!admin.apps.length) {
      admin.initializeApp(
        {
          credential: admin.credential.cert(
            serviceAccount as admin.ServiceAccount,
          ),
        },
        'unswipe',
      );
    }
  }

  async upsertChatRoom(data: { roomId: string; userId: string }) {
    // First, set all chats with the same userId but different roomId to INACTIVE
    await this.prisma.chat.updateMany({
      where: {
        userId: data.userId,
        NOT: {
          roomId: data.roomId,
        },
      },
      data: {
        status: ChatStatus.INACTIVE,
      },
    });

    // Then, create the chat with the given roomId and userId to ACTIVE
    const chat = await this.prisma.chat.create({
      data: {
        roomId: data.roomId,
        userId: data.userId,
        status: ChatStatus.ACTIVE,
      },
    });
    return chat;
  }

  async updateUser(userId: string, newUserData: SignupInput) {
    const currentUser = await this.prisma.user.findUnique({
      select: {
        fcmRegisterationTokens: true,
        },
        where: {
        id: userId,
      },
    });
    const existingTokenIds =
      currentUser?.fcmRegisterationTokens.map((token) => token) ?? [];
    let newTokenIds = existingTokenIds || [];
    if (newUserData?.fcmRegisterationToken) {
      newTokenIds = Array.from(
        new Set([...existingTokenIds, newUserData?.fcmRegisterationToken]),
      );
      delete newUserData?.fcmRegisterationToken;
    }

    return this.prisma.user.upsert({
      update: newUserData,
      create: {
        ...newUserData,
        fcmRegisterationTokens: {
          set: newTokenIds,
        },
        password:
          this.configService.get<SecurityConfig>('security').defaultPassword,
      },
      where: {
        id: userId,
      },
    });
  }

  private async getFirebaseCustomToken(id: string) {
    let app;
    if (!admin.apps.length) {
      app = admin.initializeApp(
        {
          credential: admin.credential.cert(
            serviceAccount as admin.ServiceAccount
          ),
        },
        'unswipe'
      );
    } else {
      app = admin.app('unswipe');
    }
    const firebaseCustomToken = await app.auth().createCustomToken(id);
    return firebaseCustomToken;
  }

  async createUserIfDoesntExist(id: string, userInput?: Partial<SignupInput>) {
    let user = await this.prisma.user.findFirst({ where: { id: id } });
    if (!user) {
      const firebaseCustomToken = await this.getFirebaseCustomToken(id);
      user = await this.updateUser(id, {
        id: id,
        phone: id,
        email: userInput?.email,
        country: userInput?.country || '',
        tAndCConsent: userInput?.tAndCConsent || false,
        firebaseCustomToken: firebaseCustomToken,
        fcmRegisterationToken: userInput?.fcmRegisterationToken,
      });
    } else {
      const firebaseCustomToken = await this.getFirebaseCustomToken(id);
      user = await this.prisma.user.update({
        data: {
          firebaseCustomToken: firebaseCustomToken,
        },
        where: { id: id },
      })
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
