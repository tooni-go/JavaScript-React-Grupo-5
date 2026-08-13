import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import * as bcrypt from 'bcrypt';

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || 'file:./dev.db',
});
const prisma = new PrismaClient({ adapter });

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
  const nombresCursos: string[] = [];
  const sufijosComisiones = ["1ra", "2da", "3ra", "4ta", "5ta", "6ta", "7ma"];
  const especialidades = ["Informática", "Mecánica", "Plantas Industriales", "Electrónica", "Construcciones", "Alimentos", "Química"];
  
  // 1ero y 2do
  for (const anio of ["1ero", "2do"]) {
    for (const comision of sufijosComisiones) {
      nombresCursos.push(`${anio} ${comision}`);
    }
  }
  
  // 3ero a 6to (asumiendo 6 años)
  for (const anio of ["3ero", "4to", "5to", "6to"]) {
    for (const esp of especialidades) {
      nombresCursos.push(`${anio} ${esp}`);
    }
  }

  const cursosCreados: any[] = [];
  for (let i = 0; i < nombresCursos.length; i++) {
    const c = await prisma.curso.upsert({
      where: { id: i + 1 },
      update: { nombre: nombresCursos[i] },
      create: { nombre: nombresCursos[i] },
    });
    cursosCreados.push(c);
  }

  const cursoInfo = cursosCreados.find(c => c.nombre === '6to Informática') || cursosCreados[0];

  console.log(`✅ Cursos: ${cursosCreados.length} cargados.`);

  // Crear materias
  const nombresMaterias = [
    'Apreciación de sistemas típicos',
    'Prácticas profesionalizantes',
    'Mantenimiento de software',
    'Algoritmos y estructuras de datos',
    'Adaptaciones del ambiente de trabajo',
    'Lógica orientada a la computación',
    'Instalaciones y reemplazos de hardware',
    'Conexión de redes extendidas',
    'Aplicaciones específicas de redes',
    'Teoría de grafos',
    'Asistencia sobre aplicaciones'
  ];

  const materias: any[] = [];
  for (let i = 0; i < nombresMaterias.length; i++) {
    const m = await prisma.materia.upsert({
      where: { id: i + 1 },
      update: { nombre: nombresMaterias[i] },
      create: { nombre: nombresMaterias[i] },
    });
    materias.push(m);
  }

  console.log(`✅ Materias: ${materias.length} cargadas.`);

  // Crear aulas (necesarias para el SVG, dejamos algunas)
  const nombresAulas = [
    'Aula-0-1',
    'Aula-0-2',
    'Aula-0-3',
    'Aula-0-5',
    'Aula-0-8',
    'Aula-0-9',
    'Aula-Patio-Verde',
  ];

  const aulas: any[] = [];
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
      cursoId: cursoInfo.id,
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
    },
  });

  console.log('✅ Usuario pendiente:', pendingUser.email);

  // Crear asignaciones
  const asignacionesData = [
    { dia: 'Lunes', inicio: '12:40', fin: '15:00', materia: 'Mantenimiento de software' },
    { dia: 'Lunes', inicio: '15:00', fin: '18:50', materia: 'Teoría de grafos' },
    { dia: 'Martes', inicio: '07:30', fin: '10:30', materia: 'Apreciación de sistemas típicos' },
    { dia: 'Martes', inicio: '14:10', fin: '16:30', materia: 'Adaptaciones del ambiente de trabajo' },
    { dia: 'Martes', inicio: '16:30', fin: '18:10', materia: 'Lógica orientada a la computación' },
    { dia: 'Martes', inicio: '18:10', fin: '18:50', materia: 'Algoritmos y estructuras de datos' },
    { dia: 'Miércoles', inicio: '07:30', fin: '10:30', materia: 'Prácticas profesionalizantes' },
    { dia: 'Miércoles', inicio: '12:40', fin: '15:40', materia: 'Algoritmos y estructuras de datos' },
    { dia: 'Miércoles', inicio: '15:40', fin: '18:10', materia: 'Instalaciones y reemplazos de hardware' },
    { dia: 'Jueves', inicio: '14:10', fin: '16:30', materia: 'Lógica orientada a la computación' },
    { dia: 'Jueves', inicio: '16:30', fin: '18:10', materia: 'Conexión de redes extendidas' },
    { dia: 'Viernes', inicio: '07:30', fin: '10:30', materia: 'Prácticas profesionalizantes' },
    { dia: 'Viernes', inicio: '13:30', fin: '15:40', materia: 'Instalaciones y reemplazos de hardware' },
    { dia: 'Viernes', inicio: '15:40', fin: '17:10', materia: 'Aplicaciones específicas de redes' },
    { dia: 'Viernes', inicio: '17:10', fin: '18:50', materia: 'Asistencia sobre aplicaciones' },
  ];

  for (let i = 0; i < asignacionesData.length; i++) {
    const data = asignacionesData[i];
    const materiaRef = materias.find(m => m.nombre === data.materia);
    
    if (materiaRef) {
      await prisma.asignacion.upsert({
        where: { id: i + 1 },
        update: {
          diaSemana: data.dia,
          horaInicio: data.inicio,
          horaFin: data.fin,
          profesorId: profesorUser.id,
          cursoId: cursoInfo.id,
          materiaId: materiaRef.id,
          aulaId: aulas[0].id, // Asignado al aula 0-1 temporalmente
        },
        create: {
          diaSemana: data.dia,
          horaInicio: data.inicio,
          horaFin: data.fin,
          profesorId: profesorUser.id,
          cursoId: cursoInfo.id,
          materiaId: materiaRef.id,
          aulaId: aulas[0].id,
        },
      });
    }
  }

  console.log(`✅ Asignaciones: ${asignacionesData.length} creadas/actualizadas.`);

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
