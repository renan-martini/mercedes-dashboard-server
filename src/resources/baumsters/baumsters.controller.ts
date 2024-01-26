import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BaumstersService } from './baumsters.service';
import { CreateBaumsterDto } from './dto/create-baumster.dto';
import { UpdateBaumsterDto } from './dto/update-baumster.dto';

@Controller('baumsters')
export class BaumstersController {
  constructor(private readonly baumstersService: BaumstersService) {}

  @Post()
  create(@Body() createBaumsterDto: CreateBaumsterDto[]) {
    return this.baumstersService.create(createBaumsterDto);
  }

  @Get()
  findAll() {
    return this.baumstersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.baumstersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBaumsterDto: UpdateBaumsterDto,
  ) {
    return this.baumstersService.update(id, updateBaumsterDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.baumstersService.remove(id);
  }
}
