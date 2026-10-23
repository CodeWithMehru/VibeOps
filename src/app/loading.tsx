import React from 'react';
import { Cpu, Zap } from 'lucide-react';

export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading VibeOps Command Center"
      style={{
        minHeight: '100vh',
        background: 'var(--carbon)',
        color: 'var(--text-primary)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        gap: 20,
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 'var(--radius-lg)',
          background: 'var(--gold-dim)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 24px var(--gold-glow)',
          animation: 'pulse 1.8s infinite',
        }}
      >
        <Zap size={28} color="var(--gold)" aria-hidden="true" />
      </div>

      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 6 }}>
          Initializing VibeOps War-Room
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
          Warming up Groq LPU telemetry, budget matrices & contingency models...
        </p>
      </div>

      <div
        className="progress-track"
        style={{ maxWidth: 280, width: '100%', height: 4, background: 'var(--surface-elevated)' }}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Telemetry initialization progress"
      >
        <div
          className="progress-fill"
          style={{
            width: '60%',
            animation: 'pulse 1.2s infinite ease-in-out',
          }}
        />
      </div>

      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          fontSize: '0.74rem',
          color: 'var(--text-tertiary)',
        }}
      >
        <Cpu size={12} aria-hidden="true" /> Sub-second deterministic inference
      </div>
    </div>
  );
}
