import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCursoDto, UpdateCursoDto } from './dto/curso.dto';

@Injectable()
export class CursosService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCursoDto) {
    return this.prisma.curso.create({
      data: dto,
    });
  }

  async findAll() {
    return this.prisma.curso.findMany({
      include: {
        estudiantes: true,
        asignaciones: {
          include: {
            profesor: true,
            materia: true,
            aula: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const curso = await this.prisma.curso.findUnique({
      where: { id },
      include: {
        estudiantes: true,
        asignaciones: {
          include: {
            profesor: true,
            materia: true,
            aula: true,
          },
        },
      },
    });
    if (!curso) {
      throw new NotFoundException(`Curso with id ${id} not found`);
    }
    return curso;
  }

  async update(id: number, dto: UpdateCursoDto) {
    const curso = await this.findOne(id);
    return this.prisma.curso.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    const curso = await this.findOne(id);
    return this.prisma.curso.delete({
      where: { id },
    });
  }
}
