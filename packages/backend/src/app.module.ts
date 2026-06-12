import {Module} from '@nestjs/common';
import {APP_GUARD} from '@nestjs/core';
import {MongooseModule} from '@nestjs/mongoose';
import {ScheduleModule} from '@nestjs/schedule';
import {ThrottlerGuard, ThrottlerModule} from '@nestjs/throttler';

import {MONGODB_URI} from './config/config.js';
import {HealthController} from './health/health.controller.js';
import {PushModule} from './push/push.module.js';

@Module({
  controllers: [HealthController],
  imports: [
    MongooseModule.forRoot(MONGODB_URI),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot([{limit: 100, name: 'default', ttl: 60_000}]),
    PushModule,
  ],
  providers: [{provide: APP_GUARD, useClass: ThrottlerGuard}],
})
export class AppModule {}
