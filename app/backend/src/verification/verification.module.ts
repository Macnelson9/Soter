import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { VerificationController } from './verification.controller';
import { VerificationService } from './verification.service';
import { VerificationProcessor } from './verification.processor';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    BullModule.registerQueueAsync({
      name: 'verification',
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('REDIS_HOST') || 'localhost',
          port: parseInt(configService.get<string>('REDIS_PORT') || '6379'),
        },
        defaultJobOptions: {
          removeOnComplete: 100,
          removeOnFail: 50,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [VerificationController],
  providers: [VerificationService, VerificationProcessor],
  exports: [VerificationService],
})
export class VerificationModule {}
