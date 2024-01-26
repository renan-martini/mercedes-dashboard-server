import { IsNotEmpty } from 'class-validator';

export class CreateBaumsterDto {
  @IsNotEmpty()
  code: string;
  @IsNotEmpty()
  projectName: string;
}
