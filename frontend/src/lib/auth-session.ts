export type SessionUser = {
  id: string;
  email: string;
  rol: string;
  accessToken: string;
  refreshToken: string;
};

const STORAGE_KEY = "mapa_session";

export function getSession(): SessionUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SessionUser) : null;
  } catch {
    return null;
  }
}

export function setSession(user: SessionUser): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

export function clearSession(): void {
  localStorage.removeItem(STORAGE_KEY);
}
