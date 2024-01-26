import { Module } from '@nestjs/common';
import { BaumstersService } from './baumsters.service';
import { BaumstersController } from './baumsters.controller';
import { PrismaService } from 'src/db/prisma';

@Module({
  controllers: [BaumstersController],
  providers: [BaumstersService, PrismaService],
})
export class BaumstersModule {}
