/**
 * Central API Configuration
 * Connects frontend to the Hono Cloudflare Worker backend.
 */

export const HONO_API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://companion-api.rentyourboyfriend-backend.workers.dev";

/**
 * Returns full URL for an API endpoint.
 * In production/browser, calls the Hono Worker directly.
 * In local server environment, can fall back to relative or direct URL.
 */
export function getApiUrl(path: string): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  if (!HONO_API_URL) return cleanPath;
  return `${HONO_API_URL.replace(/\/$/, "")}${cleanPath}`;
}
