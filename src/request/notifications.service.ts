import { Injectable } from '@nestjs/common';
import admin from 'firebase-admin';

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

interface Notification {
  title: string;
  body: string;
}

interface DataPayload {
  [key: string]: string;
}

interface Message {
  token: string;
  notification: Notification;
  data?: DataPayload;
}

@Injectable()
export class NotificationService {
  async sendMessage(message: Message) {
    let app;
    if (!admin.apps.length) {
      app = admin.initializeApp(
        {
          credential: admin.credential.cert(
            serviceAccount as admin.ServiceAccount,
          ),
        },
        'unswipe',
      );
    } else {
      app = admin.app('unswipe');
    }
    return await app.messaging().send(message);
  }
}
