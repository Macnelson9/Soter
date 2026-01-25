import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CampaignStatus } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateCampaignDto {
  @ApiProperty({ example: 'Winter Relief 2026' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 25000.5, minimum: 0 })
  @IsNumber()
  @Min(0)
  budget!: number;

  @ApiPropertyOptional({
    example: { region: 'Lagos', partner: 'NGO-A', notes: 'Phase 1' },
    description: 'Arbitrary JSON object; must be an object (not array/string).',
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;

  @ApiPropertyOptional({ enum: CampaignStatus, example: CampaignStatus.draft })
  @IsOptional()
  @IsEnum(CampaignStatus)
  status?: CampaignStatus;
}
