'use client';

import React from 'react';
import {
  Store,
  DollarSign,
  TrendingDown,
  ShieldCheck,
} from 'lucide-react';
import { formatNumber } from '@/lib/format';

interface VendorMetricsBannerProps {
  sym: string;
  totalEstimated: number;
  totalNegotiated: number;
  totalSavings: number;
  bookedCount: number;
  vendorsCount: number;
}

/**
 * VendorMetricsBanner Component
 *
 * Displays top procurement telemetry: estimated spend, negotiated target,
 * unlocked cash savings, and vendor lock rate.
 */
export default function VendorMetricsBanner({
  sym,
  totalEstimated,
  totalNegotiated,
  totalSavings,
  bookedCount,
  vendorsCount,
}: VendorMetricsBannerProps) {
  return (
    <section
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 16,
      }}
      aria-label="Vendor Procurement Financial Overview"
    >
      <article
        role="region"
        tabIndex={0}
        aria-label={`Estimated Vendor Spend: ${sym}${formatNumber(totalEstimated)} across ${vendorsCount} vendors`}
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--hairline)',
          borderRadius: 'var(--radius-lg)',
          padding: '18px 20px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Est. Vendor Spend
          </span>
          <Store size={16} aria-hidden="true" style={{ color: 'var(--sky)' }} />
        </div>
        <div
          suppressHydrationWarning
          style={{ fontSize: '1.6rem', fontWeight: 700, fontFamily: 'var(--mono-font)', color: 'var(--text-primary)' }}
        >
          {sym}{formatNumber(totalEstimated)}
        </div>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 4 }}>
          Across {vendorsCount} critical service vendors
        </div>
      </article>

      <article
        role="region"
        tabIndex={0}
        aria-label={`Negotiated Target: ${sym}${formatNumber(totalNegotiated)}`}
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--hairline)',
          borderRadius: 'var(--radius-lg)',
          padding: '18px 20px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Negotiated Target
          </span>
          <DollarSign size={16} aria-hidden="true" style={{ color: 'var(--gold)' }} />
        </div>
        <div
          suppressHydrationWarning
          style={{ fontSize: '1.6rem', fontWeight: 700, fontFamily: 'var(--mono-font)', color: 'var(--gold)' }}
        >
          {sym}{formatNumber(totalNegotiated)}
        </div>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 4 }}>
          Active contracted commitments
        </div>
      </article>

      <article
        role="region"
        tabIndex={0}
        aria-label={`Total Savings Unlocked: +${sym}${formatNumber(totalSavings)}`}
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--hairline)',
          borderRadius: 'var(--radius-lg)',
          padding: '18px 20px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Total Savings Unlocked
          </span>
          <TrendingDown size={16} aria-hidden="true" style={{ color: 'var(--emerald)' }} />
        </div>
        <div
          suppressHydrationWarning
          style={{ fontSize: '1.6rem', fontWeight: 700, fontFamily: 'var(--mono-font)', color: 'var(--emerald)' }}
        >
          +{sym}{formatNumber(totalSavings)}
        </div>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 4 }}>
          Margin preserved via AI scripts
        </div>
      </article>

      <article
        role="region"
        tabIndex={0}
        aria-label={`Vendor Pipeline: ${bookedCount} of ${vendorsCount} contracts secured`}
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--hairline)',
          borderRadius: 'var(--radius-lg)',
          padding: '18px 20px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Confirmed & Locked
          </span>
          <ShieldCheck size={16} aria-hidden="true" style={{ color: 'var(--violet)' }} />
        </div>
        <div
          suppressHydrationWarning
          style={{ fontSize: '1.6rem', fontWeight: 700, fontFamily: 'var(--mono-font)', color: 'var(--text-primary)' }}
        >
          {bookedCount} / {vendorsCount}
        </div>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 4 }}>
          {vendorsCount > 0 ? Math.round((bookedCount / vendorsCount) * 100) : 0}% lock rate
        </div>
      </article>
    </section>
  );
}
