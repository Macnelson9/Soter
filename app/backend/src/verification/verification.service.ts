import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVerificationDto } from './dto/create-verification.dto';
import {
  VerificationJobData,
  VerificationResult,
} from './interfaces/verification-job.interface';

@Injectable()
export class VerificationService {
  private readonly logger = new Logger(VerificationService.name);
  private readonly verificationMode: string;
  private readonly verificationThreshold: number;

  constructor(
    @InjectQueue('verification') private verificationQueue: Queue,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.verificationMode =
      this.configService.get<string>('VERIFICATION_MODE') || 'mock';
    this.verificationThreshold =
      parseFloat(
        this.configService.get<string>('VERIFICATION_THRESHOLD') || '0.7',
      ) || 0.7;
  }

  async enqueueVerification(claimId: string): Promise<{ jobId: string }> {
    const claim = await this.prisma.claim.findUnique({
      where: { id: claimId },
    });

    if (!claim) {
      throw new NotFoundException(`Claim with ID ${claimId} not found`);
    }

    if (claim.status === 'verified') {
      this.logger.warn(`Claim ${claimId} is already verified`);
      return { jobId: 'already-verified' };
    }

    const jobData: VerificationJobData = {
      claimId,
      timestamp: Date.now(),
    };

    const job = await this.verificationQueue.add('verify-claim', jobData, {
      attempts: parseInt(
        this.configService.get<string>('QUEUE_MAX_RETRIES') || '3',
      ),
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
      removeOnComplete: 100,
      removeOnFail: 50,
    });

    this.logger.log(`Enqueued verification job ${job.id} for claim ${claimId}`);

    return { jobId: job.id || 'unknown' };
  }

  async processVerification(
    jobData: VerificationJobData,
  ): Promise<VerificationResult> {
    const { claimId } = jobData;

    this.logger.log(
      `Processing verification for claim ${claimId} in ${this.verificationMode} mode`,
    );

    const claim = await this.prisma.claim.findUnique({
      where: { id: claimId },
    });

    if (!claim) {
      throw new NotFoundException(`Claim with ID ${claimId} not found`);
    }

    let result: VerificationResult;

    if (this.verificationMode === 'mock') {
      result = this.generateMockVerification(claim);
    } else {
      result = await this.performAIVerification(claim);
    }

    const shouldVerify = result.score >= this.verificationThreshold;

    await this.prisma.claim.update({
      where: { id: claimId },
      data: {
        status: shouldVerify ? 'verified' : 'pending',
        verificationScore: result.score,
        verificationResult: result as unknown as Record<string, unknown>,
        verifiedAt: shouldVerify ? new Date() : null,
      },
    });

    this.logger.log(
      `Claim ${claimId} verification completed with score ${result.score} (threshold: ${this.verificationThreshold})`,
    );

    return result;
  }

  private generateMockVerification(_claim: unknown): VerificationResult {
    const baseScore = 0.6 + Math.random() * 0.35;
    const score = Math.min(0.95, Math.max(0.5, baseScore));

    const factors = [
      'Document authenticity verified',
      'Identity cross-reference passed',
      'Historical data consistent',
      'No fraud indicators detected',
    ];

    const riskLevel: 'low' | 'medium' | 'high' =
      score >= 0.8 ? 'low' : score >= 0.65 ? 'medium' : 'high';

    return {
      score: parseFloat(score.toFixed(3)),
      confidence: parseFloat((0.85 + Math.random() * 0.1).toFixed(3)),
      details: {
        factors: factors.slice(0, Math.floor(Math.random() * 2) + 2),
        riskLevel,
        recommendations:
          riskLevel !== 'low'
            ? [
                'Manual review recommended',
                'Additional documentation may be required',
              ]
            : undefined,
      },
      processedAt: new Date(),
    };
  }

  private performAIVerification(_claim: unknown): Promise<VerificationResult> {
    throw new Error(
      'AI verification mode not yet implemented. Use VERIFICATION_MODE=mock',
    );
  }

  create(_createVerificationDto: CreateVerificationDto) {
    return 'This action adds a new verification';
  }

  findAll() {
    return `This action returns all verification`;
  }

  async findOne(id: string) {
    const claim = await this.prisma.claim.findUnique({
      where: { id },
    });

    if (!claim) {
      throw new NotFoundException(`Claim with ID ${id} not found`);
    }

    return claim;
  }

  findByUser(userId: string) {
    return `This action returns verification for user #${userId}`;
  }

  update(id: string, _updateVerificationDto: any) {
    return `This action updates a #${id} verification`;
  }

  remove(id: string) {
    return `This action removes a #${id} verification`;
  }

  async getQueueMetrics() {
    const [waiting, active, completed, failed] = await Promise.all([
      this.verificationQueue.getWaitingCount(),
      this.verificationQueue.getActiveCount(),
      this.verificationQueue.getCompletedCount(),
      this.verificationQueue.getFailedCount(),
    ]);

    return {
      waiting,
      active,
      completed,
      failed,
      total: waiting + active + completed + failed,
    };
  }
}
