'use client';

import React, { useState } from 'react';
import {
  Users,
  UtensilsCrossed,
  Crown,
  HeartHandshake,
  Copy,
  Check,
  Share2,
  Mail,
  MessageCircle,
} from 'lucide-react';
import { EventSummary } from '@/lib/types';
import {
  calculateGuestCohortSplit,
  generatePersonalizedInvite,
} from '@/lib/domain-engine';

interface GuestCohortStudioProps {
  eventSummary: EventSummary;
}

export default function GuestCohortStudio({ eventSummary }: GuestCohortStudioProps) {
  const [inviteType, setInviteType] = useState<'whatsapp' | 'formal' | 'community'>('whatsapp');
  const [copied, setCopied] = useState(false);

  const cohorts = calculateGuestCohortSplit(eventSummary.guestCount);
  const inviteText = generatePersonalizedInvite(eventSummary, inviteType);

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      role="region"
      aria-label="Guest Cohort, Dietary Split & Smart Invite Studio"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--hairline)',
        borderRadius: 'var(--radius-xl)',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
      }}
    >
      {/* Studio Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Users size={18} aria-hidden="true" color="var(--gold)" />
            Guest Cohort & Smart Invite Studio
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-tertiary)', marginTop: 2 }}>
            Headcount tier distribution, dietary buffer allocations, and personalized RSVP broadcasts
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            className="gold-badge font-mono"
            aria-label={`Total PAX: ${eventSummary.guestCount} attendees`}
          >
            {eventSummary.guestCount} Total PAX
          </span>
          <span
            className="emerald-badge font-mono"
            aria-label={`Catering buffer: ${eventSummary.cateringMatrix?.recommendedPlates} plates planned`}
          >
            {eventSummary.cateringMatrix?.recommendedPlates} Buffer Plates
          </span>
        </div>
      </div>

      {/* Cohort & Dietary Grid */}
      <div className="cohort-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
        {/* Card 1: Attendance Tiers */}
        <article
          role="region"
          aria-label={`Attendance Tiers: ${cohorts.vipCount} VIP or Family members, ${cohorts.coreCount} Core Guests, ${cohorts.bufferCount} Buffer or Walk-ins`}
          className="cohort-card"
          style={{
            background: 'var(--surface-elevated)',
            border: '1px solid var(--hairline)',
            borderRadius: 'var(--radius-lg)',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-secondary)' }}>
              Headcount Tiers
            </span>
            <Crown size={14} aria-hidden="true" color="var(--gold)" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.84rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--gold)' }} aria-hidden="true" />
                VIP & Keynote / Family (20%)
              </span>
              <span className="font-mono" style={{ fontWeight: 700, color: 'var(--gold)' }}>{cohorts.vipCount} PAX</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.84rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--sky)' }} aria-hidden="true" />
                Core Confirmed Attendees (60%)
              </span>
              <span className="font-mono" style={{ fontWeight: 700 }}>{cohorts.coreCount} PAX</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.84rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--emerald)' }} aria-hidden="true" />
                Walk-in & Surge Buffer (20%)
              </span>
              <span className="font-mono" style={{ fontWeight: 700, color: 'var(--emerald)' }}>{cohorts.bufferCount} PAX</span>
            </div>
          </div>
        </article>

        {/* Card 2: Dietary Distribution */}
        <article
          role="region"
          aria-label={`Dietary Distribution: ${cohorts.dietaryStandardVeg} Vegetarian or Standard plates, ${cohorts.dietaryNonVegOrSpecial} Non-Vegetarian or Regional plates, ${cohorts.dietaryKidsOrAllergySafe} Kids or Allergy-Safe plates`}
          className="cohort-card"
          style={{
            background: 'var(--surface-elevated)',
            border: '1px solid var(--hairline)',
            borderRadius: 'var(--radius-lg)',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-secondary)' }}>
              Dietary Plate Allocation
            </span>
            <UtensilsCrossed size={14} aria-hidden="true" color="var(--emerald)" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.84rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--emerald)' }} aria-hidden="true" />
                Standard / Vegetarian (60%)
              </span>
              <span className="font-mono" style={{ fontWeight: 700 }}>{cohorts.dietaryStandardVeg} plates</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.84rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--gold)' }} aria-hidden="true" />
                Non-Veg / Regional Specials (30%)
              </span>
              <span className="font-mono" style={{ fontWeight: 700 }}>{cohorts.dietaryNonVegOrSpecial} plates</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.84rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--violet)' }} aria-hidden="true" />
                Kids / Nut & Gluten-Safe (10%)
              </span>
              <span className="font-mono" style={{ fontWeight: 700 }}>{cohorts.dietaryKidsOrAllergySafe} plates</span>
            </div>
          </div>
        </article>
      </div>

      {/* Smart Invite & RSVP Broadcast Generator */}
      <div
        className="invite-box"
        style={{
          background: 'var(--surface-elevated)',
          border: '1px solid var(--hairline-strong)',
          borderRadius: 'var(--radius-lg)',
          padding: '18px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Share2 size={16} aria-hidden="true" color="var(--gold)" />
            <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>Personalized Event Invite & RSVP Broadcast</span>
          </div>

          {/* Format Selector Pills */}
          <div role="group" aria-label="Invite format selection" style={{ display: 'flex', gap: 6 }}>
            <button
              onClick={() => setInviteType('whatsapp')}
              aria-pressed={inviteType === 'whatsapp'}
              aria-label="Format invite for WhatsApp"
              style={{
                padding: '4px 10px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.74rem',
                fontWeight: 600,
                cursor: 'pointer',
                border: inviteType === 'whatsapp' ? '1px solid var(--gold)' : '1px solid var(--hairline)',
                background: inviteType === 'whatsapp' ? 'var(--gold-dim)' : 'transparent',
                color: inviteType === 'whatsapp' ? 'var(--gold)' : 'var(--text-secondary)',
              }}
            >
              <MessageCircle size={11} aria-hidden="true" style={{ display: 'inline', marginRight: 4 }} />
              WhatsApp
            </button>

            <button
              onClick={() => setInviteType('formal')}
              aria-pressed={inviteType === 'formal'}
              aria-label="Format invite as Formal VIP"
              style={{
                padding: '4px 10px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.74rem',
                fontWeight: 600,
                cursor: 'pointer',
                border: inviteType === 'formal' ? '1px solid var(--gold)' : '1px solid var(--hairline)',
                background: inviteType === 'formal' ? 'var(--gold-dim)' : 'transparent',
                color: inviteType === 'formal' ? 'var(--gold)' : 'var(--text-secondary)',
              }}
            >
              <Mail size={11} aria-hidden="true" style={{ display: 'inline', marginRight: 4 }} />
              Formal VIP
            </button>

            <button
              onClick={() => setInviteType('community')}
              aria-pressed={inviteType === 'community'}
              aria-label="Format invite for Community Announcement"
              style={{
                padding: '4px 10px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.74rem',
                fontWeight: 600,
                cursor: 'pointer',
                border: inviteType === 'community' ? '1px solid var(--gold)' : '1px solid var(--hairline)',
                background: inviteType === 'community' ? 'var(--gold-dim)' : 'transparent',
                color: inviteType === 'community' ? 'var(--gold)' : 'var(--text-secondary)',
              }}
            >
              <HeartHandshake size={11} aria-hidden="true" style={{ display: 'inline', marginRight: 4 }} />
              Community
            </button>
          </div>
        </div>

        {/* Script Box */}
        <div style={{ position: 'relative' }}>
          <pre
            tabIndex={0}
            aria-label={`Generated ${inviteType} invitation text`}
            style={{
              background: 'var(--carbon)',
              border: '1px solid var(--hairline)',
              borderRadius: 'var(--radius-md)',
              padding: '14px 16px',
              fontSize: '0.8rem',
              color: 'var(--text-secondary)',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              maxHeight: 180,
              overflowY: 'auto',
              fontFamily: 'inherit',
              lineHeight: 1.5,
              margin: 0,
            }}
          >
            {inviteText}
          </pre>

          <button
            onClick={handleCopy}
            aria-label="Copy invitation broadcast text to clipboard"
            style={{
              position: 'absolute',
              top: 10,
              right: 10,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              padding: '6px 12px',
              background: copied ? 'var(--emerald)' : 'var(--surface-elevated)',
              color: copied ? '#0B0C10' : 'var(--text-primary)',
              border: '1px solid var(--hairline-strong)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {copied ? (
              <>
                <Check size={12} aria-hidden="true" /> Copied!
              </>
            ) : (
              <>
                <Copy size={12} aria-hidden="true" /> Copy Invite
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
