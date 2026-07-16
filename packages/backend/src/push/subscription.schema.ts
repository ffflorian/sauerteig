import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';

export type ScheduledNotificationDocument = Document & ScheduledNotification;

@Schema()
export class ScheduledNotification {
  @Prop({required: true})
  auth!: string;

  @Prop({required: true})
  endpoint!: string;

  @Prop({required: true})
  expiresAt!: Date;

  @Prop({required: true})
  label!: string;

  @Prop({required: true})
  p256dh!: string;

  @Prop({default: false})
  sent!: boolean;
}
export const ScheduledNotificationSchema = SchemaFactory.createForClass(ScheduledNotification);
