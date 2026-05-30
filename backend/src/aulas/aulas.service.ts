import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAulaDto, UpdateAulaDto } from './dto/aula.dto';

@Injectable()
export class AulasService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateAulaDto) {
    return this.prisma.aula.create({
      data: dto,
    });
  }

  async findAll() {
    return this.prisma.aula.findMany({
      include: {
        asignaciones: {
          include: {
            profesor: true,
            curso: true,
            materia: true,
          },
        },
        charlas: {
          include: {
            organizador: true,
            participantes: true,
          },
        },
      },
    });
  }

  async findByNombre(nombre: string) {
    const aula = await this.prisma.aula.findFirst({
      where: { nombre },
      include: {
        asignaciones: {
          include: {
            profesor: true,
            curso: true,
            materia: true,
          },
        },
        charlas: {
          include: {
            organizador: true,
            participantes: true,
          },
        },
      },
    });
    if (!aula) {
      throw new NotFoundException(`Aula with nombre ${nombre} not found`);
    }
    return aula;
  }

  async findOne(id: number) {
    const aula = await this.prisma.aula.findUnique({
      where: { id },
      include: {
        asignaciones: {
          include: {
            profesor: true,
            curso: true,
            materia: true,
          },
        },
        charlas: {
          include: {
            organizador: true,
            participantes: true,
          },
        },
      },
    });
    if (!aula) {
      throw new NotFoundException(`Aula with id ${id} not found`);
    }
    return aula;
  }

  async update(id: number, dto: UpdateAulaDto) {
    const aula = await this.findOne(id);
    return this.prisma.aula.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    const aula = await this.findOne(id);
    return this.prisma.aula.delete({
      where: { id },
    });
  }
}
