'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';

export interface VendorAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddVendor: (vendor: {
    vendorType: string;
    estimatedCost: number;
    bookingDeadline: string;
    redFlagWarning: string;
  }) => void;
  currency: string;
}

/**
 * VendorAddModal Component
 *
 * Accessible modal dialog enabling event producers to add custom vendor
 * categories, budgets, and anti-fraud watchout conditions to the war-room.
 */
export default function VendorAddModal({
  isOpen,
  onClose,
  onAddVendor,
  currency,
}: VendorAddModalProps) {
  const [form, setForm] = useState({
    vendorType: '',
    estimatedCost: 20000,
    bookingDeadline: '2 Weeks Before Event',
    redFlagWarning: 'Demands 100% upfront cash without GST invoice or signed service level contract.',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.vendorType.trim()) return;
    onAddVendor(form);
    setForm({
      vendorType: '',
      estimatedCost: 20000,
      bookingDeadline: '2 Weeks Before Event',
      redFlagWarning: 'Demands 100% upfront cash without GST invoice or signed service level contract.',
    });
    onClose();
  };

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
      aria-labelledby="add-vendor-modal-title"
      onClick={onClose}
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
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <h3 id="add-vendor-modal-title" style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Add New Vendor Slot
          </h3>
          <button
            onClick={onClose}
            aria-label="Close add vendor modal"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-tertiary)',
              cursor: 'pointer',
            }}
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label htmlFor="new-vendor-type" style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 6 }}>
              Vendor Type / Specialization *
            </label>
            <input
              autoFocus
              id="new-vendor-type"
              type="text"
              placeholder="e.g., Drone Videography, Baraat Band, Dessert Cart"
              value={form.vendorType}
              onChange={(e) => setForm((v) => ({ ...v, vendorType: e.target.value }))}
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
            <label htmlFor="new-vendor-budget" style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 6 }}>
              Estimated Budget ({currency})
            </label>
            <input
              id="new-vendor-budget"
              type="number"
              value={form.estimatedCost}
              onChange={(e) => setForm((v) => ({ ...v, estimatedCost: Number(e.target.value) }))}
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
            <label htmlFor="new-vendor-deadline" style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 6 }}>
              Target Booking Deadline
            </label>
            <input
              id="new-vendor-deadline"
              type="text"
              placeholder="e.g. 3 Weeks Prior"
              value={form.bookingDeadline}
              onChange={(e) => setForm((v) => ({ ...v, bookingDeadline: e.target.value }))}
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
            <label htmlFor="new-vendor-warning" style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 6 }}>
              Red Flag / Watchout Note
            </label>
            <textarea
              id="new-vendor-warning"
              value={form.redFlagWarning}
              onChange={(e) => setForm((v) => ({ ...v, redFlagWarning: e.target.value }))}
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
              onClick={onClose}
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
  );
}
