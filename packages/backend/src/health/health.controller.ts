import {Controller, Get, HttpCode, HttpStatus} from '@nestjs/common';
import {SkipThrottle} from '@nestjs/throttler';

@Controller('_health')
@SkipThrottle()
export class HealthController {
  @Get()
  @HttpCode(HttpStatus.OK)
  check(): void {}
}
