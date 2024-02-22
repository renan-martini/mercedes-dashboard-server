import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Delete,
  Query,
  Body,
} from '@nestjs/common';
import { LegsService } from './legs.service';
import { UpdateLegDto } from './dto/update-leg.dto';

@Controller('legs')
export class LegsController {
  constructor(private readonly legsService: LegsService) {}

  @Post()
  create() {
    return this.legsService.create();
  }

  @Get()
  findAll(@Query('period') period: 'WEEK' | 'ALL') {
    return this.legsService.findAll(period);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.legsService.findOne(id);
  }

  @Patch()
  update(@Body() updateLegDto: UpdateLegDto) {
    return this.legsService.update(updateLegDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.legsService.remove(id);
  }

  @Delete('/history/:id')
  deleteHistory(@Param('id') id: string) {
    return this.legsService.deleteHistory(id);
  }
}
