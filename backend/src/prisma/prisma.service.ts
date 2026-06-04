import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import Database from 'better-sqlite3';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const sqlite = new Database(process.env.DATABASE_URL?.replace('file:', '') || './dev.db');
    const adapter = new PrismaBetterSqlite3(sqlite);
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
