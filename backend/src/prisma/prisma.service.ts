import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const url = process.env.DATABASE_URL;
    if (!url) {
      throw new Error('DATABASE_URL no está definida (revisá ~/servicios/.env)');
    }

    const adapter = new PrismaBetterSqlite3({ url });
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
