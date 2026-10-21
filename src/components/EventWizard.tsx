'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  MapPin,
  Users,
  Wallet,
  Calendar,
  Tag,
  UtensilsCrossed,
  X,
  ChevronRight,
} from 'lucide-react';
import { EventWizardInput, EventCategory } from '@/lib/types';

interface EventWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (input: EventWizardInput) => void;
  isLoading: boolean;
  loadingMessage: string;
}

const VIBE_PRESETS: Record<EventCategory, string[]> = {
  Wedding: ['Traditional Royal', 'Minimalist Modern', 'Rustic Bohemian', 'Destination Beach', 'Garden Elegance', 'Cultural Heritage'],
  Birthday: ['Cyberpunk Neon', 'Elegant Cocktail', 'Backyard BBQ', 'Adventure Theme', 'Vintage Retro', 'Pool Party'],
  'Community Event': ['Tech Conference', 'Campus Hackathon', 'Cultural Festival', 'Networking Mixer', 'Workshop Series', 'Charity Gala'],
};

export default function EventWizard({ isOpen, onClose, onGenerate, isLoading, loadingMessage }: EventWizardProps) {
  const [form, setForm] = useState<EventWizardInput>({
    eventType: 'Wedding',
    title: '',
    city: '',
    guestCount: 200,
    totalBudget: 500000,
    currency: 'INR',
    eventDate: '',
    vibeTags: [],
    dietaryNotes: '',
  });

  const toggleVibe = (tag: string) => {
    setForm(f => ({
      ...f,
      vibeTags: f.vibeTags.includes(tag)
        ? f.vibeTags.filter(t => t !== tag)
        : [...f.vibeTags, tag],
    }));
  };

  const handleSubmit = () => {
    if (!form.title || !form.city) return;
    onGenerate(form);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 580, maxHeight: '90vh', overflow: 'auto' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Sparkles size={22} color="var(--gold)" />
              Architect Event Blueprint
            </h2>
            <p style={{ fontSize: 13, color: 'var(--text-tertiary)', marginTop: 4 }}>
              Configure your event parameters for AI-powered planning
            </p>
          </div>
          <button className="btn-ghost" onClick={onClose} style={{ padding: 6 }}>
            <X size={18} />
          </button>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <div className="spinner" style={{ width: 40, height: 40, margin: '0 auto 20px', borderWidth: 3 }} />
            <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--gold)', marginBottom: 8 }}>
              {loadingMessage || 'Architecting your event blueprint...'}
            </p>
            <p style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>
              Multi-shot prompting Groq LPU with strict JSON schemas
            </p>
            <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 300, margin: '24px auto 0' }}>
              {['Analyzing event parameters...', 'Computing budget allocations...', 'Generating vendor scripts...', 'Building crisis protocols...'].map((step, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '8px 12px',
                  background: 'var(--surface)',
                  borderRadius: 'var(--radius-sm)',
                  animation: `fadeIn 0.3s ease ${i * 0.3}s both`,
                }}>
                  <div className="spinner" style={{ width: 14, height: 14 }} />
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{step}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Event Type */}
            <div style={{ marginBottom: 20 }}>
              <label className="label">Event Type</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {(['Wedding', 'Birthday', 'Community Event'] as EventCategory[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setForm(f => ({ ...f, eventType: type, vibeTags: [] }))}
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      background: form.eventType === type ? 'var(--gold-dim)' : 'var(--carbon)',
                      border: `1px solid ${form.eventType === type ? 'var(--gold)' : 'var(--hairline-strong)'}`,
                      borderRadius: 'var(--radius-md)',
                      color: form.eventType === type ? 'var(--gold)' : 'var(--text-secondary)',
                      fontWeight: 600,
                      fontSize: 13,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    {type === 'Wedding' ? '💒' : type === 'Birthday' ? '🎂' : '🚀'} {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Title + City */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              <div>
                <label className="label">Event Title</label>
                <input
                  className="input-field"
                  placeholder="e.g., Royal Heritage Reception"
                  value={form.title}
                  onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
                />
              </div>
              <div>
                <label className="label">
                  <MapPin size={11} style={{ display: 'inline', verticalAlign: 'middle' }} /> City / Location
                </label>
                <input
                  className="input-field"
                  placeholder="e.g., Mumbai, Srinagar"
                  value={form.city}
                  onChange={(e) => setForm(f => ({ ...f, city: e.target.value }))}
                />
              </div>
            </div>

            {/* Guest Count + Budget + Currency */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 100px', gap: 12, marginBottom: 16 }}>
              <div>
                <label className="label">
                  <Users size={11} style={{ display: 'inline', verticalAlign: 'middle' }} /> Guest Count (PAX)
                </label>
                <input
                  type="number"
                  className="input-field font-mono"
                  value={form.guestCount}
                  onChange={(e) => setForm(f => ({ ...f, guestCount: parseInt(e.target.value) || 0 }))}
                />
              </div>
              <div>
                <label className="label">
                  <Wallet size={11} style={{ display: 'inline', verticalAlign: 'middle' }} /> Total Budget
                </label>
                <input
                  type="number"
                  className="input-field font-mono"
                  value={form.totalBudget}
                  onChange={(e) => setForm(f => ({ ...f, totalBudget: parseInt(e.target.value) || 0 }))}
                />
              </div>
              <div>
                <label className="label">Currency</label>
                <select
                  className="input-field"
                  value={form.currency}
                  onChange={(e) => setForm(f => ({ ...f, currency: e.target.value }))}
                >
                  <option value="INR">₹ INR</option>
                  <option value="USD">$ USD</option>
                </select>
              </div>
            </div>

            {/* Event Date */}
            <div style={{ marginBottom: 16 }}>
              <label className="label">
                <Calendar size={11} style={{ display: 'inline', verticalAlign: 'middle' }} /> Event Date
              </label>
              <input
                type="date"
                className="input-field"
                value={form.eventDate}
                onChange={(e) => setForm(f => ({ ...f, eventDate: e.target.value }))}
              />
            </div>

            {/* Vibe Tags */}
            <div style={{ marginBottom: 16 }}>
              <label className="label">
                <Tag size={11} style={{ display: 'inline', verticalAlign: 'middle' }} /> Vibe / Theme Tags
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {VIBE_PRESETS[form.eventType].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleVibe(tag)}
                    style={{
                      padding: '6px 12px',
                      fontSize: 12,
                      fontWeight: 600,
                      borderRadius: 999,
                      border: `1px solid ${form.vibeTags.includes(tag) ? 'var(--gold)' : 'var(--hairline-strong)'}`,
                      background: form.vibeTags.includes(tag) ? 'var(--gold-dim)' : 'transparent',
                      color: form.vibeTags.includes(tag) ? 'var(--gold)' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Dietary Notes */}
            <div style={{ marginBottom: 24 }}>
              <label className="label">
                <UtensilsCrossed size={11} style={{ display: 'inline', verticalAlign: 'middle' }} /> Dietary / Cultural Notes
              </label>
              <input
                className="input-field"
                placeholder="e.g., Pure veg, Halal, Jain, Gluten-free"
                value={form.dietaryNotes}
                onChange={(e) => setForm(f => ({ ...f, dietaryNotes: e.target.value }))}
              />
            </div>

            {/* Submit */}
            <button
              className="btn-primary"
              onClick={handleSubmit}
              disabled={!form.title || !form.city}
              style={{ width: '100%', justifyContent: 'center', padding: '14px 24px', fontSize: 15 }}
            >
              <Sparkles size={18} />
              Architect Event Blueprint ⚡
              <ChevronRight size={16} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
