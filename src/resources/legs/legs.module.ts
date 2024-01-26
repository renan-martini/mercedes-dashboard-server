import { Module } from '@nestjs/common';
import { LegsService } from './legs.service';
import { LegsController } from './legs.controller';
import { PrismaService } from 'src/db/prisma';

@Module({
  controllers: [LegsController],
  providers: [LegsService, PrismaService],
})
export class LegsModule {}
