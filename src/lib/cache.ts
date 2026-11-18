/**
 * Client-side Browser Stale-While-Revalidate (SWR) Cache
 * Provides sub-millisecond instant data loads from browser storage with background revalidation.
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const memoryCache = new Map<string, CacheEntry<unknown>>();

/**
 * Fetches JSON with Stale-While-Revalidate browser caching.
 * @param url The endpoint URL
 * @param ttlMs Time-to-live before triggering background revalidation (default: 2 minutes)
 * @param onFresh Optional callback called if background revalidation finds updated data
 */
export async function cachedFetch<T>(
  url: string,
  ttlMs: number = 120_000,
  onFresh?: (freshData: T) => void
): Promise<T> {
  const cacheKey = `c_cache_${url}`;
  const now = Date.now();

  // 1. Check in-memory cache first (fastest)
  const memEntry = memoryCache.get(cacheKey) as CacheEntry<T> | undefined;
  if (memEntry) {
    const isStale = now - memEntry.timestamp > ttlMs;
    if (isStale) {
      // Revalidate in background
      revalidate<T>(url, cacheKey, memEntry.data, onFresh);
    }
    return memEntry.data;
  }

  // 2. Check browser sessionStorage
  if (typeof window !== "undefined") {
    try {
      const stored = sessionStorage.getItem(cacheKey);
      if (stored) {
        const parsed = JSON.parse(stored) as CacheEntry<T>;
        memoryCache.set(cacheKey, parsed as CacheEntry<unknown>);
        const isStale = now - parsed.timestamp > ttlMs;
        if (isStale) {
          revalidate<T>(url, cacheKey, parsed.data, onFresh);
        }
        return parsed.data;
      }
    } catch (e) {
      console.warn("Browser cache read error:", e);
    }
  }

  // 3. Cache miss: fetch from network
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Fetch failed with status ${res.status}`);
  }
  const freshData = (await res.json()) as T;

  saveCache(cacheKey, freshData);
  return freshData;
}

/**
 * Background revalidation for SWR pattern
 */
async function revalidate<T>(
  url: string,
  cacheKey: string,
  oldData: T,
  onFresh?: (freshData: T) => void
) {
  try {
    const res = await fetch(url);
    if (!res.ok) return;
    const freshData = (await res.json()) as T;

    // Save newly fetched data
    saveCache(cacheKey, freshData);

    // If data changed and callback provided, notify caller
    if (JSON.stringify(freshData) !== JSON.stringify(oldData)) {
      if (onFresh) {
        onFresh(freshData);
      }
    }
  } catch (err) {
    // Network errors during background revalidation fail silently
    console.debug("Background cache revalidation failed:", err);
  }
}

/**
 * Save entry to both memory and sessionStorage
 */
function saveCache<T>(cacheKey: string, data: T) {
  const entry: CacheEntry<T> = {
    data,
    timestamp: Date.now(),
  };

  memoryCache.set(cacheKey, entry as CacheEntry<unknown>);

  if (typeof window !== "undefined") {
    try {
      sessionStorage.setItem(cacheKey, JSON.stringify(entry));
    } catch {
      // Quota exceeded or private browsing restrictions
    }
  }
}

/**
 * Invalidate a specific cache key or prefix
 */
export function invalidateCache(prefix: string) {
  for (const key of memoryCache.keys()) {
    if (key.includes(prefix)) {
      memoryCache.delete(key);
    }
  }

  if (typeof window !== "undefined") {
    try {
      for (let i = sessionStorage.length - 1; i >= 0; i--) {
        const key = sessionStorage.key(i);
        if (key && key.includes(prefix)) {
          sessionStorage.removeItem(key);
        }
      }
    } catch {}
  }
}

