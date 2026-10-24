/**
 * ─── VibeOps System & Domain Constants ─────────────────────────────────────────
 * Centralized, immutable configuration parameters, operational bounds,
 * and inference models. Eliminates magic numbers across the application.
 */

/**
 * Bounds for event parameter validation and simulation constraints.
 */
export const EVENT_BOUNDS = Object.freeze({
  MIN_GUEST_COUNT: 1,
  MAX_GUEST_COUNT: 100_000,
  MIN_BUDGET: 1_000,
  MAX_BUDGET: 10_000_000_000,
  MAX_TITLE_LENGTH: 120,
  MAX_CITY_LENGTH: 80,
  MAX_PROMPT_INPUT_LENGTH: 500,
  MAX_PAYLOAD_SIZE_BYTES: 256 * 1024, // 256 KB
});

/**
 * Sliding-window rate limiter settings for IP-based throttling.
 */
export const RATE_LIMIT_CONFIG = Object.freeze({
  DEFAULT_MAX_REQUESTS: 45,
  WINDOW_MS: 60_000, // 1 minute
  PRUNE_INTERVAL_MS: 300_000, // 5 minutes
});

/**
 * Official Groq LPU production models with auto-fallback order.
 */
export const GROQ_MODELS = Object.freeze({
  PRIMARY: 'llama-3.3-70b-versatile',
  FALLBACK: 'llama-3.1-8b-instant',
  AVAILABLE: ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant'] as const,
});

/**
 * HTTP Status codes utilized in API routing and guards.
 */
export const HTTP_STATUS = Object.freeze({
  OK: 200,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  PAYLOAD_TOO_LARGE: 413,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
});
