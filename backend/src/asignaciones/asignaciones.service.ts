import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAsignacionDto, UpdateAsignacionDto } from './dto/asignacion.dto';

@Injectable()
export class AsignacionesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateAsignacionDto) {
    return this.prisma.asignacion.create({
      data: dto,
      include: {
        profesor: true,
        curso: true,
        materia: true,
        aula: true,
      },
    });
  }

  async findAll() {
    return this.prisma.asignacion.findMany({
      include: {
        profesor: true,
        curso: true,
        materia: true,
        aula: true,
      },
    });
  }

  async findOne(id: number) {
    const asignacion = await this.prisma.asignacion.findUnique({
      where: { id },
      include: {
        profesor: true,
        curso: true,
        materia: true,
        aula: true,
      },
    });
    if (!asignacion) {
      throw new NotFoundException(`Asignacion with id ${id} not found`);
    }
    return asignacion;
  }

  async update(id: number, dto: UpdateAsignacionDto) {
    const asignacion = await this.findOne(id);
    return this.prisma.asignacion.update({
      where: { id },
      data: dto,
      include: {
        profesor: true,
        curso: true,
        materia: true,
        aula: true,
      },
    });
  }

  async remove(id: number) {
    const asignacion = await this.findOne(id);
    return this.prisma.asignacion.delete({
      where: { id },
    });
  }
}
