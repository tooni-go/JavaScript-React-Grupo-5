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

  async getEstadoActual(id: number) {
    const aula = await this.findOne(id);
    const now = new Date();
    
    // Día actual en español para las asignaciones
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const diaActual = dias[now.getDay()];
    
    // Hora actual en formato HH:MM
    const currentHour = now.getHours().toString().padStart(2, '0');
    const currentMinute = now.getMinutes().toString().padStart(2, '0');
    const horaActual = `${currentHour}:${currentMinute}`;
    
    // 1. Check Charlas first (one-off events override regular classes)
    const currentStr = now.toISOString().split('T')[0];
    const charlaActiva = aula.charlas.find((charla) => {
      const charlaDateStr = charla.fecha.toISOString().split('T')[0];
      return charlaDateStr === currentStr && horaActual >= charla.horaInicio && horaActual <= charla.horaFin;
    });

    if (charlaActiva) {
      return {
        ...aula,
        estado: 'ocupada',
        eventoActual: {
          tipo: 'charla',
          titulo: charlaActiva.titulo,
          profesor: charlaActiva.organizador?.nombre,
          horaInicio: charlaActiva.horaInicio,
          horaFin: charlaActiva.horaFin,
        }
      };
    }

    // 2. Check Asignaciones (regular classes)
    const asignacionActiva = aula.asignaciones.find((asig) => {
      return asig.diaSemana === diaActual && horaActual >= asig.horaInicio && horaActual <= asig.horaFin;
    });

    if (asignacionActiva) {
      return {
        ...aula,
        estado: 'ocupada',
        eventoActual: {
          tipo: 'clase',
          titulo: asignacionActiva.materia?.nombre,
          profesor: asignacionActiva.profesor?.nombre,
          horaInicio: asignacionActiva.horaInicio,
          horaFin: asignacionActiva.horaFin,
        }
      };
    }

    // Si no hay nada
    return {
      ...aula,
      estado: aula.estado,
      eventoActual: null
    };
  }
}
