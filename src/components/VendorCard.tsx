'use client';

import React from 'react';
import {
  Calendar,
  AlertTriangle,
  ShieldCheck,
  MessageCircle,
  ArrowRight,
} from 'lucide-react';
import { VendorItem, VendorStatus } from '@/lib/types';
import { formatNumber } from '@/lib/format';

export interface VendorCardProps {
  vendor: VendorItem;
  sym: string;
  onStatusChange: (id: string, newStatus: VendorStatus) => void;
  onNegotiatedCostChange: (id: string, costStr: string) => void;
  onToggleChecklist: (vendorId: string, index: number) => void;
  onOpenDrawer: (vendor: VendorItem) => void;
}

/**
 * VendorCard Component
 *
 * Renders an individual vendor procurement card with market rate vs negotiated
 * cost tracking, status selector, contract red-flag alert, anti-fraud
 * verification checklist, and direct trigger for negotiation scripts.
 */
export default function VendorCard({
  vendor,
  sym,
  onStatusChange,
  onNegotiatedCostChange,
  onToggleChecklist,
  onOpenDrawer,
}: VendorCardProps) {
  const actualCost = vendor.negotiatedCost !== undefined ? vendor.negotiatedCost : vendor.estimatedCost;
  const delta = vendor.estimatedCost - actualCost;
  const checkedArr = vendor.checkedItems || new Array(vendor.verificationChecklist.length).fill(false);
  const checkedCount = checkedArr.filter(Boolean).length;
  const totalChecks = vendor.verificationChecklist.length;

  return (
    <article
      role="listitem"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--hairline)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        transition: 'border-color 0.2s ease, transform 0.2s ease',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
            {vendor.vendorType}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
            <Calendar size={13} aria-hidden="true" /> Target: {vendor.bookingDeadline}
          </div>
        </div>

        <select
          value={vendor.status}
          aria-label={`Update contract status for ${vendor.vendorType}`}
          onChange={(e) => onStatusChange(vendor.id, e.target.value as VendorStatus)}
          style={{
            background: 'var(--surface-elevated)',
            border: '1px solid var(--hairline-strong)',
            color: 'var(--text-primary)',
            fontSize: '0.75rem',
            fontWeight: 600,
            padding: '5px 8px',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            outline: 'none',
          }}
        >
          <option value="shortlisting">Shortlisting</option>
          <option value="negotiating">Negotiating</option>
          <option value="booked">Booked</option>
          <option value="paid">Paid & Closed</option>
        </select>
      </div>

      {/* Pricing breakdown & Editable Negotiated Cost */}
      <div
        style={{
          background: 'var(--surface-elevated)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 14px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 12,
          border: '1px solid var(--hairline)',
        }}
      >
        <div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 2 }}>
            Est. Market Rate
          </div>
          <div
            suppressHydrationWarning
            style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-secondary)', fontFamily: 'var(--mono-font)' }}
          >
            {sym}{formatNumber(vendor.estimatedCost)}
          </div>
        </div>

        <div>
          <label htmlFor={`cost-${vendor.id}`} style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 2 }}>
            Negotiated Cost
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ color: 'var(--gold)', fontWeight: 600, fontSize: '0.85rem' }} aria-hidden="true">{sym}</span>
            <input
              id={`cost-${vendor.id}`}
              type="text"
              aria-label={`Negotiated cost for ${vendor.vendorType}`}
              value={vendor.negotiatedCost !== undefined ? vendor.negotiatedCost : vendor.estimatedCost}
              onChange={(e) => onNegotiatedCostChange(vendor.id, e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                borderBottom: '1px dashed var(--gold)',
                color: 'var(--gold)',
                fontSize: '0.95rem',
                fontWeight: 700,
                fontFamily: 'var(--mono-font)',
                width: '100%',
                padding: '1px 2px',
                outline: 'none',
              }}
            />
          </div>
          {delta > 0 && (
            <div suppressHydrationWarning style={{ fontSize: '0.7rem', color: 'var(--emerald)', marginTop: 2, fontWeight: 600 }}>
              +{sym}{formatNumber(delta)} saved
            </div>
          )}
          {delta < 0 && (
            <div suppressHydrationWarning style={{ fontSize: '0.7rem', color: 'var(--crisis-coral)', marginTop: 2, fontWeight: 600 }}>
              -{sym}{formatNumber(Math.abs(delta))} over est.
            </div>
          )}
        </div>
      </div>

      {/* Red Flag Warning */}
      {vendor.redFlagWarning && (
        <div
          role="alert"
          style={{
            background: 'rgba(244, 63, 94, 0.08)',
            border: '1px solid rgba(244, 63, 94, 0.25)',
            borderRadius: 'var(--radius-md)',
            padding: '10px 12px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 10,
          }}
        >
          <AlertTriangle size={15} aria-hidden="true" style={{ color: 'var(--crisis-coral)', flexShrink: 0, marginTop: 2 }} />
          <div style={{ fontSize: '0.76rem', color: '#FDA4AF', lineHeight: 1.45 }}>
            <strong style={{ color: '#FFE4E6' }}>Contract Red Flag: </strong>
            {vendor.redFlagWarning}
          </div>
        </div>
      )}

      {/* Verification Checklist */}
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 8,
            fontSize: '0.78rem',
            color: 'var(--text-tertiary)',
          }}
        >
          <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
            <ShieldCheck size={14} aria-hidden="true" style={{ color: 'var(--emerald)' }} /> Anti-Fraud Verification
          </span>
          <span className="font-mono">
            {checkedCount} / {totalChecks}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {vendor.verificationChecklist.map((item, idx) => {
            const isChecked = checkedArr[idx] || false;
            const checkId = `check-${vendor.id}-${idx}`;
            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 8,
                  fontSize: '0.78rem',
                  color: isChecked ? 'var(--text-primary)' : 'var(--text-secondary)',
                }}
              >
                <input
                  id={checkId}
                  type="checkbox"
                  aria-label={`Verification item: ${item} for ${vendor.vendorType}`}
                  checked={isChecked}
                  onChange={() => onToggleChecklist(vendor.id, idx)}
                  style={{
                    marginTop: 3,
                    accentColor: 'var(--emerald)',
                    cursor: 'pointer',
                  }}
                />
                <label
                  htmlFor={checkId}
                  style={{
                    cursor: 'pointer',
                    userSelect: 'none',
                    textDecoration: isChecked ? 'line-through' : 'none',
                    opacity: isChecked ? 0.8 : 1,
                  }}
                >
                  {item}
                </label>
              </div>
            );
          })}
        </div>
      </div>

      {/* Negotiation Action Button */}
      <div style={{ marginTop: 'auto', paddingTop: 8 }}>
        <button
          onClick={() => onOpenDrawer(vendor)}
          aria-label={`Open negotiation scripts and WhatsApp generator for ${vendor.vendorType}`}
          aria-haspopup="dialog"
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            padding: '9px 14px',
            background: 'var(--surface-elevated)',
            border: '1px solid var(--hairline-strong)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--text-primary)',
            fontSize: '0.82rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--gold)')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--hairline-strong)')}
        >
          <MessageCircle size={15} aria-hidden="true" style={{ color: 'var(--gold)' }} />
          Negotiation Script & WhatsApp
          <ArrowRight size={14} aria-hidden="true" style={{ color: 'var(--text-tertiary)' }} />
        </button>
      </div>
    </article>
  );
}
