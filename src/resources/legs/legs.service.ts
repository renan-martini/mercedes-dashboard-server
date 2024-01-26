import { Injectable } from '@nestjs/common';
import * as Baumsters from '../../../baumsters.json';
import { PrismaService } from 'src/db/prisma';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { DateUtility } from 'src/utils/DateUtility';
import { UpdateLegDto } from './dto/update-leg.dto';

@Injectable()
export class LegsService {
  constructor(private prisma: PrismaService) {}

  async create() {
    const legsNames = [
      'L1J',
      'L1F',
      'L1K',
      'L1P',
      'L1R',
      'L1T',
      'L2T',
      'L3A/L3B',
      'L4N',
    ];
    const promises: Prisma.Prisma__LegClient<
      {
        id: string;
        name: string;
        currentStatus: string;
        currentDetails: string;
        updatedAt: Date;
        createdAt: Date;
        baumsterId: string;
      },
      never,
      DefaultArgs
    >[] = [];
    Baumsters.forEach((bm) => {
      legsNames.forEach((leg) => {
        const promise = this.prisma.leg.create({
          data: { name: leg, baumster: { connect: { code: bm.code } } },
        });
        promises.push(promise);
      });
    });

    await Promise.all(promises);

    return 'This action adds a new leg';
  }

  async findAll(period: 'WEEK' | 'ALL') {
    const startsAt = period === 'WEEK' ? DateUtility.lastSunday() : undefined;

    const finishesAt = period === 'WEEK' ? DateUtility.nextSunday() : undefined;
    const legs = await this.prisma.leg.findMany({
      ...(!['ALL', undefined].includes(period)
        ? { where: { updatedAt: { gte: startsAt, lt: finishesAt } } }
        : {}),
      orderBy: { updatedAt: 'desc' },
      include: {
        baumster: { include: { project: true } },
      },
    });

    return legs;
  }

  findOne(id: string) {
    return this.prisma.leg.findFirstOrThrow({ where: { id } });
  }

  async update(id: string, updateLegDto: UpdateLegDto) {
    const leg = await this.prisma.leg.findFirst({ where: { id } });
    if (updateLegDto.currentDetails || updateLegDto.currentStatus) {
      await this.prisma.history.create({
        data: {
          date: leg.updatedAt ?? new Date(),
          details: leg.currentDetails,
          status: leg.currentStatus,
          leg: { connect: { id } },
        },
      });
    }
    return this.prisma.leg.update({
      where: { id },
      data: {
        ...updateLegDto,
        currentStatus: updateLegDto.currentStatus as unknown as string,
      },
    });
  }

  remove(id: string) {
    return this.prisma.leg.delete({ where: { id } });
  }
}
