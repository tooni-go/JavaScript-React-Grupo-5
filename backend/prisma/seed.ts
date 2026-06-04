import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

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

  console.log('✅ Superadmin:', adminUser.email);

  // Crear cursos
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

  console.log('✅ Cursos:', curso1.nombre, curso2.nombre);

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

  console.log('✅ Materias:', materia1.nombre, materia2.nombre, materia3.nombre);

  // Crear aulas
  const nombresAulas = [
    'Aula-0-1',
    'Aula-0-2',
    'Aula-0-3',
    'Aula-0-5',
    'Aula-0-8',
    'Aula-0-9',
    'Aula-Patio-Verde',
  ];

  const aulas = [];
  for (let i = 0; i < nombresAulas.length; i++) {
    const aula = await prisma.aula.upsert({
      where: { id: i + 1 },
      update: { nombre: nombresAulas[i], piso: 0 },
      create: { nombre: nombresAulas[i], piso: 0 },
    });
    aulas.push(aula);
  }

  console.log('✅ Aulas:', aulas.length);

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

  console.log('✅ Profesor:', profesorUser.nombre);

  // Crear estudiante
  const studentUser = await prisma.user.upsert({
    where: { email: 'alumno@poli.com' },
    update: {},
    create: {
      email: 'alumno@poli.com',
      password: await bcrypt.hash('alumno123', 10),
      nombre: 'Pedro Estudiante',
      rol: 'ESTUDIANTE',
      cursoId: curso1.id,
    },
  });

  console.log('✅ Estudiante:', studentUser.nombre);

  // Crear usuario pendiente
  const pendingUser = await prisma.user.upsert({
    where: { email: 'pendiente@poli.com' },
    update: {},
    create: {
      email: 'pendiente@poli.com',
      password: await bcrypt.hash('pendiente123', 10),
      nombre: 'Ana Pendiente',
      rol: null,
    },
  });

  console.log('✅ Usuario pendiente:', pendingUser.email);

  // Crear asignaciones
  await prisma.asignacion.upsert({
    where: { id: 1 },
    update: {},
    create: {
      diaSemana: 'Lunes',
      horaInicio: '07:30',
      horaFin: '12:00',
      profesorId: profesorUser.id,
      cursoId: curso1.id,
      materiaId: materia1.id,
      aulaId: aulas[0].id,
    },
  });

  console.log('✅ Seed completado!');
  console.log('');
  console.log('📝 Usuarios de prueba:');
  console.log('   Admin: admin@admin.com / admin1');
  console.log('   Profesor: profesor@poli.com / profesor123');
  console.log('   Alumno: alumno@poli.com / alumno123');
  console.log('   Pendiente: pendiente@poli.com / pendiente123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
