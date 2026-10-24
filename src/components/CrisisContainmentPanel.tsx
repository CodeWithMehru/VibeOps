'use client';

import React from 'react';
import {
  Clock,
  ArrowRight,
  Copy,
  Check,
  Layers,
  MessageSquare,
} from 'lucide-react';
import { CrisisResponse, CrisisSeverity, EventSummary } from '@/lib/types';
import { formatNumber } from '@/lib/format';

interface CrisisContainmentPanelProps {
  crisisResponse: CrisisResponse;
  eventSummary: EventSummary;
  sym: string;
  completedActions: Record<number, boolean>;
  onActionToggle: (idx: number) => void;
  scriptCopied: boolean;
  onCopyScript: (text: string) => void;
}

const SEVERITY_BADGES: Record<CrisisSeverity, { label: string; classStr: string }> = {
  CRITICAL: { label: 'CRITICAL THREAT (LEVEL 1)', classStr: 'crisis-badge' },
  HIGH: { label: 'HIGH RISK (LEVEL 2)', classStr: 'gold-badge' },
  MODERATE: { label: 'MODERATE RISK (LEVEL 3)', classStr: 'sky-badge' },
};

/**
 * CrisisContainmentPanel Component
 *
 * Renders the active crisis incident dashboard: financial shock absorption,
 * minute-by-minute containment protocols, timeline adjustments, and emergency announcement copy.
 */
export default function CrisisContainmentPanel({
  crisisResponse,
  eventSummary,
  sym,
  completedActions,
  onActionToggle,
  scriptCopied,
  onCopyScript,
}: CrisisContainmentPanelProps) {
  return (
    <section
      role="alert"
      aria-live="assertive"
      aria-labelledby="active-crisis-incident-title"
      style={{
        background: 'var(--surface)',
        border: '2px solid var(--crisis-coral)',
        borderRadius: 'var(--radius-xl)',
        padding: '28px',
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        boxShadow: '0 0 35px rgba(244,63,94,0.2)',
        animation: 'fadeIn 0.3s ease',
      }}
    >
      {/* Incident Banner */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 14, borderBottom: '1px solid var(--hairline)', paddingBottom: 18 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <span
              style={{
                padding: '3px 10px',
                borderRadius: 14,
                fontSize: '0.74rem',
                fontWeight: 800,
                letterSpacing: '0.06em',
                background: 'var(--crisis-coral)',
                color: '#FFF',
              }}
            >
              {SEVERITY_BADGES[crisisResponse.severity]?.label || 'INCIDENT ACTIVATED'}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
              Target Venue: {eventSummary.city} • PAX: {eventSummary.guestCount}
            </span>
          </div>
          <h3 id="active-crisis-incident-title" style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {crisisResponse.crisisTitle}
          </h3>
        </div>

        {/* Financial Shock Absorption Card */}
        <div
          tabIndex={0}
          aria-label={`Contingency Delta: +${sym}${formatNumber(crisisResponse.budgetImpactDelta)}, absorbed from ${crisisResponse.reallocatedFrom}`}
          style={{
            background: 'var(--surface-elevated)',
            border: '1px solid var(--hairline-strong)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 18px',
            textAlign: 'right',
          }}
        >
          <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
            Contingency Delta
          </div>
          <div
            suppressHydrationWarning
            style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--crisis-coral)', fontFamily: 'var(--mono-font)' }}
          >
            +{sym}{formatNumber(crisisResponse.budgetImpactDelta)}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
            Absorbed from: {crisisResponse.reallocatedFrom}
          </div>
        </div>
      </div>

      {/* Section 1: Immediate Containment Protocol (Numbered Checklist) */}
      <div>
        <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <Clock size={16} aria-hidden="true" style={{ color: 'var(--gold)' }} />
          Minute-by-Minute Containment Protocol
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }} role="list" aria-label="Containment Protocol Action Items">
          {crisisResponse.immediateActions.map((action, idx) => {
            const isDone = !!completedActions[idx];
            return (
              <div
                key={idx}
                role="checkbox"
                aria-checked={isDone}
                tabIndex={0}
                aria-label={`Action ${idx + 1}: ${action}. Status: ${isDone ? 'Completed' : 'Pending'}. Press Enter to toggle.`}
                onClick={() => onActionToggle(idx)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onActionToggle(idx);
                  }
                }}
                style={{
                  background: isDone ? 'rgba(16,185,129,0.08)' : 'var(--surface-elevated)',
                  border: isDone ? '1px solid rgba(16,185,129,0.3)' : '1px solid var(--hairline)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <div
                  aria-hidden="true"
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: isDone ? 'var(--emerald)' : 'var(--carbon)',
                    border: isDone ? 'none' : '1px solid var(--hairline-strong)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isDone ? '#0B0C10' : 'var(--text-tertiary)',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    flexShrink: 0,
                    marginTop: 1,
                  }}
                >
                  {isDone ? <Check size={14} aria-hidden="true" /> : idx + 1}
                </div>

                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      fontSize: '0.85rem',
                      color: isDone ? 'var(--text-secondary)' : 'var(--text-primary)',
                      textDecoration: isDone ? 'line-through' : 'none',
                      lineHeight: 1.5,
                    }}
                  >
                    {action}
                  </p>
                </div>

                <span style={{ fontSize: '0.72rem', color: isDone ? 'var(--emerald)' : 'var(--text-tertiary)', fontWeight: 600 }}>
                  {isDone ? 'COMPLETED' : 'PENDING'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 2: Critical Timeline Adjustments Grid */}
      <div>
        <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <Layers size={16} aria-hidden="true" style={{ color: 'var(--sky)' }} />
          Live Run-of-Show Timeline Adjustments
        </h4>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 14,
          }}
          role="list"
          aria-label="Contingency Timeline Adjustments"
        >
          {crisisResponse.timelineAdjustments.map((adj, idx) => (
            <div
              key={idx}
              role="listitem"
              style={{
                background: 'var(--surface-elevated)',
                border: '1px solid var(--hairline)',
                borderRadius: 'var(--radius-md)',
                padding: '14px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              <div style={{ fontSize: '0.74rem', color: 'var(--crisis-coral)', textTransform: 'uppercase', fontWeight: 700 }}>
                Original Scheduled Sequence
              </div>
              <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', textDecoration: 'line-through' }}>
                {adj.originalTask}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, margin: '2px 0' }}>
                <ArrowRight size={14} aria-hidden="true" style={{ color: 'var(--gold)' }} />
                <span style={{ fontSize: '0.72rem', color: 'var(--gold)', fontWeight: 700 }}>
                  CONTINGENCY ADJUSTMENT:
                </span>
              </div>
              <div style={{ fontSize: '0.86rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                {adj.newPlan}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: Ready-to-Send Emergency Announcement Script */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <MessageSquare size={16} aria-hidden="true" style={{ color: 'var(--emerald)' }} />
            Ready-to-Broadcast Emergency Script (Emcee & WhatsApp Broadcast)
          </h4>

          <button
            onClick={() => onCopyScript(crisisResponse.emergencyAnnouncementScript)}
            aria-label="Copy emergency announcement script to clipboard"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 14px',
              background: scriptCopied ? 'var(--emerald)' : 'var(--surface-elevated)',
              border: '1px solid var(--hairline-strong)',
              borderRadius: 'var(--radius-sm)',
              color: scriptCopied ? '#0B0C10' : 'var(--text-primary)',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {scriptCopied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
            {scriptCopied ? 'Copied Broadcast!' : 'Copy Script'}
          </button>
        </div>

        <div
          tabIndex={0}
          aria-label="Emergency broadcast script content"
          style={{
            background: 'var(--carbon)',
            border: '1px solid var(--hairline)',
            borderRadius: 'var(--radius-md)',
            padding: '16px 20px',
            fontSize: '0.86rem',
            lineHeight: 1.6,
            color: 'var(--text-primary)',
            whiteSpace: 'pre-wrap',
            fontFamily: 'var(--sans-font)',
          }}
        >
          {crisisResponse.emergencyAnnouncementScript}
        </div>
      </div>
    </section>
  );
}
