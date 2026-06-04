import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAsignacionDto, UpdateAsignacionDto } from './dto/asignacion.dto';

@Injectable()
export class AsignacionesService {
  constructor(private prisma: PrismaService) {}

  private validateTimeRange(horaInicio: string, horaFin: string) {
    // Convert HH:MM to minutes for comparison
    const [startHours, startMinutes] = horaInicio.split(':').map(Number);
    const [endHours, endMinutes] = horaFin.split(':').map(Number);
    
    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = endHours * 60 + endMinutes;
    
    if (endTotalMinutes <= startTotalMinutes) {
      throw new BadRequestException('La hora de finalización debe ser posterior a la hora de inicio.');
    }
  }

  async create(dto: CreateAsignacionDto) {
    this.validateTimeRange(dto.horaInicio, dto.horaFin);
    
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
    
    // Validate time range if both times are provided, otherwise use existing values
    const horaInicio = dto.horaInicio ?? asignacion.horaInicio;
    const horaFin = dto.horaFin ?? asignacion.horaFin;
    this.validateTimeRange(horaInicio, horaFin);
    
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
