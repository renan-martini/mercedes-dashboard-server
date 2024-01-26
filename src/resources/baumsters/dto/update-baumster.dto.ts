import { PartialType } from '@nestjs/mapped-types';
import { CreateBaumsterDto } from './create-baumster.dto';

export class UpdateBaumsterDto extends PartialType(CreateBaumsterDto) {}
