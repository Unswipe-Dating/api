import { Injectable, OnModuleInit } from '@nestjs/common';
import admin from 'firebase-admin';
import { PrismaService } from 'nestjs-prisma';
import { NotificationService } from 'src/request/notifications.service';

@Injectable()
export class FirebaseService implements OnModuleInit {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}
  private readonly firestore = admin.firestore();
  private readonly messaging = admin.messaging();

  getFirestore() {
    return this.firestore;
  }

  getMessaging() {
    return this.messaging;
  }

  onModuleInit() {
    this.listenForNewMessages();
  }

  private listenForNewMessages() {
    this.firestore
      .collection('rooms')
      .get()
      .then((snapshot) => {
        snapshot.forEach((roomDoc) => {
          const roomId = roomDoc.id;
          this.firestore
            .collection(`rooms/${roomId}/messages`)
            .onSnapshot((snapshot) => {
              snapshot.docChanges().forEach(async (change) => {
                if (change.type === 'added') {
                  const newValue = change.doc.data();
                  const messageId = change.doc.id;
                  // Get the message details
                  const messageText = newValue.text;
                  const sender = newValue.authorId;

                  // Fetch users in the room (assuming you have a collection of users in each room)
                  const roomSnapshot = await this.firestore
                    .collection('rooms')
                    .doc(roomId)
                    .get();
                  const roomData = roomSnapshot.data();

                  // Assuming roomData has a field 'users' which is an array of user IDs
                  const users = (roomData?.userIds as string[]) || [];
                  const sentToUserId = users.filter((u) => u !== sender)[0];
                  const sentToUserProfile =
                    await this.prismaService.profile.findFirst({
                      where: { userId: sentToUserId },
                      include: {
                        user: true,
                      },
                    });

                  const senderUserProfile =
                    await this.prismaService.profile.findFirst({
                      where: { userId: sender },
                    });

                  const tokens = sentToUserProfile.user?.fcmRegisterationTokens;
                  if (tokens && tokens.length) {
                    await Promise.all(
                      tokens.map(
                        async (t) =>
                          await this.notificationService.sendMessage({
                            token: t,
                            notification: {
                              title: `New message from ${senderUserProfile?.name}`,
                              body: messageText,
                            },
                          }),
                      ),
                    );
                  }

                  console.log('Notifications sent for message:', messageId);
                }
              });
            });
        });
      });
  }
}
