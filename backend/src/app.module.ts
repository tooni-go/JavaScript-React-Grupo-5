import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AulasModule } from './aulas/aulas.module';
import { MateriasModule } from './materias/materias.module';
import { CursosModule } from './cursos/cursos.module';
import { AsignacionesModule } from './asignaciones/asignaciones.module';
import { CharlasModule } from './charlas/charlas.module';
import { ProfesoresModule } from './profesores/profesores.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UsersModule,
    PrismaModule,
    AulasModule,
    MateriasModule,
    CursosModule,
    AsignacionesModule,
    CharlasModule,
    ProfesoresModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
