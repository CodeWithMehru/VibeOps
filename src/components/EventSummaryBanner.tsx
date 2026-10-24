'use client';

import React from 'react';
import { MapPin, Users, Sparkles } from 'lucide-react';
import { EventBlueprint } from '@/lib/types';
import { formatNumber } from '@/lib/format';

export interface EventSummaryBannerProps {
  blueprint: EventBlueprint;
  sym: string;
  wizardOpen: boolean;
  onOpenWizard: () => void;
}

/**
 * EventSummaryBanner Component
 *
 * Renders the top-level event telemetry hero header including category pill,
 * city, guest headcount, vibe color palette swatches, title, tagline,
 * total operational budget KPI, and the "Architect New Blueprint" trigger.
 */
export default function EventSummaryBanner({
  blueprint,
  sym,
  wizardOpen,
  onOpenWizard,
}: EventSummaryBannerProps) {
  const { eventSummary } = blueprint;

  return (
    <section
      aria-labelledby="event-hero-title"
      style={{
        background: 'linear-gradient(135deg, rgba(26,29,43,0.95) 0%, rgba(18,20,28,0.98) 100%)',
        border: '1px solid var(--hairline-strong)',
        borderRadius: 'var(--radius-xl)',
        padding: '24px 28px',
        marginBottom: 24,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
        <div>
          {/* Category & Status Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
            <span
              style={{
                padding: '3px 10px',
                borderRadius: 20,
                fontSize: '0.74rem',
                fontWeight: 700,
                background: 'var(--gold-dim)',
                color: 'var(--gold)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              {eventSummary.category} Production
            </span>

            <span
              style={{
                padding: '3px 10px',
                borderRadius: 20,
                fontSize: '0.74rem',
                fontWeight: 600,
                background: 'var(--surface-elevated)',
                color: 'var(--sky)',
                border: '1px solid var(--hairline)',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
              }}
            >
              <MapPin size={12} aria-hidden="true" /> {eventSummary.city}
            </span>

            <span
              style={{
                padding: '3px 10px',
                borderRadius: 20,
                fontSize: '0.74rem',
                fontWeight: 600,
                background: 'var(--surface-elevated)',
                color: 'var(--emerald)',
                border: '1px solid var(--hairline)',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
              }}
            >
              <Users size={12} aria-hidden="true" /> {eventSummary.guestCount} PAX
            </span>

            {/* Vibe palette dots */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginLeft: 4 }} aria-label="Event vibe color palette">
              {eventSummary.vibePalette?.map((color, idx) => (
                <span
                  key={idx}
                  title={color}
                  aria-label={`Color swatch: ${color}`}
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    background: color,
                    display: 'inline-block',
                    border: '1px solid rgba(255,255,255,0.2)',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Title & Tagline */}
          <h1 id="event-hero-title" style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: 4 }}>
            {eventSummary.title}
          </h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            {eventSummary.tagline}
          </p>
        </div>

        {/* Right: Quick KPI Callout & Architect Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            tabIndex={0}
            aria-label={`Total Operational Budget: ${sym}${formatNumber(eventSummary.totalBudget)}. Catering: ${eventSummary.cateringMatrix?.recommendedPlates} plates planned with ${eventSummary.cateringMatrix?.bufferPercentage}% buffer.`}
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--hairline)',
              borderRadius: 'var(--radius-md)',
              padding: '10px 16px',
              textAlign: 'right',
            }}
          >
            <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
              Total Operational Budget
            </div>
            <div
              suppressHydrationWarning
              style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--gold)', fontFamily: 'var(--mono-font)' }}
            >
              {sym}{formatNumber(eventSummary.totalBudget)}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--emerald)' }}>
              {eventSummary.cateringMatrix?.recommendedPlates} Plates Planned ({eventSummary.cateringMatrix?.bufferPercentage}% Buffer)
            </div>
          </div>

          <button
            onClick={onOpenWizard}
            aria-label="Open Event Architect Wizard"
            aria-haspopup="dialog"
            aria-expanded={wizardOpen}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 20px',
              background: 'var(--gold)',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              color: '#0B0C10',
              fontSize: '0.86rem',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(245, 158, 11, 0.3)',
              transition: 'all 0.15s ease',
            }}
          >
            <Sparkles size={16} aria-hidden="true" /> Architect New Blueprint
          </button>
        </div>
      </div>
    </section>
  );
}
