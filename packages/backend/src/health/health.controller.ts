import {Controller, Get, HttpCode} from '@nestjs/common';

@Controller('_health')
export class HealthController {
  @Get()
  @HttpCode(200)
  check(): void {}
}
