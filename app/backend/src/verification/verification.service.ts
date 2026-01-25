import { Injectable } from '@nestjs/common';
import { CreateVerificationDto } from './dto/create-verification.dto';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class VerificationService {
  constructor(private auditService: AuditService) {}

  async create(createVerificationDto: CreateVerificationDto) {
    const verificationId = 'mock-v-id'; // In real app, this would be from DB
    await this.auditService.record({
      actorId: 'system', // Should be from request user
      entity: 'verification',
      entityId: verificationId,
      action: 'enqueue',
      metadata: { ...createVerificationDto },
    });
    return { id: verificationId, message: 'Verification enqueued' };
  }

  async findAll() {
    return Promise.resolve([]);
  }

  async findOne(id: string) {
    return Promise.resolve({ id, status: 'pending' });
  }

  async findByUser(_userId: string) {
    return Promise.resolve([]);
  }

  async update(id: string, updateVerificationDto: Record<string, unknown>) {
    await this.auditService.record({
      actorId: 'system',
      entity: 'verification',
      entityId: id,
      action: 'complete',
      metadata: updateVerificationDto,
    });
    return { id, message: 'Verification completed' };
  }

  async remove(id: string) {
    return Promise.resolve({ id, message: 'Removed' });
  }
}
