'use client';

import React, { useState } from 'react';
import {
  AlertOctagon,
  Flame,
  Send,
  RotateCcw,
} from 'lucide-react';
import { CrisisResponse, EventSummary } from '@/lib/types';
import CrisisPresetCards from './CrisisPresetCards';
import CrisisContainmentPanel from './CrisisContainmentPanel';

interface CrisisSimulatorProps {
  eventSummary: EventSummary;
  currency: string;
  crisisResponse: CrisisResponse | null;
  onSimulateCrisis: (scenario: string) => void;
  isLoading: boolean;
  onClearCrisis: () => void;
}

/**
 * CrisisSimulator Component
 *
 * Master crisis management dashboard for stress testing event resilience:
 * 1-click chaos scenario injection, custom incident modeling, and live containment protocols.
 */
export default function CrisisSimulator({
  eventSummary,
  currency,
  crisisResponse,
  onSimulateCrisis,
  isLoading,
  onClearCrisis,
}: CrisisSimulatorProps) {
  const [customCrisis, setCustomCrisis] = useState('');
  const [completedActions, setCompletedActions] = useState<Record<number, boolean>>({});
  const [scriptCopied, setScriptCopied] = useState(false);

  const sym = currency === 'INR' ? '₹' : '$';

  const handleActionToggle = (idx: number) => {
    setCompletedActions(prev => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const handleCopyScript = (text: string) => {
    navigator.clipboard.writeText(text);
    setScriptCopied(true);
    setTimeout(() => setScriptCopied(false), 2000);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customCrisis.trim() || isLoading) return;
    onSimulateCrisis(customCrisis.trim());
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }} role="region" aria-label="Live Crisis and Chaos War-Room">
      {/* ─── Header & Warning Banner ────────────────────────────────────── */}
      <section
        style={{
          background: 'linear-gradient(135deg, rgba(244,63,94,0.12) 0%, rgba(18,20,28,0.95) 100%)',
          border: '1px solid rgba(244,63,94,0.3)',
          borderRadius: 'var(--radius-xl)',
          padding: '24px 28px',
          position: 'relative',
          overflow: 'hidden',
        }}
        aria-labelledby="crisis-banner-title"
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 'var(--radius-md)',
                background: 'rgba(244,63,94,0.2)',
                border: '1px solid var(--crisis-coral)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--crisis-coral)',
                flexShrink: 0,
              }}
            >
              <AlertOctagon size={26} aria-hidden="true" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <h2 id="crisis-banner-title" style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Live Crisis & Chaos War-Room
                </h2>
                <span
                  style={{
                    padding: '2px 8px',
                    borderRadius: 12,
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    background: 'var(--crisis-dim)',
                    color: 'var(--crisis-coral)',
                    border: '1px solid rgba(244,63,94,0.4)',
                  }}
                >
                  ZERO DOWNTIME PROTOCOL
                </span>
              </div>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', maxWidth: 720 }}>
                Events are living systems prone to chaos. Trigger a scenario below to generate instant
                minute-by-minute containment protocols, budget shock absorption, and ready-to-broadcast scripts.
              </p>
            </div>
          </div>

          {crisisResponse && (
            <button
              onClick={onClearCrisis}
              aria-label="Clear active crisis and restore baseline event operations"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 14px',
                background: 'var(--surface-elevated)',
                border: '1px solid var(--hairline-strong)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-secondary)',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <RotateCcw size={14} aria-hidden="true" /> Clear Crisis State
            </button>
          )}
        </div>
      </section>

      {/* ─── 4 One-Click Crisis Scenario Cards ──────────────────────────── */}
      <CrisisPresetCards
        isLoading={isLoading}
        onSimulateCrisis={onSimulateCrisis}
      />

      {/* ─── Custom Crisis Injection Box ────────────────────────────────── */}
      <form
        onSubmit={handleCustomSubmit}
        aria-label="Custom Crisis Simulation Form"
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--hairline)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px 20px',
          display: 'flex',
          gap: 12,
          alignItems: 'center',
        }}
      >
        <Flame size={20} aria-hidden="true" style={{ color: 'var(--crisis-coral)', flexShrink: 0 }} />
        <label htmlFor="custom-crisis-input" className="sr-only">
          Custom crisis description
        </label>
        <input
          id="custom-crisis-input"
          type="text"
          placeholder="Inject custom crisis (e.g., 'Police curfew in zone at 10 PM', 'Bride dress torn during photoshoot')..."
          value={customCrisis}
          onChange={e => setCustomCrisis(e.target.value)}
          disabled={isLoading}
          aria-label="Custom crisis scenario description"
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--text-primary)',
            fontSize: '0.88rem',
          }}
        />
        <button
          type="submit"
          disabled={!customCrisis.trim() || isLoading}
          aria-label="Simulate crisis contingency response"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '9px 18px',
            background: customCrisis.trim() ? 'var(--crisis-coral)' : 'var(--surface-elevated)',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            color: customCrisis.trim() ? '#FFF' : 'var(--text-tertiary)',
            fontWeight: 700,
            fontSize: '0.82rem',
            cursor: customCrisis.trim() && !isLoading ? 'pointer' : 'not-allowed',
            transition: 'all 0.15s ease',
          }}
        >
          {isLoading ? 'Architecting Contingency...' : (
            <>
              <Send size={14} aria-hidden="true" /> Simulate Response
            </>
          )}
        </button>
      </form>

      {/* ─── Active Crisis Containment Panel ────────────────────────────── */}
      {crisisResponse && (
        <CrisisContainmentPanel
          crisisResponse={crisisResponse}
          eventSummary={eventSummary}
          sym={sym}
          completedActions={completedActions}
          onActionToggle={handleActionToggle}
          scriptCopied={scriptCopied}
          onCopyScript={handleCopyScript}
        />
      )}
    </div>
  );
}
