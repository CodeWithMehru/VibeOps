/**
 * ─── VibeOps Security & Defense-in-Depth Utilities ───────────────────────────
 * Enterprise-grade sanitization, rate-limiting, prompt-injection defense,
 * and payload bounds validation for event production operations.
 */

// In-memory sliding-window rate limiter
interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

/**
 * Strips HTML tags, script tags, control characters, and common prompt injection patterns.
 *
 * @param input - Raw user input string
 * @param maxLength - Maximum permitted length (default: 500)
 * @returns Sanitized safe text
 *
 * @example
 * sanitizeInput("<script>alert('xss')</script>Hello") // "Hello"
 */
export function sanitizeInput(input: string, maxLength: number = 500): string {
  if (typeof input !== 'string') return '';

  let sanitized = input
    // Truncate to safe length
    .slice(0, maxLength)
    // Strip HTML tags and script blocks
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    // Strip null bytes and non-printable control characters (except newline/tab)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // Neutralize common prompt-injection delimiters
    .replace(/\b(?:ignore\s+previous\s+instructions|system\s*:|assistant\s*:|developer\s*:)\b/gi, '[neutralized]')
    .trim();

  return sanitized;
}

/**
 * Validates the cryptographic format of a Groq API key (starts with 'gsk_', min 24 chars).
 *
 * @param key - The API key candidate string
 * @returns Boolean indicating whether the key matches Groq's official key pattern
 */
export function validateGroqApiKeyFormat(key: string): boolean {
  if (!key || typeof key !== 'string') return false;
  // Official Groq API keys follow the gsk_ prefix pattern with base62/hyphen/underscore tokens
  const groqKeyRegex = /^gsk_[a-zA-Z0-9_-]{20,}$/;
  return groqKeyRegex.test(key.trim());
}

/**
 * Sliding-window in-memory rate limiter per IP / Client identifier.
 *
 * @param identifier - IP address or unique client identifier
 * @param limit - Maximum allowed requests in the window (default: 30)
 * @param windowMs - Sliding window duration in milliseconds (default: 60,000 = 1 minute)
 * @returns Object with allowed status, remaining requests, and reset timestamp
 */
export function checkRateLimit(
  identifier: string,
  limit: number = 30,
  windowMs: number = 60000
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const safeId = identifier ? String(identifier).slice(0, 64) : 'unknown-client';
  const existing = rateLimitStore.get(safeId);

  // Clean expired record or initialize new
  if (!existing || now > existing.resetAt) {
    const resetAt = now + windowMs;
    rateLimitStore.set(safeId, { count: 1, resetAt });
    return { allowed: true, remaining: limit - 1, resetAt };
  }

  // Check if limit exceeded
  if (existing.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: existing.resetAt };
  }

  // Increment within window
  existing.count += 1;
  return { allowed: true, remaining: limit - existing.count, resetAt: existing.resetAt };
}

/**
 * Clears expired rate limit records to prevent memory leaks.
 */
export function pruneRateLimitStore(): void {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetAt) {
      rateLimitStore.delete(key);
    }
  }
}

/**
 * Strictly validates incoming event parameters against physical and financial boundaries.
 *
 * @param payload - The untrusted event input payload
 * @returns Validation outcome with descriptive error if invalid
 */
export function validateEventPayload(payload: unknown): { valid: boolean; error?: string } {
  if (!payload || typeof payload !== 'object') {
    return { valid: false, error: 'Payload must be a valid JSON object' };
  }

  const p = payload as Record<string, unknown>;

  if (p.guestCount !== undefined) {
    const guestCount = Number(p.guestCount);
    if (isNaN(guestCount) || guestCount < 1 || guestCount > 100000) {
      return { valid: false, error: 'Guest count must be between 1 and 100,000 PAX' };
    }
  }

  if (p.totalBudget !== undefined) {
    const totalBudget = Number(p.totalBudget);
    if (isNaN(totalBudget) || totalBudget <= 0 || !isFinite(totalBudget)) {
      return { valid: false, error: 'Total budget must be a positive finite number' };
    }
  }

  if (p.title !== undefined && typeof p.title === 'string' && p.title.length > 200) {
    return { valid: false, error: 'Event title must not exceed 200 characters' };
  }

  if (p.city !== undefined && typeof p.city === 'string' && p.city.length > 100) {
    return { valid: false, error: 'City name must not exceed 100 characters' };
  }

  return { valid: true };
}
