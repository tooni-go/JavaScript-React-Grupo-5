import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProfesorDto, UpdateProfesorDto } from './dto/profesor.dto';

@Injectable()
export class ProfesoresService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateProfesorDto) {
    return this.prisma.profesor.create({
      data: dto,
      include: {
        usuario: true,
      },
    });
  }

  async findAll() {
    return this.prisma.profesor.findMany({
      include: {
        usuario: true,
      },
    });
  }

  async findOne(id: number) {
    const profesor = await this.prisma.profesor.findUnique({
      where: { id },
      include: {
        usuario: true,
      },
    });
    if (!profesor) {
      throw new NotFoundException(`Profesor with id ${id} not found`);
    }
    return profesor;
  }

  async findByUserId(userId: string) {
    const profesor = await this.prisma.profesor.findUnique({
      where: { userId },
      include: {
        usuario: true,
      },
    });
    if (!profesor) {
      throw new NotFoundException(`Profesor with userId ${userId} not found`);
    }
    return profesor;
  }

  async update(id: number, dto: UpdateProfesorDto) {
    const profesor = await this.findOne(id);
    return this.prisma.profesor.update({
      where: { id },
      data: dto,
      include: {
        usuario: true,
      },
    });
  }

  async remove(id: number) {
    const profesor = await this.findOne(id);
    return this.prisma.profesor.delete({
      where: { id },
    });
  }
}
