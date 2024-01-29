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
    const legs = !['ALL', undefined].includes(period)
      ? await this.prisma.history.findMany({
          where: { date: { gte: startsAt, lt: finishesAt } },
          orderBy: { date: 'desc' },
          include: {
            leg: { include: { baumster: { include: { project: true } } } },
          },
        })
      : await this.prisma.leg.findMany({
          where: {
            NOT: {
              AND: {
                currentDetails: '',
                currentStatus: '',
                updatedAt: null,
              },
            },
          },
          include: {
            baumster: {
              include: {
                project: true,
              },
            },
            history: { orderBy: { date: 'desc' } },
          },
        });

    if (['ALL', undefined].includes(period)) {
      legs.sort((a, b) => {
        if (a.updatedAt > b.updatedAt) return -1;
        if (a.updatedAt == b.updatedAt) return 0;
        return 1;
      });
    }

    return legs;
  }

  findOne(id: string) {
    return this.prisma.leg.findFirstOrThrow({ where: { id } });
  }

  async update(id: string, updateLegDto: UpdateLegDto) {
    const date =
      new Date(updateLegDto.updatedAt + 'T12:00:00.00-0300') ?? new Date();

    const expectedDate =
      new Date(updateLegDto.expectedDate + 'T12:00:00.00-0300') ?? undefined;
    await this.prisma.history.create({
      data: {
        date,
        expectedDate,
        details: updateLegDto.currentDetails,
        status: updateLegDto.currentStatus as unknown as string,
        leg: { connect: { id } },
      },
    });

    return this.prisma.leg.update({
      where: { id },
      data: {
        ...updateLegDto,
        updatedAt: date,
        currentStatus: updateLegDto.currentStatus as unknown as string,
      },
    });
  }

  remove(id: string) {
    return this.prisma.leg.delete({ where: { id } });
  }
}
