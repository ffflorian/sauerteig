import {Injectable, Logger} from '@nestjs/common';
import {Cron, CronExpression} from '@nestjs/schedule';

import {PushService} from './push.service.js';

@Injectable()
export class PushScheduler {
  private readonly logger = new Logger(PushScheduler.name);

  constructor(private readonly pushService: PushService) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async sendDue(): Promise<void> {
    this.logger.debug('Checking for due notifications');
    await this.pushService.sendDue();
  }
}
