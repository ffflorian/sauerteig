import {Controller, Get, HttpCode} from '@nestjs/common';
import {SkipThrottle} from '@nestjs/throttler';

@Controller('_health')
@SkipThrottle()
export class HealthController {
  @Get()
  @HttpCode(200)
  check(): void {}
}
