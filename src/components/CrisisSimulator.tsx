'use client';

import React, { useState } from 'react';
import {
  AlertOctagon,
  Flame,
  CloudRain,
  Utensils,
  ZapOff,
  UserX,
  Send,
  Clock,
  ArrowRight,
  Copy,
  Check,
  RotateCcw,
  Layers,
  MessageSquare,
} from 'lucide-react';
import { CrisisResponse, CrisisSeverity, EventSummary } from '@/lib/types';
import { formatNumber } from '@/lib/format';

interface CrisisSimulatorProps {
  eventSummary: EventSummary;
  currency: string;
  crisisResponse: CrisisResponse | null;
  onSimulateCrisis: (scenario: string) => void;
  isLoading: boolean;
  onClearCrisis: () => void;
}

const PRESET_CRISES = [
  {
    id: 'weather',
    icon: <CloudRain size={20} aria-hidden="true" style={{ color: 'var(--sky)' }} />,
    title: 'Torrential Rain & Outdoor Lawn Flooding',
    description: 'Sudden unseasonal cloudburst soaking the open lawn venue 90 mins before guest arrival.',
    severity: 'CRITICAL' as CrisisSeverity,
  },
  {
    id: 'catering',
    icon: <Utensils size={20} aria-hidden="true" style={{ color: 'var(--gold)' }} />,
    title: 'Head Caterer Food Delay & Burned Main Course',
    description: 'Central kitchen equipment short-circuits. Dinner service delayed by 75 minutes.',
    severity: 'HIGH' as CrisisSeverity,
  },
  {
    id: 'power',
    icon: <ZapOff size={20} aria-hidden="true" style={{ color: 'var(--crisis-coral)' }} />,
    title: 'Main Transformer Trip & Sound System Dead',
    description: 'Generator fails to ignite during main ceremony. Sound and ambient illumination dead.',
    severity: 'CRITICAL' as CrisisSeverity,
  },
  {
    id: 'artist',
    icon: <UserX size={20} aria-hidden="true" style={{ color: 'var(--violet)' }} />,
    title: 'Headline Performer Misses Connection Flight',
    description: 'Key anchor / musical headliner stranded at Delhi airport 2 hours before stage appearance.',
    severity: 'HIGH' as CrisisSeverity,
  },
];

const SEVERITY_BADGES: Record<CrisisSeverity, { label: string; classStr: string }> = {
  CRITICAL: { label: 'CRITICAL THREAT (LEVEL 1)', classStr: 'crisis-badge' },
  HIGH: { label: 'HIGH RISK (LEVEL 2)', classStr: 'gold-badge' },
  MODERATE: { label: 'MODERATE RISK (LEVEL 3)', classStr: 'sky-badge' },
};

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
      <section aria-labelledby="chaos-injectors-title">
        <h3
          id="chaos-injectors-title"
          style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}
        >
          ⚡ 1-Click Operational Chaos Injectors
        </h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 16,
          }}
          role="group"
          aria-label="Preset Crisis Scenarios"
        >
          {PRESET_CRISES.map(preset => (
            <div
              key={preset.id}
              role="button"
              tabIndex={isLoading ? -1 : 0}
              aria-label={`Inject crisis scenario: ${preset.title}. Threat level: ${preset.severity}`}
              onClick={() => !isLoading && onSimulateCrisis(preset.title + ': ' + preset.description)}
              onKeyDown={(e) => {
                if ((e.key === 'Enter' || e.key === ' ') && !isLoading) {
                  e.preventDefault();
                  onSimulateCrisis(preset.title + ': ' + preset.description);
                }
              }}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--hairline)',
                borderRadius: 'var(--radius-lg)',
                padding: '18px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                position: 'relative',
              }}
              onMouseEnter={e => {
                if (!isLoading) {
                  e.currentTarget.style.borderColor = 'var(--crisis-coral)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={e => {
                if (!isLoading) {
                  e.currentTarget.style.borderColor = 'var(--hairline)';
                  e.currentTarget.style.transform = 'none';
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--surface-elevated)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {preset.icon}
                </div>
                <span
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 10,
                    background: preset.severity === 'CRITICAL' ? 'var(--crisis-dim)' : 'var(--gold-dim)',
                    color: preset.severity === 'CRITICAL' ? 'var(--crisis-coral)' : 'var(--gold)',
                    border: '1px solid var(--hairline)',
                  }}
                >
                  {preset.severity}
                </span>
              </div>

              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
                  {preset.title}
                </h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                  {preset.description}
                </p>
              </div>

              <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.76rem', color: 'var(--crisis-coral)', fontWeight: 600 }}>
                Trigger Containment Protocol <ArrowRight size={13} aria-hidden="true" />
              </div>
            </div>
          ))}
        </div>
      </section>

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
                    onClick={() => handleActionToggle(idx)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleActionToggle(idx);
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
                onClick={() => handleCopyScript(crisisResponse.emergencyAnnouncementScript)}
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
      )}
    </div>
  );
}
