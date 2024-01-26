import { PartialType } from '@nestjs/mapped-types';
import { CreateLegDto } from './create-leg.dto';

export class UpdateLegDto extends PartialType(CreateLegDto) {}
