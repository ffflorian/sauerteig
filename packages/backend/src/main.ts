import {NestFactory} from '@nestjs/core';
import helmet from 'helmet';

import {AppModule} from './app.module.js';
import {FRONTEND_URL, IS_LOCAL, PORT} from './config/config.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.enableCors({origin: IS_LOCAL ? true : FRONTEND_URL});

  await app.listen(PORT);
  console.info(`Server listening on http://localhost:${String(PORT)}`);
}

void bootstrap();
