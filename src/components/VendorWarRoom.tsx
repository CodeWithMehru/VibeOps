'use client';

import React, { useState, useEffect } from 'react';
import {
  Plus,
  Filter,
} from 'lucide-react';
import { VendorItem, VendorStatus } from '@/lib/types';
import VendorCard from './VendorCard';
import VendorScriptDrawer from './VendorScriptDrawer';
import VendorAddModal from './VendorAddModal';
import VendorMetricsBanner from './VendorMetricsBanner';

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

/**
 * VendorWarRoom Component
 *
 * Master procurement cockpit: rate negotiation, anti-fraud verification
 * checklists, red-flag monitoring, and contract status tracking.
 */
export default function VendorWarRoom({ vendors, currency, onUpdateVendors }: VendorWarRoomProps) {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeDrawerVendor, setActiveDrawerVendor] = useState<VendorItem | null>(null);
  const [copied, setCopied] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Keyboard accessibility: Escape key listener closes negotiation drawer and add modal
  useEffect(() => {
    if (!activeDrawerVendor && !showAddModal) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveDrawerVendor(null);
        setShowAddModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeDrawerVendor, showAddModal]);

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

  const handleAddVendor = (formData: {
    vendorType: string;
    estimatedCost: number;
    bookingDeadline: string;
    redFlagWarning: string;
  }) => {
    const added: VendorItem = {
      id: `custom-vendor-${Date.now()}`,
      vendorType: formData.vendorType.trim(),
      estimatedCost: Number(formData.estimatedCost) || 0,
      negotiatedCost: Number(formData.estimatedCost) || 0,
      bookingDeadline: formData.bookingDeadline || '1 Month Before',
      status: 'shortlisting',
      verificationChecklist: [
        'Verified past work / portfolio photos',
        'Signed contract with cancellation clause',
        'Direct phone number of on-site supervisor',
        'Confirmation of backup equipment / personnel',
      ],
      checkedItems: [false, false, false, false],
      redFlagWarning: formData.redFlagWarning,
      scripts: {
        hinglishWhatsApp: `Hi ${formData.vendorType} team! Humare upcoming event ke liye quotation chahiye. Date fixed hai, PAX verified hai. Best rate and package details bhej sakte hain please?`,
        formalEmail: `Dear ${formData.vendorType} Team,\n\nWe are currently evaluating vendors for our upcoming event. Please find our requirements attached and provide your comprehensive proposal along with commercial quotations and payment terms.\n\nBest regards,\nEvent Production Team`,
      },
    };

    onUpdateVendors([...vendors, added]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }} role="region" aria-label="Vendor War-Room and Negotiation Studio">
      {/* ─── Top Metrics Bar ────────────────────────────────────────────── */}
      <VendorMetricsBanner
        sym={sym}
        totalEstimated={totalEstimated}
        totalNegotiated={totalNegotiated}
        totalSavings={totalSavings}
        bookedCount={bookedCount}
        vendorsCount={vendors.length}
      />

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
        className="no-print"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }} role="group" aria-label="Vendor Status Filters">
          <span style={{ fontSize: '0.82rem', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Filter size={14} aria-hidden="true" /> Filter Status:
          </span>
          {(['all', 'shortlisting', 'negotiating', 'booked', 'paid'] as const).map(st => (
            <button
              key={st}
              aria-pressed={statusFilter === st}
              aria-label={`Filter vendors: ${st === 'all' ? 'All Vendors' : STATUS_LABELS[st].label}`}
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
          aria-label="Add new vendor slot"
          aria-haspopup="dialog"
          aria-expanded={showAddModal}
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
          <Plus size={14} aria-hidden="true" /> Add Vendor Slot
        </button>
      </div>

      {/* ─── Vendors Grid ───────────────────────────────────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: 20,
        }}
        role="list"
        aria-label="Vendors Checklist"
      >
        {filteredVendors.map(vendor => (
          <VendorCard
            key={vendor.id}
            vendor={vendor}
            sym={sym}
            onStatusChange={handleStatusChange}
            onNegotiatedCostChange={handleNegotiatedCostChange}
            onToggleChecklist={handleToggleChecklist}
            onOpenDrawer={setActiveDrawerVendor}
          />
        ))}
      </div>

      {/* ─── Script Drawer Modal ────────────────────────────────────────── */}
      <VendorScriptDrawer
        vendor={activeDrawerVendor}
        onClose={() => setActiveDrawerVendor(null)}
        copied={copied}
        onCopyScript={handleCopyScript}
      />

      {/* ─── Add Custom Vendor Modal ─────────────────────────────────────── */}
      <VendorAddModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        currency={currency}
        onAddVendor={handleAddVendor}
      />
    </div>
  );
}
