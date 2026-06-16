import {Body, Controller, Delete, HttpCode, HttpStatus, Param, Post} from '@nestjs/common';

import {PushService} from './push.service.js';

interface ScheduleDto {
  expiresAt: number;
  label: string;
  subscription: {
    endpoint: string;
    keys: {auth: string; p256dh: string};
  };
}

@Controller('push')
export class PushController {
  constructor(private readonly pushService: PushService) {}

  @Delete('schedule/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async cancel(@Param('id') id: string): Promise<void> {
    await this.pushService.cancel(id);
  }

  @Post('schedule')
  async schedule(@Body() dto: ScheduleDto): Promise<{timerId: string}> {
    const timerId = await this.pushService.schedule(dto.subscription, new Date(dto.expiresAt), dto.label);
    return {timerId};
  }
}
