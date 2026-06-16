import {HttpStatus, Injectable, Logger} from '@nestjs/common';
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
    if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
      this.logger.error('VAPID keys are not configured; push notifications will not be sent');
      return;
    }
    webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
  }

  async cancel(id: string): Promise<void> {
    const deleted = await this.model.findByIdAndDelete(id);
    if (deleted) {
      this.logger.log(`Cancelled scheduled push ${id}`);
    } else {
      this.logger.warn(`Cancel requested for unknown push ${id}`);
    }
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
    const id = (doc._id as Types.ObjectId).toString();
    this.logger.log(`Scheduled push ${id} for ${expiresAt.toISOString()}`);
    return id;
  }

  async sendDue(): Promise<void> {
    const due = await this.model.find({expiresAt: {$lte: new Date()}, sent: false});
    if (due.length === 0) {
      return;
    }
    this.logger.log(`Sending ${due.length} due push notification(s)`);

    for (const doc of due) {
      try {
        await webpush.sendNotification(
          {endpoint: doc.endpoint, keys: {auth: doc.auth, p256dh: doc.p256dh}},
          JSON.stringify({
            body: `Die Wartezeit von ${doc.label} ist abgelaufen!`,
            title: 'Sauerteig-Erinnerung',
          })
        );
        this.logger.log(`Sent push ${String(doc._id)}`);
        await this.model.findByIdAndDelete(doc._id);
      } catch (error) {
        const statusCode = (error as {statusCode?: number}).statusCode;
        const body = (error as {body?: string}).body;
        this.logger.error(
          `Failed to send push for ${String(doc._id)} (status ${String(statusCode)}): ${String(error)}${body ? ` - ${body}` : ''}`
        );
        if (statusCode === HttpStatus.NOT_FOUND || statusCode === HttpStatus.GONE) {
          await this.model.findByIdAndDelete(doc._id);
          this.logger.warn(`Removed expired subscription ${String(doc._id)}`);
        }
      }
    }
  }
}
