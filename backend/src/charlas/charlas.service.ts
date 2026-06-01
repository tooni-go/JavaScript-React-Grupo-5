import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCharlaDto, UpdateCharlaDto } from './dto/charla.dto';

@Injectable()
export class CharlasService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCharlaDto) {
    return this.prisma.charla.create({
      data: dto,
      include: {
        aula: true,
        organizador: true,
        participantes: true,
      },
    });
  }

  async findAll() {
    return this.prisma.charla.findMany({
      include: {
        aula: true,
        organizador: true,
        participantes: true,
      },
    });
  }

  async findOne(id: number) {
    const charla = await this.prisma.charla.findUnique({
      where: { id },
      include: {
        aula: true,
        organizador: true,
        participantes: true,
      },
    });
    if (!charla) {
      throw new NotFoundException(`Charla with id ${id} not found`);
    }
    return charla;
  }

  async update(id: number, dto: UpdateCharlaDto) {
    const charla = await this.findOne(id);
    return this.prisma.charla.update({
      where: { id },
      data: dto,
      include: {
        aula: true,
        organizador: true,
        participantes: true,
      },
    });
  }

  async remove(id: number) {
    const charla = await this.findOne(id);
    return this.prisma.charla.delete({
      where: { id },
    });
  }

  async addParticipante(charlaId: number, userId: string) {
    const charla = await this.findOne(charlaId);
    return this.prisma.charla.update({
      where: { id: charlaId },
      data: {
        participantes: {
          connect: { id: userId },
        },
      },
      include: {
        aula: true,
        organizador: true,
        participantes: true,
      },
    });
  }

  async removeParticipante(charlaId: number, userId: string) {
    const charla = await this.findOne(charlaId);
    return this.prisma.charla.update({
      where: { id: charlaId },
      data: {
        participantes: {
          disconnect: { id: userId },
        },
      },
      include: {
        aula: true,
        organizador: true,
        participantes: true,
      },
    });
  }
}
