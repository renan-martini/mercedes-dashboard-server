import { Injectable } from '@nestjs/common';
import { CreateBaumsterDto } from './dto/create-baumster.dto';
import { UpdateBaumsterDto } from './dto/update-baumster.dto';
import { PrismaService } from 'src/db/prisma';

@Injectable()
export class BaumstersService {
  constructor(private prisma: PrismaService) {}

  async create(createBaumsterDto: CreateBaumsterDto[]) {
    const createManyBaumsters = createBaumsterDto.map((bm) =>
      this.prisma.baumster.create({
        data: {
          ...(bm.projectName
            ? {
                project: { connect: { name: bm.projectName } },
              }
            : {}),
          code: bm.code,
        },
      }),
    );
    const bms = await Promise.all(createManyBaumsters);
    return bms;
  }

  findAll() {
    return this.prisma.baumster.findMany({ orderBy: { createdAt: 'desc' } });
  }

  findOne(id: string) {
    return this.prisma.baumster.findUnique({ where: { id } });
  }

  update(id: string, updateBaumsterDto: UpdateBaumsterDto) {
    return this.prisma.baumster.update({
      where: { id },
      data: updateBaumsterDto,
    });
  }

  remove(id: string) {
    return this.prisma.baumster.delete({ where: { id } });
  }
}
