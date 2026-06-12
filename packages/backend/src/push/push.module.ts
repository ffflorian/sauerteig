import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';

import {PushController} from './push.controller.js';
import {PushScheduler} from './push.scheduler.js';
import {PushService} from './push.service.js';
import {ScheduledNotification, ScheduledNotificationSchema} from './subscription.schema.js';

@Module({
  controllers: [PushController],
  imports: [MongooseModule.forFeature([{name: ScheduledNotification.name, schema: ScheduledNotificationSchema}])],
  providers: [PushScheduler, PushService],
})
export class PushModule {}
