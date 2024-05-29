import { Module } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { NotificationService } from 'src/request/notifications.service';

@Module({
  imports: [],
  providers: [NotificationService, PrismaService],
})
export class FirebaseModule {}
