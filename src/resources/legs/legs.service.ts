import { HttpException, Injectable } from '@nestjs/common';
import * as Baumsters from '../../../baumsters.json';
import { PrismaService } from 'src/db/prisma';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { DateUtility } from 'src/utils/DateUtility';
import { UpdateLegDto } from './dto/update-leg.dto';

@Injectable()
export class LegsService {
  constructor(private prisma: PrismaService) {}
  legsNames = [
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

  async create() {
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
      this.legsNames.forEach((leg) => {
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

  async update({
    expectedDate: ed,
    baumster,
    project,
    leg,
    ...updateLegDto
  }: UpdateLegDto) {
    const date = new Date(updateLegDto.updatedAt);
    const expectedDate = new Date(ed) ?? undefined;

    const foundProject = await this.prisma.project.findFirst({
      where: { name: project },
    });

    let foundBaumster = await this.prisma.baumster.findFirst({
      where: {
        code: baumster,
        ...(foundProject && { project: { name: project } }),
      },
    });

    if (!foundProject && foundBaumster) {
      const createdProject = await this.prisma.project.create({
        data: { name: project },
      });
      await this.prisma.baumster.update({
        where: { id: foundBaumster.id },
        data: { project: { connect: { id: createdProject.id } } },
      });
    }

    if (!foundBaumster) {
      foundBaumster = await this.prisma.baumster.create({
        data: {
          code: baumster,
          project: {
            connectOrCreate: {
              where: { name: project },
              create: { name: project },
            },
          },
        },
      });

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

      this.legsNames.forEach((leg) => {
        const promise = this.prisma.leg.create({
          data: {
            name: leg,
            baumster: { connect: { code: foundBaumster.code } },
          },
        });
        promises.push(promise);
      });

      await Promise.all(promises);
    }

    const foundLeg = await this.prisma.leg.findFirst({
      where: {
        baumsterId: foundBaumster.id,
        name: leg,
      },
    });

    if (!foundLeg) {
      throw new HttpException('Invalid leg', 404);
    }

    await this.prisma.history.create({
      data: {
        ...(updateLegDto.updatedAt ? { date } : { date: new Date() }),
        ...(ed && { expectedDate }),
        details: updateLegDto.currentDetails,
        status: updateLegDto.currentStatus as unknown as string,
        leg: {
          connect: {
            id: foundLeg.id,
          },
        },
      },
    });

    return this.prisma.leg.update({
      where: { id: foundLeg.id },
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

  async deleteHistory(id: string) {
    const leg = await this.prisma.leg.findFirst({
      where: { history: { some: { id } } },
    });

    await this.prisma.history.delete({ where: { id } });

    const updatedLeg = await this.prisma.leg.findFirst({
      where: { id: leg.id },
      include: { history: { orderBy: { date: 'desc' } } },
    });

    await this.prisma.leg.update({
      where: { id: leg.id },
      data: {
        currentDetails: updatedLeg.history[0]?.details || '',
        currentStatus: updatedLeg.history[0]?.status || '',
        updatedAt: updatedLeg.history[0]?.date || null,
      },
    });
  }
}
