/** Usuario asignado en el servidor de clase (guía Schujman 2026). */
export const DEPLOY_USER = "uno";

const LOCAL_API = "http://localhost:3001/api";
const SERVER_ORIGIN = "http://200.3.127.46:8002";

/** URL base de la API Nest (`/api` ya incluido). */
export function getApiBase(): string {
  if (typeof window !== "undefined") {
    if (window.location.pathname.startsWith("/~")) {
      const user = window.location.pathname.split("/")[1];
      return `/${user}/api`;
    }
    return process.env.NEXT_PUBLIC_API_URL ?? LOCAL_API;
  }

  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  return LOCAL_API;
}

/** URL absoluta (p. ej. pruebas con curl). En el navegador usá getApiBase(). */
export function getAbsoluteApiBase(): string {
  if (process.env.NEXT_PUBLIC_API_URL?.startsWith("http")) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  return `${SERVER_ORIGIN}/~${DEPLOY_USER}/api`;
}
