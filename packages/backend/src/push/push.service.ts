import {Injectable, Logger} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model, Types} from 'mongoose';
import webpush from 'web-push';

import {VAPID_PRIVATE_KEY, VAPID_PUBLIC_KEY, VAPID_SUBJECT} from '../config/config.js';
import {ScheduledNotification, ScheduledNotificationDocument} from './subscription.schema.js';

@Injectable()
export class PushService {
  private readonly logger = new Logger(PushService.name);

  constructor(
    @InjectModel(ScheduledNotification.name)
    private readonly model: Model<ScheduledNotificationDocument>
  ) {
    webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
  }

  async cancel(id: string): Promise<void> {
    await this.model.findByIdAndDelete(id);
  }

  async schedule(
    subscription: {endpoint: string; keys: {auth: string; p256dh: string}},
    expiresAt: Date,
    label: string
  ): Promise<string> {
    const doc = await this.model.create({
      auth: subscription.keys.auth,
      endpoint: subscription.endpoint,
      expiresAt,
      label,
      p256dh: subscription.keys.p256dh,
    });
    return (doc._id as Types.ObjectId).toString();
  }

  async sendDue(): Promise<void> {
    const due = await this.model.find({expiresAt: {$lte: new Date()}, sent: false});

    for (const doc of due) {
      try {
        await webpush.sendNotification(
          {endpoint: doc.endpoint, keys: {auth: doc.auth, p256dh: doc.p256dh}},
          JSON.stringify({
            body: `Die Wartezeit von ${doc.label} ist abgelaufen!`,
            title: 'Sauerteig-Erinnerung',
          })
        );
        await this.model.findByIdAndDelete(doc._id);
      } catch (error) {
        const statusCode = (error as {statusCode?: number}).statusCode;
        this.logger.error(`Failed to send push for ${String(doc._id)}: ${String(error)}`);
        if (statusCode === 404 || statusCode === 410) {
          await this.model.findByIdAndDelete(doc._id);
        }
      }
    }
  }
}
