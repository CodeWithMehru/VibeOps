'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to console without breaking telemetry
    console.error('[VibeOps Command Center Error Boundary]:', error);
  }, [error]);

  return (
    <div
      role="alert"
      aria-live="assertive"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--carbon)',
        color: 'var(--text-primary)',
        padding: '24px',
      }}
    >
      <div
        className="card"
        style={{
          maxWidth: 520,
          width: '100%',
          padding: '36px',
          textAlign: 'center',
          border: '1px solid var(--crisis-coral)',
          boxShadow: '0 0 30px rgba(244, 63, 94, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <div
          style={{
            width: 54,
            height: 54,
            borderRadius: 'var(--radius-md)',
            background: 'var(--crisis-dim)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--crisis-coral)',
          }}
        >
          <AlertTriangle size={28} aria-hidden="true" />
        </div>

        <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Command Center Operational Interruption</h1>

        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          An unexpected exception occurred while evaluating event production state. All underlying data structures remain preserved.
        </p>

        {error?.message && (
          <div
            style={{
              padding: '10px 14px',
              background: 'var(--surface-elevated)',
              border: '1px solid var(--hairline)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8rem',
              color: 'var(--text-tertiary)',
              fontFamily: 'var(--mono-font)',
              width: '100%',
              wordBreak: 'break-word',
            }}
          >
            {error.message}
          </div>
        )}

        <div style={{ display: 'flex', gap: 12, marginTop: 8, width: '100%', justifyContent: 'center' }}>
          <button
            onClick={() => reset()}
            className="btn-primary"
            aria-label="Retry and recover event command center"
            style={{ fontSize: '0.86rem', padding: '10px 20px' }}
          >
            <RefreshCw size={15} aria-hidden="true" /> Recover Session
          </button>
          <button
            onClick={() => { window.location.href = '/'; }}
            className="btn-secondary"
            aria-label="Reload command center home"
            style={{ fontSize: '0.86rem', padding: '10px 20px' }}
          >
            <Home size={15} aria-hidden="true" /> Reset Workspace
          </button>
        </div>
      </div>
    </div>
  );
}
