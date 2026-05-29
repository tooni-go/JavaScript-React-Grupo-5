// Requerido por Prisma 7 para migrate deploy (debe estar en ~/servicios/ en el servidor).
import "dotenv/config";
import { defineConfig } from "prisma/config";

const databaseUrl = process.env.DATABASE_URL ?? "file:./dev.db";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "npx ts-node prisma/seed.ts",
  },
  datasource: {
    url: databaseUrl,
  },
});
