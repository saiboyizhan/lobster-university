/**
 * In-memory sliding window rate limiter.
 */
const windows = new Map<string, number[]>();

const CLEANUP_INTERVAL = 60_000;
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;

  for (const [key, timestamps] of windows) {
    const cutoff = now - 60_000;
    const filtered = timestamps.filter((t) => t > cutoff);
    if (filtered.length === 0) {
      windows.delete(key);
    } else {
      windows.set(key, filtered);
    }
  }
}

/**
 * Check if a request should be rate limited.
 * @param key - Unique identifier (e.g., IP or agent ID)
 * @param maxRequests - Max requests per window
 * @param windowMs - Window size in milliseconds (default 60s)
 * @returns true if rate limited (should reject), false if allowed
 */
export function isRateLimited(
  key: string,
  maxRequests: number,
  windowMs: number = 60_000,
): boolean {
  cleanup();

  const now = Date.now();
  const cutoff = now - windowMs;
  const timestamps = windows.get(key) ?? [];
  const recent = timestamps.filter((t) => t > cutoff);

  if (recent.length >= maxRequests) {
    return true;
  }

  recent.push(now);
  windows.set(key, recent);
  return false;
}

const IP_RE = /^[\d.]+$|^[\da-fA-F:]+$/;

/**
 * Get client identifier for rate limiting.
 * Uses X-Forwarded-For (validated), then falls back to a generic key.
 */
export function getClientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const ip = forwarded.split(",")[0].trim();
    // Only accept valid-looking IPs to prevent key injection
    if (IP_RE.test(ip) && ip.length <= 45) return ip;
  }
  return "unknown";
}
