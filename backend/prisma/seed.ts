import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import * as bcrypt from 'bcrypt';

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminEmail = 'admin@admin.com';
  const adminPassword = 'admin1';

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: hashedPassword,
    },
    create: {
      email: adminEmail,
      password: hashedPassword,
      nombre: 'Super Administrador',
      rol: 'SUPERADMIN',
    },
  });

  console.log('Superadmin (upserted):', adminUser.email);

  // Crear cursos Todo para probar
  const curso1 = await prisma.curso.upsert({
    where: { id: 1 },
    update: {},
    create: { nombre: '6to 4ta' },
  });

  const curso2 = await prisma.curso.upsert({
    where: { id: 2 },
    update: {},
    create: { nombre: '5to 2da' },
  });

  console.log('Cursos creados:', curso1.nombre, curso2.nombre);

  // Crear materias
  const materia1 = await prisma.materia.upsert({
    where: { id: 1 },
    update: {},
    create: { nombre: 'Programación' },
  });

  const materia2 = await prisma.materia.upsert({
    where: { id: 2 },
    update: {},
    create: { nombre: 'Matemática' },
  });

  const materia3 = await prisma.materia.upsert({
    where: { id: 3 },
    update: {},
    create: { nombre: 'Física' },
  });

  console.log('Materias creadas:', materia1.nombre, materia2.nombre, materia3.nombre);

  // Crear aulas con los IDs del SVG del usuario
  const aulas: any[] = [];
  const nombresAulas = [
    'Aula-0-1',
    'Aula-0-2',
    'Aula-0-3',
    'Aula-0-5',
    'Aula-0-8',
    'Aula-0-9',
    'Aula-Patio-Verde',
  ];

  for (let i = 0; i < nombresAulas.length; i++) {
    const aula = await prisma.aula.upsert({
      where: { id: i + 1 },
      update: { nombre: nombresAulas[i], piso: 0 },
      create: { nombre: nombresAulas[i], piso: 0 },
    });
    aulas.push(aula);
  }

  console.log('Aulas creadas:', aulas.length, 'aulas en total');

  // Crear profesor
  const profesorUser = await prisma.user.upsert({
    where: { email: 'profesor@poli.com' },
    update: {},
    create: {
      email: 'profesor@poli.com',
      password: await bcrypt.hash('profesor123', 10),
      nombre: 'Juan Pérez',
      rol: 'PROFESOR',
    },
  });

  const profesor = await prisma.profesor.upsert({
    where: { userId: profesorUser.id },
    update: {},
    create: {
      userId: profesorUser.id,
      especialidad: 'Informática',
      biografia: 'Profesor de programación con 10 años de experiencia',
    },
  });

  console.log('Profesor creado:', profesorUser.nombre);

  // Crear asignaciones
  const asignacion1 = await prisma.asignacion.upsert({
    where: { id: 1 },
    update: {},
    create: {
      diaSemana: 'Lunes',
      horaInicio: '07:30',
      horaFin: '12:00',
      profesorId: profesorUser.id,
      cursoId: curso1.id,
      materiaId: materia1.id,
      aulaId: aulas[0].id, // Aula-0-1
    },
  });

  const asignacion2 = await prisma.asignacion.upsert({
    where: { id: 2 },
    update: {},
    create: {
      diaSemana: 'Martes',
      horaInicio: '08:00',
      horaFin: '11:30',
      profesorId: profesorUser.id,
      cursoId: curso2.id,
      materiaId: materia2.id,
      aulaId: aulas[1].id, // Aula-0-2
    },
  });

  const asignacion3 = await prisma.asignacion.upsert({
    where: { id: 3 },
    update: {},
    create: {
      diaSemana: 'Miércoles',
      horaInicio: '09:00',
      horaFin: '13:00',
      profesorId: profesorUser.id,
      cursoId: curso1.id,
      materiaId: materia3.id,
      aulaId: aulas[2].id, // Aula-0-3
    },
  });

  console.log('Asignaciones creadas:', asignacion1.diaSemana, asignacion2.diaSemana, asignacion3.diaSemana);

  // Crear charla
  const charla = await prisma.charla.upsert({
    where: { id: 1 },
    update: {},
    create: {
      titulo: 'Introducción a la Inteligencia Artificial',
      descripcion: 'Charla sobre los fundamentos de IA y Machine Learning',
      capacidadMax: 50,
      fecha: new Date('2026-06-15T00:00:00'),
      horaInicio: '14:00',
      horaFin: '16:00',
      aulaId: aulas[6].id, // Aula-Patio-Verde
      organizadorId: adminUser.id,
    },
  });

  console.log('Charla creada:', charla.titulo);

  console.log('Seed completado exitosamente!');
} //Todo esto es para poblar la base de datos con datos de prueba

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
