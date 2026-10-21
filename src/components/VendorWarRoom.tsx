'use client';

import React, { useState } from 'react';
import {
  Store,
  DollarSign,
  TrendingDown,
  CheckSquare,
  AlertTriangle,
  MessageCircle,
  Mail,
  Copy,
  Check,
  ExternalLink,
  Plus,
  Filter,
  X,
  Calendar,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { VendorItem, VendorStatus } from '@/lib/types';
import { formatNumber } from '@/lib/format';

interface VendorWarRoomProps {
  vendors: VendorItem[];
  currency: string;
  onUpdateVendors: (updated: VendorItem[]) => void;
}

const STATUS_LABELS: Record<VendorStatus, { label: string; colorClass: string; bg: string }> = {
  shortlisting: { label: 'Shortlisting', colorClass: 'sky-badge', bg: 'var(--sky-dim)' },
  negotiating: { label: 'Negotiating', colorClass: 'gold-badge', bg: 'var(--gold-dim)' },
  booked: { label: 'Booked', colorClass: 'emerald-badge', bg: 'var(--emerald-dim)' },
  paid: { label: 'Paid & Closed', colorClass: 'purple-badge', bg: 'var(--violet-dim)' },
};

export default function VendorWarRoom({ vendors, currency, onUpdateVendors }: VendorWarRoomProps) {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeDrawerVendor, setActiveDrawerVendor] = useState<VendorItem | null>(null);
  const [activeScriptTab, setActiveScriptTab] = useState<'hinglish' | 'email'>('hinglish');
  const [copied, setCopied] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newVendor, setNewVendor] = useState({
    vendorType: '',
    estimatedCost: 20000,
    bookingDeadline: '2 Weeks Before Event',
    redFlagWarning: 'Demands 100% upfront cash without GST invoice or signed service level contract.',
  });

  const sym = currency === 'INR' ? '₹' : '$';

  // Calculations
  const totalEstimated = vendors.reduce((acc, v) => acc + v.estimatedCost, 0);
  const totalNegotiated = vendors.reduce(
    (acc, v) => acc + (v.negotiatedCost !== undefined ? v.negotiatedCost : v.estimatedCost),
    0
  );
  const totalSavings = Math.max(0, totalEstimated - totalNegotiated);
  const bookedCount = vendors.filter(v => v.status === 'booked' || v.status === 'paid').length;

  const filteredVendors = vendors.filter(v => {
    if (statusFilter === 'all') return true;
    return v.status === statusFilter;
  });

  const handleStatusChange = (id: string, newStatus: VendorStatus) => {
    const updated = vendors.map(v => (v.id === id ? { ...v, status: newStatus } : v));
    onUpdateVendors(updated);
  };

  const handleNegotiatedCostChange = (id: string, costStr: string) => {
    const cost = parseInt(costStr.replace(/\D/g, '') || '0', 10);
    const updated = vendors.map(v => (v.id === id ? { ...v, negotiatedCost: cost } : v));
    onUpdateVendors(updated);
  };

  const handleToggleChecklist = (vendorId: string, index: number) => {
    const updated = vendors.map(v => {
      if (v.id !== vendorId) return v;
      const currentChecked = v.checkedItems || new Array(v.verificationChecklist.length).fill(false);
      const nextChecked = [...currentChecked];
      nextChecked[index] = !nextChecked[index];
      return { ...v, checkedItems: nextChecked };
    });
    onUpdateVendors(updated);
  };

  const handleCopyScript = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddVendor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVendor.vendorType.trim()) return;

    const added: VendorItem = {
      id: `custom-vendor-${Date.now()}`,
      vendorType: newVendor.vendorType.trim(),
      estimatedCost: Number(newVendor.estimatedCost) || 0,
      negotiatedCost: Number(newVendor.estimatedCost) || 0,
      bookingDeadline: newVendor.bookingDeadline || '1 Month Before',
      status: 'shortlisting',
      verificationChecklist: [
        'Verified past work / portfolio photos',
        'Signed contract with cancellation clause',
        'Direct phone number of on-site supervisor',
        'Confirmation of backup equipment / personnel',
      ],
      checkedItems: [false, false, false, false],
      redFlagWarning: newVendor.redFlagWarning,
      scripts: {
        hinglishWhatsApp: `Hi ${newVendor.vendorType} team! Humare upcoming event ke liye quotation chahiye. Date fixed hai, PAX verified hai. Best rate and package details bhej sakte hain please?`,
        formalEmail: `Dear ${newVendor.vendorType} Team,\n\nWe are currently evaluating vendors for our upcoming event. Please find our requirements attached and provide your comprehensive proposal along with commercial quotations and payment terms.\n\nBest regards,\nEvent Production Team`,
      },
    };

    onUpdateVendors([...vendors, added]);
    setNewVendor({
      vendorType: '',
      estimatedCost: 20000,
      bookingDeadline: '2 Weeks Before Event',
      redFlagWarning: 'Demands 100% upfront cash without GST invoice or signed service level contract.',
    });
    setShowAddModal(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* ─── Top Metrics Bar ────────────────────────────────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 16,
        }}
      >
        <div
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
            <Store size={16} style={{ color: 'var(--sky)' }} />
          </div>
          <div
            suppressHydrationWarning
            style={{ fontSize: '1.6rem', fontWeight: 700, fontFamily: 'var(--mono-font)', color: 'var(--text-primary)' }}
          >
            {sym}{formatNumber(totalEstimated)}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 4 }}>
            Across {vendors.length} critical service vendors
          </div>
        </div>

        <div
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
            <DollarSign size={16} style={{ color: 'var(--gold)' }} />
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
        </div>

        <div
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
            <TrendingDown size={16} style={{ color: 'var(--emerald)' }} />
          </div>
          <div
            suppressHydrationWarning
            style={{ fontSize: '1.6rem', fontWeight: 700, fontFamily: 'var(--mono-font)', color: 'var(--emerald)' }}
          >
            +{sym}{formatNumber(totalSavings)}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 4 }}>
            Direct negotiation yield achieved
          </div>
        </div>

        <div
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
              Vendor Pipeline
            </span>
            <ShieldCheck size={16} style={{ color: 'var(--violet)' }} />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, fontFamily: 'var(--mono-font)', color: 'var(--text-primary)' }}>
            {bookedCount} / {vendors.length}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 4 }}>
            {Math.round((bookedCount / (vendors.length || 1)) * 100)}% contracts secured
          </div>
        </div>
      </div>

      {/* ─── Filter & Action Controls ───────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          padding: '14px 18px',
          background: 'var(--surface)',
          border: '1px solid var(--hairline)',
          borderRadius: 'var(--radius-md)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Filter size={14} /> Filter Status:
          </span>
          {(['all', 'shortlisting', 'negotiating', 'booked', 'paid'] as const).map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              style={{
                padding: '5px 12px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                border: statusFilter === st ? '1px solid var(--gold)' : '1px solid var(--hairline)',
                background: statusFilter === st ? 'var(--gold-dim)' : 'transparent',
                color: statusFilter === st ? 'var(--gold)' : 'var(--text-secondary)',
              }}
            >
              {st === 'all' ? 'All Vendors' : STATUS_LABELS[st].label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '7px 14px',
            background: 'var(--surface-elevated)',
            border: '1px solid var(--hairline-strong)',
            color: 'var(--text-primary)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.82rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'background 0.15s ease',
          }}
        >
          <Plus size={14} /> Add Vendor Slot
        </button>
      </div>

      {/* ─── Vendors Grid ───────────────────────────────────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: 20,
        }}
      >
        {filteredVendors.map(vendor => {
          const actualCost = vendor.negotiatedCost !== undefined ? vendor.negotiatedCost : vendor.estimatedCost;
          const delta = vendor.estimatedCost - actualCost;
          const checkedArr = vendor.checkedItems || new Array(vendor.verificationChecklist.length).fill(false);
          const checkedCount = checkedArr.filter(Boolean).length;
          const totalChecks = vendor.verificationChecklist.length;

          return (
            <div
              key={vendor.id}
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
                    <Calendar size={13} /> Target: {vendor.bookingDeadline}
                  </div>
                </div>

                <select
                  value={vendor.status}
                  onChange={e => handleStatusChange(vendor.id, e.target.value as VendorStatus)}
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
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 2 }}>
                    Negotiated Cost
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ color: 'var(--gold)', fontWeight: 600, fontSize: '0.85rem' }}>{sym}</span>
                    <input
                      type="text"
                      value={vendor.negotiatedCost !== undefined ? vendor.negotiatedCost : vendor.estimatedCost}
                      onChange={e => handleNegotiatedCostChange(vendor.id, e.target.value)}
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
                  <AlertTriangle size={15} style={{ color: 'var(--crisis-coral)', flexShrink: 0, marginTop: 2 }} />
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
                    <ShieldCheck size={14} style={{ color: 'var(--emerald)' }} /> Anti-Fraud Verification
                  </span>
                  <span style={{ fontFamily: 'var(--mono-font)' }}>
                    {checkedCount} / {totalChecks}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {vendor.verificationChecklist.map((item, idx) => {
                    const isChecked = checkedArr[idx] || false;
                    return (
                      <label
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 8,
                          fontSize: '0.78rem',
                          color: isChecked ? 'var(--text-primary)' : 'var(--text-secondary)',
                          cursor: 'pointer',
                          userSelect: 'none',
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleChecklist(vendor.id, idx)}
                          style={{
                            marginTop: 3,
                            accentColor: 'var(--emerald)',
                            cursor: 'pointer',
                          }}
                        />
                        <span style={{ textDecoration: isChecked ? 'line-through' : 'none', opacity: isChecked ? 0.8 : 1 }}>
                          {item}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Negotiation Action Button */}
              <div style={{ marginTop: 'auto', paddingTop: 8 }}>
                <button
                  onClick={() => {
                    setActiveDrawerVendor(vendor);
                    setActiveScriptTab('hinglish');
                  }}
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
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--gold)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--hairline-strong)')}
                >
                  <MessageCircle size={15} style={{ color: 'var(--gold)' }} />
                  Negotiation Script & WhatsApp
                  <ArrowRight size={14} style={{ color: 'var(--text-tertiary)' }} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── Script Drawer Modal ────────────────────────────────────────── */}
      {activeDrawerVendor && (
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
          onClick={() => setActiveDrawerVendor(null)}
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
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {activeDrawerVendor.vendorType} — Negotiation Deck
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                  Ready-to-fire multi-channel procurement scripts crafted for this vendor category.
                </p>
              </div>
              <button
                onClick={() => setActiveDrawerVendor(null)}
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
                <X size={16} />
              </button>
            </div>

            {/* Script Tab Switcher */}
            <div
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
                <MessageCircle size={15} /> WhatsApp (Hinglish / Local Tone)
              </button>
              <button
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
                <Mail size={15} /> Formal RFQ Email
              </button>
            </div>

            {/* Script Box */}
            {(() => {
              const currentScript =
                activeScriptTab === 'hinglish'
                  ? activeDrawerVendor.scripts.hinglishWhatsApp
                  : activeDrawerVendor.scripts.formalEmail;

              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div
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
                      onClick={() => handleCopyScript(currentScript)}
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
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                      {copied ? 'Copied to Clipboard!' : 'Copy Script'}
                    </button>

                    {activeScriptTab === 'hinglish' ? (
                      <a
                        href={`https://wa.me/?text=${encodeURIComponent(currentScript)}`}
                        target="_blank"
                        rel="noopener noreferrer"
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
                        <MessageCircle size={16} /> Open in WhatsApp <ExternalLink size={14} />
                      </a>
                    ) : (
                      <a
                        href={`mailto:?subject=${encodeURIComponent(
                          `Request for Quotation — ${activeDrawerVendor.vendorType}`
                        )}&body=${encodeURIComponent(currentScript)}`}
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
                        <Mail size={16} /> Open in Email Client <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* ─── Add Custom Vendor Modal ─────────────────────────────────────── */}
      {showAddModal && (
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
          onClick={() => setShowAddModal(false)}
        >
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--hairline-strong)',
              borderRadius: 'var(--radius-xl)',
              maxWidth: 480,
              width: '100%',
              padding: 24,
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.6)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Add New Vendor Slot
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-tertiary)',
                  cursor: 'pointer',
                }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddVendor} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 6 }}>
                  Vendor Type / Specialization *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Drone Videography, Baraat Band, Dessert Cart"
                  value={newVendor.vendorType}
                  onChange={e => setNewVendor(v => ({ ...v, vendorType: e.target.value }))}
                  required
                  style={{
                    width: '100%',
                    background: 'var(--surface-elevated)',
                    border: '1px solid var(--hairline-strong)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '9px 12px',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 6 }}>
                  Estimated Budget ({currency})
                </label>
                <input
                  type="number"
                  value={newVendor.estimatedCost}
                  onChange={e => setNewVendor(v => ({ ...v, estimatedCost: Number(e.target.value) }))}
                  style={{
                    width: '100%',
                    background: 'var(--surface-elevated)',
                    border: '1px solid var(--hairline-strong)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '9px 12px',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 6 }}>
                  Target Booking Deadline
                </label>
                <input
                  type="text"
                  placeholder="e.g. 3 Weeks Prior"
                  value={newVendor.bookingDeadline}
                  onChange={e => setNewVendor(v => ({ ...v, bookingDeadline: e.target.value }))}
                  style={{
                    width: '100%',
                    background: 'var(--surface-elevated)',
                    border: '1px solid var(--hairline-strong)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '9px 12px',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 6 }}>
                  Red Flag / Watchout Note
                </label>
                <textarea
                  value={newVendor.redFlagWarning}
                  onChange={e => setNewVendor(v => ({ ...v, redFlagWarning: e.target.value }))}
                  rows={2}
                  style={{
                    width: '100%',
                    background: 'var(--surface-elevated)',
                    border: '1px solid var(--hairline-strong)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '9px 12px',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem',
                    outline: 'none',
                    resize: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    background: 'var(--surface-elevated)',
                    border: '1px solid var(--hairline)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text-secondary)',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '10px',
                    background: 'var(--gold)',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    color: '#0B0C10',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                  }}
                >
                  Save Vendor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
