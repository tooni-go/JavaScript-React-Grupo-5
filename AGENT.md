# Agent Core Rules & Static Full-Stack Project Guardrails

You are an expert developer assistant driving a full-stack school interactive map application. The frontend is built with Next.js and the backend with NestJS, utilizing Prisma with an SQLite database. The project is fully initialized and working. 

**CRITICAL DEPLOYMENT CONTEXT:** The production server **ONLY accepts static HTML/JS/CSS exports for the frontend** (`output: 'export'`). You must always keep this constraint in mind.

---

## 🚨 Critical Guardrails (DO NOT VIOLATE)

### 1. Code Preservation & Scope
- **Do Not Touch the Database directly**: Do not run manual alterations outside of Prisma schema workflows.
- **Do Not Modify Existing Routes**: Existing API routes and endpoints are stable. Do not change their signatures or paths unless explicitly ordered.
- **Hands Off the School Vector Map**: The school map is constructed using strict vector logic (SVGs/Figma elements). **AVOID touching, refactoring, or modifying the vector map files** at all costs unless the prompt is specifically about adding a map feature.
- **No Extra Features**: Do not over-engineer. Do not add future-proof logic, extra properties, or unrequested features. Implement only the minimum necessary code to complete the task.

### 2. Environment Variables & Deployment
- **Strict Environment Separation**: We maintain completely separate `.env` files for local development and production/deployment. 
- **Static Export Awareness**: Because Next.js compiles to a fully static build for production, server-side runtime environment variables will NOT be available in the frontend browser context. Plan variable injection accordingly.

### 3. Local Workflow
- **Package Manager**: This project strictly uses `pnpm`. Never generate `package-lock.json` or `yarn.lock` files. Always use `pnpm` commands for installing or running scripts.

---

## 🛠️ Skill Activation & Modification Rules

- **Backend (NestJS)**: You can reference `nest-best-practices` for clean coding architecture, but **remember the server is static**; the backend acts as a separate API. Respect the existing codebase structure entirely.
- **Frontend (Next.js)**: Be highly cautious with `next-app-router-patterns`. Because we target a **static export**, features like Dynamic Server-Side Rendering (SSR), Server Actions, or headers/cookies manipulation inside components **will fail**. Keep components client-safe and compatible with static builds while respecting existing patterns.
- **Database (Prisma & SQLite)**: You can support your workflows using `prisma-cli`. Ensure all queries are fully compatible with SQLite limitations.

---

## 📋 Rule Categories

### 1. Architecture (`arch-`)
- **arch-respect-layers**: Maintain the strict separation between NestJS controllers (HTTP layer), services (business logic), and Prisma (data persistence). Never query the database directly from a controller.
- **arch-scoped-changes**: When editing Next.js pages or components, isolate state change impacts to prevent full-page re-renders.
- **arch-static-compatibility**: Ensure no Next.js code introduces features that break `pnpm next build` static html export.

### 2. Security (`sec-`)
- **sec-basic-validation**: Ensure all inputs coming into NestJS endpoints are typed via DTOs and minimally validated to prevent application crashes.
- **sec-env-leak**: Never hardcode credentials, tokens, or local connection strings. Use process environment variables safely.

---

## 🔍 Verification Checklist
Before outputting any code or concluding a task, verify against this checklist:
- [ ] **Scope Lock**: Did I restrict my changes *only* to the files requested?
- [ ] **Vector Map Safety**: Did I avoid modifying the vector map coordinates/files unless explicitly told to?
- [ ] **Static Build Safe**: Will this frontend code compile perfectly under Next.js static HTML export constraints?
- [ ] **Naming Match**: Are all new variables or fields matching the language, casing, and style of the current files? Do not translate names.
- [ ] **Build Check**: Does this code introduce any TypeScript compilation errors or broken imports?
- [ ] **Package Manager**: Did I ensure no `npm` or `yarn` lockfiles were accidentally created, sticking to `pnpm`?

---

## 🪵 Knowledge Base & Bug History (Dynamic Section)
*Instructions for the AI: When the user tells you to add a problem/solution to `AGENT.md`, log the encountered bug, root cause, and exact fix under this section using the format below so you don't repeat the mistake in future chats.*

### Encountered Issues & Fixes:

**Issue #1: Navbar Session Sync Bug**
*Problem:* Navbar persistently rendered user as "Logged In" even after token expiration or logout, requiring hard refresh to update.
*Root Cause:* Auth state wasn't reacting to cross-tab storage events or window focus changes.
*Fix:* Added `storage` and `focus` event listeners in `AuthProvider` to re-sync session state reactively without page reload.
*File:* `frontend/src/components/providers/auth-provider.tsx`

**Issue #2: Schedule Time Validation**
*Problem:* Admin could create schedules with endTime chronologically before startTime (e.g., 08:00 to 06:00).
*Root Cause:* No validation logic in backend service or frontend form.
*Fix:* Added `validateTimeRange()` helper converting HH:MM to total minutes and throwing `BadRequestException` if `endTime <= startTime`.
*Files:* `backend/src/asignaciones/asignaciones.service.ts`, `frontend/src/app/admin/horarios/page.tsx`

**Issue #3: Null-Role User Authorization Flow**
*Problem:* Users registering without explicit role assignment couldn't login or were incorrectly routed.
*Root Cause:* Schema required non-null role; JWT token generation failed for null values.
*Fix:* (1) Updated Prisma schema to allow `rol: String?` nullable, (2) Modified auth service to issue tokens with `rol: 'PENDING'` placeholder in JWT, (3) Frontend login routes to `/pendiente` for null-role users, (4) AuthGuard redirects null-role users to `/pendiente`.
*Files:* `backend/prisma/schema.prisma`, `backend/src/auth/auth.service.ts`, `frontend/src/components/auth/login-form.tsx`, `frontend/src/components/auth-guard.tsx`, `frontend/src/app/pendiente/page.tsx`

**Issue #4: Double Password Hashing**
*Problem:* Registered users unable to login with correct password (401 error).
*Root Cause:* Both `AuthService.register()` and `UsersService.create()` were hashing the password - double hash caused comparison failure.
*Fix:* Removed hashing from `AuthService`; `UsersService.create()` now handles hashing exclusively.
*File:* `backend/src/auth/auth.service.ts`
