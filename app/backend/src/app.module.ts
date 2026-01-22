import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AidModule } from './aid/aid.module';
import { HealthModule } from './health/health.module';
import { PrismaModule } from './prisma/prisma.module';
import { VerificationModule } from './verification/verification.module';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: (() => {
        const candidates = [
          join(__dirname, '..', '.env'),
          join(process.cwd(), '.env'),
          join(process.cwd(), 'app', 'backend', '.env'),
        ];

        const existing = candidates.filter((p) => existsSync(p));
        return existing.length > 0 ? existing : candidates;
      })(),
    }),
    PrismaModule,
    HealthModule,
    AidModule,
    VerificationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
