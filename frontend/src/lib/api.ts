const DEFAULT_API_BASE = "http://localhost:3001/api";

function trimTrailingSlash(url: string): string {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

/** URL base de la API Nest (`/api` ya incluido). */
export function getApiBase(): string {
  const configuredBase = process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_BASE;
  return trimTrailingSlash(configuredBase);
}

import axios from "axios";
import { getSession, clearSession } from "./auth-session";

export const api = axios.create({
  baseURL: getApiBase(),
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const session = getSession();
    if (session?.accessToken) config.headers.Authorization = `Bearer ${session.accessToken}`;
  }
  return config;
});

api.interceptors.response.use(r => r, err => {
  if (err.response?.status === 401 && typeof window !== "undefined") {
    clearSession();
    window.location.href = "/auth/login";
  }
  return Promise.reject(err);
});
