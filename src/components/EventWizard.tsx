'use client';

import React, { useState, useEffect } from 'react';
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

  // Keyboard accessibility: Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const toggleVibe = (tag: string) => {
    setForm(f => ({
      ...f,
      vibeTags: f.vibeTags.includes(tag)
        ? f.vibeTags.filter(t => t !== tag)
        : [...f.vibeTags, tag],
    }));
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!form.title || !form.city) return;
    onGenerate(form);
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="wizard-modal-title"
      onClick={onClose}
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 580, maxHeight: '90vh', overflow: 'auto' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <div>
            <h2 id="wizard-modal-title" style={{ fontSize: 22, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Sparkles size={22} color="var(--gold)" aria-hidden="true" />
              Architect Event Blueprint
            </h2>
            <p id="wizard-modal-desc" style={{ fontSize: 13, color: 'var(--text-tertiary)', marginTop: 4 }}>
              Configure your event parameters for AI-powered planning
            </p>
          </div>
          <button
            className="btn-ghost"
            aria-label="Close Event Architect Wizard"
            onClick={onClose}
            style={{ padding: 6 }}
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '48px 0' }} role="status" aria-live="polite">
            <div className="spinner" aria-hidden="true" style={{ width: 40, height: 40, margin: '0 auto 20px', borderWidth: 3 }} />
            <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--gold)', marginBottom: 8 }}>
              {loadingMessage || 'Architecting your event blueprint...'}
            </p>
            <p style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>
              Multi-shot prompting Groq LPU with strict JSON schemas
            </p>
            <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 300, margin: '24px auto 0' }}>
              {['Analyzing event parameters...', 'Computing budget allocations...', 'Generating vendor scripts...', 'Building crisis protocols...'].map((step, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '8px 12px',
                    background: 'var(--surface)',
                    borderRadius: 'var(--radius-sm)',
                    animation: `fadeIn 0.3s ease ${i * 0.3}s both`,
                  }}
                >
                  <div className="spinner" aria-hidden="true" style={{ width: 14, height: 14 }} />
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{step}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} aria-describedby="wizard-modal-desc">
            {/* Event Type Group */}
            <fieldset style={{ border: 'none', padding: 0, margin: '0 0 20px 0' }}>
              <legend className="label" id="event-type-legend">Event Category Selection</legend>
              <div
                role="group"
                aria-labelledby="event-type-legend"
                style={{ display: 'flex', gap: 8 }}
              >
                {(['Wedding', 'Birthday', 'Community Event'] as EventCategory[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    aria-pressed={form.eventType === type}
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
                    <span aria-hidden="true">{type === 'Wedding' ? '💒 ' : type === 'Birthday' ? '🎂 ' : '🚀 '}</span>
                    {type}
                  </button>
                ))}
              </div>
            </fieldset>

            {/* Title + City */}
            <fieldset style={{ border: 'none', padding: 0, margin: '0 0 16px 0' }}>
              <legend className="sr-only">Event Basics</legend>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label htmlFor="wizard-event-title" className="label">
                    Event Title <span aria-hidden="true" style={{ color: 'var(--crisis-coral)' }}>*</span>
                  </label>
                  <input
                    autoFocus
                    id="wizard-event-title"
                    className="input-field"
                    placeholder="e.g., Royal Heritage Reception"
                    value={form.title}
                    onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
                    required
                    aria-required="true"
                    aria-describedby="title-helper"
                  />
                  <span id="title-helper" className="sr-only">Descriptive title of the planned event</span>
                </div>
                <div>
                  <label htmlFor="wizard-event-city" className="label">
                    <MapPin size={11} aria-hidden="true" style={{ display: 'inline', verticalAlign: 'middle', marginRight: 3 }} />
                    City / Location <span aria-hidden="true" style={{ color: 'var(--crisis-coral)' }}>*</span>
                  </label>
                  <input
                    id="wizard-event-city"
                    className="input-field"
                    placeholder="e.g., Mumbai, Srinagar"
                    value={form.city}
                    onChange={(e) => setForm(f => ({ ...f, city: e.target.value }))}
                    required
                    aria-required="true"
                    aria-describedby="city-helper"
                  />
                  <span id="city-helper" className="sr-only">Destination city or venue location for realistic local market pricing</span>
                </div>
              </div>
            </fieldset>

            {/* Guest Count + Budget + Currency */}
            <fieldset style={{ border: 'none', padding: 0, margin: '0 0 16px 0' }}>
              <legend className="sr-only">Financial and Headcount Parameters</legend>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 100px', gap: 12 }}>
                <div>
                  <label htmlFor="wizard-guest-count" className="label">
                    <Users size={11} aria-hidden="true" style={{ display: 'inline', verticalAlign: 'middle', marginRight: 3 }} />
                    Guest Count (PAX)
                  </label>
                  <input
                    id="wizard-guest-count"
                    type="number"
                    min={1}
                    className="input-field font-mono"
                    value={form.guestCount}
                    onChange={(e) => setForm(f => ({ ...f, guestCount: parseInt(e.target.value) || 0 }))}
                    aria-describedby="guest-count-helper"
                  />
                  <span id="guest-count-helper" className="sr-only">Total number of expected guests</span>
                </div>
                <div>
                  <label htmlFor="wizard-total-budget" className="label">
                    <Wallet size={11} aria-hidden="true" style={{ display: 'inline', verticalAlign: 'middle', marginRight: 3 }} />
                    Total Budget
                  </label>
                  <input
                    id="wizard-total-budget"
                    type="number"
                    min={1000}
                    className="input-field font-mono"
                    value={form.totalBudget}
                    onChange={(e) => setForm(f => ({ ...f, totalBudget: parseInt(e.target.value) || 0 }))}
                    aria-describedby="budget-helper"
                  />
                  <span id="budget-helper" className="sr-only">Total operational event budget allocated</span>
                </div>
                <div>
                  <label htmlFor="wizard-currency-select" className="label">Currency</label>
                  <select
                    id="wizard-currency-select"
                    className="input-field"
                    value={form.currency}
                    onChange={(e) => setForm(f => ({ ...f, currency: e.target.value }))}
                    aria-label="Currency selection"
                  >
                    <option value="INR">₹ INR</option>
                    <option value="USD">$ USD</option>
                  </select>
                </div>
              </div>
            </fieldset>

            {/* Event Date */}
            <div style={{ marginBottom: 16 }}>
              <label htmlFor="wizard-event-date" className="label">
                <Calendar size={11} aria-hidden="true" style={{ display: 'inline', verticalAlign: 'middle', marginRight: 3 }} />
                Event Date
              </label>
              <input
                id="wizard-event-date"
                type="date"
                className="input-field"
                value={form.eventDate}
                onChange={(e) => setForm(f => ({ ...f, eventDate: e.target.value }))}
                aria-label="Scheduled event date"
              />
            </div>

            {/* Vibe Tags */}
            <fieldset style={{ border: 'none', padding: 0, margin: '0 0 16px 0' }}>
              <legend id="vibe-tags-legend" className="label">
                <Tag size={11} aria-hidden="true" style={{ display: 'inline', verticalAlign: 'middle', marginRight: 3 }} />
                Vibe / Theme Tags
              </legend>
              <div
                role="group"
                aria-labelledby="vibe-tags-legend"
                style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}
              >
                {VIBE_PRESETS[form.eventType].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    aria-pressed={form.vibeTags.includes(tag)}
                    aria-label={`Toggle vibe tag: ${tag}`}
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
            </fieldset>

            {/* Dietary Notes */}
            <div style={{ marginBottom: 24 }}>
              <label htmlFor="wizard-dietary-notes" className="label">
                <UtensilsCrossed size={11} aria-hidden="true" style={{ display: 'inline', verticalAlign: 'middle', marginRight: 3 }} />
                Dietary / Cultural Notes
              </label>
              <input
                id="wizard-dietary-notes"
                className="input-field"
                placeholder="e.g., Pure veg, Halal, Jain, Gluten-free"
                value={form.dietaryNotes}
                onChange={(e) => setForm(f => ({ ...f, dietaryNotes: e.target.value }))}
                aria-label="Dietary and cultural specifications"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn-primary"
              disabled={!form.title || !form.city || isLoading}
              aria-label="Generate complete event production blueprint"
              style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: 15 }}
            >
              <Sparkles size={16} aria-hidden="true" />
              <span>Generate Event Blueprint</span>
              <ChevronRight size={16} aria-hidden="true" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
