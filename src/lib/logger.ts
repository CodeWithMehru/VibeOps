/**
 * ─── Structured Operational Telemetry Logger ────────────────────────────────
 * Provides environment-aware, standardized logging across client and server.
 * Eliminates raw console.* statements while preserving diagnostic observability.
 */

type LogLevel = 'info' | 'warn' | 'error';

interface LogPayload {
  message: string;
  context?: Record<string, unknown>;
  error?: unknown;
}

interface FormattedLogEntry {
  timestamp: string;
  level: string;
  message: string;
  context?: Record<string, unknown>;
  error?: unknown;
}

/**
 * Formats structured operational log entries.
 *
 * @param level - Severity level (info, warn, error)
 * @param payload - Structured log data
 */
function emitLog(level: LogLevel, payload: LogPayload): void {
  const timestamp = new Date().toISOString();
  const env = process.env.NODE_ENV || 'development';

  if (env === 'test' && level !== 'error') {
    // Suppress verbose informational output in automated test runner
    return;
  }

  const logEntry: FormattedLogEntry = {
    timestamp,
    level: level.toUpperCase(),
    message: payload.message,
    context: payload.context,
    error: payload.error instanceof Error
      ? { name: payload.error.name, message: payload.error.message }
      : payload.error
        ? String(payload.error)
        : undefined,
  };

  const output = `[VibeOps ${logEntry.level}] ${logEntry.timestamp} - ${logEntry.message}`;

  switch (level) {
    case 'info':
      console.info(output, logEntry.context || '');
      break;
    case 'warn':
      console.warn(output, logEntry.error || '', logEntry.context || '');
      break;
    case 'error':
      console.error(output, logEntry.error || '', logEntry.context || '');
      break;
  }
}

/**
 * Application telemetry logger.
 */
export const logger = {
  /**
   * Logs general operational telemetry and state transitions.
   * @param message - Informational message
   * @param context - Optional key-value metadata
   */
  info: (message: string, context?: Record<string, unknown>): void => {
    emitLog('info', { message, context });
  },

  /**
   * Logs recoverable warnings or rate-limiting events.
   * @param message - Warning description
   * @param error - Optional error or diagnostic reason
   * @param context - Optional context
   */
  warn: (message: string, error?: unknown, context?: Record<string, unknown>): void => {
    emitLog('warn', { message, error, context });
  },

  /**
   * Logs system exceptions, network failures, or API rejections.
   * @param message - Error description
   * @param error - The caught exception or reason
   * @param context - Optional diagnostic context
   */
  error: (message: string, error?: unknown, context?: Record<string, unknown>): void => {
    emitLog('error', { message, error, context });
  },
};
