# Preguntas de Arquitectura - Sistema de Autenticación Escolares

Para asegurar que la base sea sólida para un proyecto de 1 año, necesito aclarar los siguientes puntos:

### 1. Gestión de Roles y Permisos (RBAC)
Mencionas que el mapa filtrará qué ve cada "alumno o profesor". ¿Deseas que implemente un enum de `Role` (`STUDENT`, `TEACHER`, `ADMIN`) en el esquema de Prisma y los decoradores correspondientes en NestJS desde ahora?

Res: No todavia no hagas nada mas ademas de lo minimo y nesesario para el login.
### 2. Almacenamiento de Refresh Tokens
Para la gestión de sesiones:
- ¿Los Refresh Tokens deben persistirse en la base de datos para permitir la revocación de sesiones (cerrar sesión en todos los dispositivos)?
- En el Frontend, ¿prefieres el uso de `HttpOnly Cookies` para los tokens (más seguro contra XSS) o manejo en memoria/localStorage?

Res: No se muy bie n que responderte a la primera mostrame las opciones y explicamelas asi te puedo decir que prefiero. La segunda opcion si.

### 3. Registro de Usuarios
- ¿El registro será público (cualquiera puede crear una cuenta)?
- ¿O los usuarios serán precargados por un administrador y solo deben "activar" su cuenta?

Res: Por ahora vamos a dejar que todos se pueden registrar desde el login.

### 4. NextJS Auth Implementation
- Mencionas un `AuthProvider`. ¿Prefieres una implementación **custom** (Context + Hooks) o el uso de una librería estándar como **Auth.js (NextAuth)**? 
- *Nota: Auth.js es muy robusto, pero una solución custom da control total sobre el flujo de Refresh Tokens con NestJS.*

Res: usá el auth.js

### 5. Relaciones de Negocio (Prisma)
- **Class vs Classroom**: ¿Una `Class` (ej: Matemáticas A) siempre ocurre en la misma `Classroom` (ej: Aula 101)?
- ¿Un `User` puede cursar múltiples `Class`? (Muchos a Muchos).
- ¿Necesitas que el esquema soporte múltiples "Escuelas/Sedes" (Multi-tenancy) o es para una sola institución?

Res: Te dije que si no es nesesario no agregues nada extra para el login.

### 6. Validación y Formularios
- Para el Frontend, ¿confirmas el uso de `Zod` + `React Hook Form` para las validaciones? (Es el estándar recomendado para shadcn/ui).

Res: si

### 7. Entorno de Desarrollo
- ¿Prefieres que el Backend y el Frontend estén en la misma carpeta (Monorepo con `apps/backend` y `apps/frontend`) o en carpetas separadas en la raíz?

Res: separados

Antes de comenzar ,hace un archivo plan.md