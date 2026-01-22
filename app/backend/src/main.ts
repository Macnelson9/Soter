import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config as loadEnv } from 'dotenv';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

async function bootstrap() {
  const candidates = [
    join(process.cwd(), '.env'),
    join(process.cwd(), 'app', 'backend', '.env'),
    join(__dirname, '..', '.env'),
  ];

  const envPath = candidates.find((p) => existsSync(p));
  if (envPath) {
    loadEnv({ path: envPath });
  }

  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
