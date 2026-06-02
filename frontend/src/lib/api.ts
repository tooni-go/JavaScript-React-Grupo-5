const DEFAULT_API_BASE = "http://localhost:3001/api";

function trimTrailingSlash(url: string): string {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

/** URL base de la API Nest (`/api` ya incluido). */
export function getApiBase(): string {
  const configuredBase = process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_BASE;
  return trimTrailingSlash(configuredBase);
}
