/*
  Warnings:

  - You are about to drop the column `fechaHora` on the `Charla` table. All the data in the column will be lost.
  - Added the required column `fecha` to the `Charla` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Aula" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "piso" INTEGER NOT NULL,
    "capacidad" INTEGER NOT NULL DEFAULT 30,
    "estado" TEXT NOT NULL DEFAULT 'disponible'
);
INSERT INTO "new_Aula" ("id", "nombre", "piso") SELECT "id", "nombre", "piso" FROM "Aula";
DROP TABLE "Aula";
ALTER TABLE "new_Aula" RENAME TO "Aula";
CREATE TABLE "new_Charla" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT,
    "capacidadMax" INTEGER NOT NULL,
    "fecha" DATETIME NOT NULL,
    "horaInicio" TEXT NOT NULL DEFAULT '08:00',
    "horaFin" TEXT NOT NULL DEFAULT '10:00',
    "aulaId" INTEGER NOT NULL,
    "organizadorId" TEXT NOT NULL,
    CONSTRAINT "Charla_aulaId_fkey" FOREIGN KEY ("aulaId") REFERENCES "Aula" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Charla_organizadorId_fkey" FOREIGN KEY ("organizadorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Charla" ("aulaId", "capacidadMax", "descripcion", "id", "organizadorId", "titulo") SELECT "aulaId", "capacidadMax", "descripcion", "id", "organizadorId", "titulo" FROM "Charla";
DROP TABLE "Charla";
ALTER TABLE "new_Charla" RENAME TO "Charla";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
