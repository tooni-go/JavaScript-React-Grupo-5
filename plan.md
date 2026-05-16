# Plan de Desarrollo - Sistema de Autenticación Escolar

Este documento detalla la hoja de ruta para implementar el sistema de autenticación modular solicitado, ajustado tras la revisión de arquitectura.

## 1. Infraestructura y Base de Datos
- **Docker**: Configuración de `docker-compose.yml` para PostgreSQL.
- **Prisma (v6)**: Definición del esquema con los modelos:
    - `User`: Credenciales y datos básicos.
    - `Class`: Relación Many-to-Many con `User`.
    - `Classroom`: Relación Many-to-One con `Class`.
- **Estrategia de Refresh Token**: Implementaremos la **Opción B (Persistente)**. 
    - *Explicación*: Al guardar el refresh token en la BD, podemos revocar sesiones de forma remota y mejorar la seguridad, lo cual es ideal para una aplicación de larga duración (1 año).

## 2. Backend (NestJS)
- **Estructura Modular**:
    - `AuthModule`: Controladores y servicios para Login, Registro y Refresh.
    - `UsersModule`: Gestión básica de usuarios para Prisma.
    - `PrismaModule`: Proveedor global de base de datos.
- **Seguridad**:
    - Hashing con `bcrypt`.
    - Estrategias de Passport para JWT (Access y Refresh).
    - Guards para protección de rutas.

## 3. Frontend (NextJS + Auth.js)
- **Framework**: App Router.
- **Autenticación**: `Auth.js` (anteriormente NextAuth) configurado para comunicarse con el Backend de NestJS (Credentials Provider).
- **UI/UX**:
    - `shadcn/ui` para formularios de Login y Registro.
    - `Zod` + `React Hook Form` para validación.
    - Middleware de Next.js para proteger rutas de forma nativa.
- **Componentes**:
    - `LoginForm`, `RegisterForm`.
    - `Navbar` con estado de sesión.

## 4. Pasos de Ejecución Inmediata
1. Crear carpeta `backend` e inicializar NestJS.
2. Crear carpeta `frontend` e inicializar NextJS.
3. Configurar `docker-compose.yml` en la raíz.
4. Definir y migrar `schema.prisma`.
5. Implementar lógica de Registro/Login en el Backend.
6. Configurar Auth.js en el Frontend.
7. Crear las vistas de Login/Registro.

---
*Arquitecto Senior a cargo: Antigravity*
