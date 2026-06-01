import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMateriaDto, UpdateMateriaDto } from './dto/materia.dto';

@Injectable()
export class MateriasService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateMateriaDto) {
    return this.prisma.materia.create({
      data: dto,
    });
  }

  async findAll() {
    return this.prisma.materia.findMany({
      include: {
        asignaciones: {
          include: {
            profesor: true,
            curso: true,
            aula: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const materia = await this.prisma.materia.findUnique({
      where: { id },
      include: {
        asignaciones: {
          include: {
            profesor: true,
            curso: true,
            aula: true,
          },
        },
      },
    });
    if (!materia) {
      throw new NotFoundException(`Materia with id ${id} not found`);
    }
    return materia;
  }

  async update(id: number, dto: UpdateMateriaDto) {
    const materia = await this.findOne(id);
    return this.prisma.materia.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    const materia = await this.findOne(id);
    return this.prisma.materia.delete({
      where: { id },
    });
  }
}
