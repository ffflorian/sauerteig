import {Controller, Get} from '@nestjs/common';
import {SkipThrottle} from '@nestjs/throttler';

import {COMMIT, VERSION} from '../config/config.js';

@Controller('info')
@SkipThrottle()
export class InfoController {
  @Get()
  info(): {commit: string; version: string} {
    return {commit: COMMIT, version: VERSION};
  }
}
