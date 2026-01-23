import { Injectable } from '@nestjs/common';
import { CreateVerificationDto } from './dto/create-verification.dto';

@Injectable()
export class VerificationService {
  create(_createVerificationDto: CreateVerificationDto) {
    return 'This action adds a new verification';
  }

  findAll() {
    return `This action returns all verification`;
  }

  findOne(id: string) {
    return `This action returns a #${id} verification`;
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
}
