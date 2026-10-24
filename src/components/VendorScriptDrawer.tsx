'use client';

import React, { useState } from 'react';
import {
  X,
  MessageCircle,
  Mail,
  Copy,
  Check,
  ExternalLink,
} from 'lucide-react';
import { VendorItem } from '@/lib/types';

export interface VendorScriptDrawerProps {
  vendor: VendorItem | null;
  onClose: () => void;
  copied: boolean;
  onCopyScript: (script: string) => void;
}

/**
 * VendorScriptDrawer Component
 *
 * Dedicated modal drawer providing ready-to-fire multi-channel procurement
 * negotiation scripts (WhatsApp Hinglish & Formal RFQ Email) with direct links.
 */
export default function VendorScriptDrawer({
  vendor,
  onClose,
  copied,
  onCopyScript,
}: VendorScriptDrawerProps) {
  const [activeScriptTab, setActiveScriptTab] = useState<'hinglish' | 'email'>('hinglish');

  if (!vendor) return null;

  const currentScript =
    activeScriptTab === 'hinglish'
      ? vendor.scripts.hinglishWhatsApp
      : vendor.scripts.formalEmail;

  const panelId = activeScriptTab === 'hinglish' ? 'panel-hinglish' : 'panel-email';
  const labelledBy = activeScriptTab === 'hinglish' ? 'tab-hinglish' : 'tab-email';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="script-modal-title"
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--hairline-strong)',
          borderRadius: 'var(--radius-xl)',
          maxWidth: 620,
          width: '100%',
          padding: 24,
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.6)',
          position: 'relative',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <h3 id="script-modal-title" style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {vendor.vendorType} — Negotiation Deck
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
              Ready-to-fire multi-channel procurement scripts crafted for this vendor category.
            </p>
          </div>
          <button
            autoFocus
            onClick={onClose}
            aria-label="Close negotiation script drawer"
            style={{
              background: 'var(--surface-elevated)',
              border: '1px solid var(--hairline)',
              borderRadius: '50%',
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
            }}
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        {/* Script Tab Switcher */}
        <div
          role="tablist"
          aria-label="Negotiation Script Formats"
          style={{
            display: 'flex',
            background: 'var(--surface-elevated)',
            padding: 4,
            borderRadius: 'var(--radius-md)',
            marginBottom: 16,
            gap: 4,
          }}
        >
          <button
            role="tab"
            id="tab-hinglish"
            aria-selected={activeScriptTab === 'hinglish'}
            aria-controls="panel-hinglish"
            onClick={() => setActiveScriptTab('hinglish')}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              border: 'none',
              background: activeScriptTab === 'hinglish' ? 'var(--emerald-dim)' : 'transparent',
              color: activeScriptTab === 'hinglish' ? 'var(--emerald)' : 'var(--text-secondary)',
            }}
          >
            <MessageCircle size={15} aria-hidden="true" /> WhatsApp (Hinglish / Local Tone)
          </button>
          <button
            role="tab"
            id="tab-email"
            aria-selected={activeScriptTab === 'email'}
            aria-controls="panel-email"
            onClick={() => setActiveScriptTab('email')}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              border: 'none',
              background: activeScriptTab === 'email' ? 'var(--sky-dim)' : 'transparent',
              color: activeScriptTab === 'email' ? 'var(--sky)' : 'var(--text-secondary)',
            }}
          >
            <Mail size={15} aria-hidden="true" /> Formal RFQ Email
          </button>
        </div>

        {/* Script Box */}
        <div
          role="tabpanel"
          id={panelId}
          aria-labelledby={labelledBy}
          tabIndex={0}
          style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
        >
          <div
            tabIndex={0}
            aria-label={`Script content in ${activeScriptTab === 'hinglish' ? 'Hinglish WhatsApp format' : 'Formal RFQ email format'}`}
            style={{
              background: 'var(--carbon)',
              border: '1px solid var(--hairline)',
              borderRadius: 'var(--radius-md)',
              padding: 16,
              fontSize: '0.86rem',
              lineHeight: 1.6,
              color: 'var(--text-primary)',
              whiteSpace: 'pre-wrap',
              fontFamily: 'var(--sans-font)',
              maxHeight: 260,
              overflowY: 'auto',
            }}
          >
            {currentScript}
          </div>

          {/* Actions Bar */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            <button
              onClick={() => onCopyScript(currentScript)}
              aria-label="Copy negotiation script to clipboard"
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '10px 16px',
                background: copied ? 'var(--emerald)' : 'var(--surface-elevated)',
                border: '1px solid var(--hairline-strong)',
                borderRadius: 'var(--radius-sm)',
                color: copied ? '#0B0C10' : 'var(--text-primary)',
                fontSize: '0.84rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
              {copied ? 'Copied to Clipboard!' : 'Copy Script'}
            </button>

            {activeScriptTab === 'hinglish' ? (
              <a
                href={`https://wa.me/?text=${encodeURIComponent(currentScript)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open WhatsApp message to ${vendor.vendorType}`}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  padding: '10px 16px',
                  background: '#25D366',
                  color: '#0B0C10',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  cursor: 'pointer',
                }}
              >
                <MessageCircle size={16} aria-hidden="true" /> Open in WhatsApp <ExternalLink size={14} aria-hidden="true" />
              </a>
            ) : (
              <a
                href={`mailto:?subject=${encodeURIComponent(
                  `Request for Quotation — ${vendor.vendorType}`
                )}&body=${encodeURIComponent(currentScript)}`}
                aria-label={`Open email client with RFQ to ${vendor.vendorType}`}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  padding: '10px 16px',
                  background: 'var(--sky)',
                  color: '#0B0C10',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  cursor: 'pointer',
                }}
              >
                <Mail size={16} aria-hidden="true" /> Open in Email Client <ExternalLink size={14} aria-hidden="true" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
