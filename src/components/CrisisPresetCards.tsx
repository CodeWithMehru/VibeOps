'use client';

import React from 'react';
import {
  CloudRain,
  Utensils,
  ZapOff,
  UserX,
  ArrowRight,
} from 'lucide-react';
import { CrisisSeverity } from '@/lib/types';

interface CrisisPresetCardsProps {
  isLoading: boolean;
  onSimulateCrisis: (scenario: string) => void;
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

/**
 * CrisisPresetCards Component
 *
 * Displays one-click operational chaos injectors for rapid stress testing.
 */
export default function CrisisPresetCards({
  isLoading,
  onSimulateCrisis,
}: CrisisPresetCardsProps) {
  return (
    <section aria-labelledby="chaos-injectors-title">
      <h3
        id="chaos-injectors-title"
        style={{
          fontSize: '0.82rem',
          fontWeight: 700,
          color: 'var(--text-tertiary)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: 12,
        }}
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
            onKeyDown={e => {
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

            <div
              style={{
                marginTop: 'auto',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: '0.76rem',
                color: 'var(--crisis-coral)',
                fontWeight: 600,
              }}
            >
              Trigger Containment Protocol <ArrowRight size={13} aria-hidden="true" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
