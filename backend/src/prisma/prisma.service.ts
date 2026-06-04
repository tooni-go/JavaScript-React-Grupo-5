import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    // Usar Prisma Client estándar (sin adapter) para mayor compatibilidad
    // Funciona en local y en deploy sin configuración adicional
    super();
  }

  async onModuleInit() {
    await this.$connect();
  }
}
