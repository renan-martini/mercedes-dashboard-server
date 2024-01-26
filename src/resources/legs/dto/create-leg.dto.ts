import { IsEnum, IsOptional } from 'class-validator';
enum STATUS {
  DEV,
  CALCULUS,
  VALIDATION,
  HOMOLOGATION,
  BLANK,
  SOP,
}
export class CreateLegDto {
  @IsEnum(STATUS)
  @IsOptional()
  currentStatus?: STATUS;

  currentDetails?: string;
}
