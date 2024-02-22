import { IsDateString, IsEnum, IsOptional } from 'class-validator';
enum STATUS {
  DEV,
  CALCULUS,
  VALIDATION,
  HOMOLOGATION,
  BLANK,
  SOP,
}
export class CreateLegDto {
  baumster: string;

  leg: string;

  project: string;

  @IsEnum(STATUS)
  @IsOptional()
  currentStatus?: STATUS;

  currentDetails?: string;

  @IsDateString()
  updatedAt: Date;

  @IsDateString()
  @IsOptional()
  expectedDate: Date;
}
