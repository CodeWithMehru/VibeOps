'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';

export interface VibeAddIdeaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddIdea: (idea: {
    title: string;
    category: string;
    estimatedCost: number;
    impactScore: string;
    executionBlueprint: string;
  }) => void;
  currency: string;
}

/**
 * VibeAddIdeaModal Component
 *
 * Accessible modal dialog enabling event producers to add bespoke creative
 * concepts, viral activations, and step-by-step SOP blueprints to the Vibe Lab.
 */
export default function VibeAddIdeaModal({
  isOpen,
  onClose,
  onAddIdea,
  currency,
}: VibeAddIdeaModalProps) {
  const [newIdea, setNewIdea] = useState({
    title: '',
    category: 'Guest Engagement',
    estimatedCost: 10000,
    impactScore: '9.2/10',
    executionBlueprint:
      'Step 1: Procure required materials 48h prior. Step 2: Brief the emcee and event coordinators. Step 3: Run live activation during peak guest energy window. Step 4: Capture high-res photography and video for instant social media reels.',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIdea.title.trim()) return;

    onAddIdea({
      title: newIdea.title.trim(),
      category: newIdea.category,
      estimatedCost: Number(newIdea.estimatedCost) || 0,
      impactScore: newIdea.impactScore || '9.0/10',
      executionBlueprint: newIdea.executionBlueprint,
    });

    setNewIdea({
      title: '',
      category: 'Guest Engagement',
      estimatedCost: 10000,
      impactScore: '9.2/10',
      executionBlueprint:
        'Step 1: Procure required materials 48h prior. Step 2: Brief the emcee and event coordinators. Step 3: Run live activation during peak guest energy window. Step 4: Capture high-res photography and video for instant social media reels.',
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
      aria-labelledby="custom-activation-title"
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--hairline-strong)',
          borderRadius: 'var(--radius-xl)',
          maxWidth: 500,
          width: '100%',
          padding: 24,
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.6)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <h3 id="custom-activation-title" style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Add Custom Event Activation
          </h3>
          <button
            onClick={onClose}
            aria-label="Close add custom activation modal"
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
            <label
              htmlFor="custom-idea-title-input"
              style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 6 }}
            >
              Activation Concept Title *
            </label>
            <input
              autoFocus
              id="custom-idea-title-input"
              type="text"
              placeholder="e.g., Drone Light QR Code, Midnight Chai Bar"
              value={newIdea.title}
              onChange={(e) => setNewIdea((i) => ({ ...i, title: e.target.value }))}
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label
                htmlFor="custom-idea-category-select"
                style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 6 }}
              >
                Category
              </label>
              <select
                id="custom-idea-category-select"
                value={newIdea.category}
                onChange={(e) => setNewIdea((i) => ({ ...i, category: e.target.value }))}
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
              >
                <option value="Guest Engagement">Guest Engagement</option>
                <option value="Low-Cost High-Impact">Low-Cost High-Impact</option>
                <option value="Cultural/Theme Ritual">Cultural/Theme Ritual</option>
                <option value="Photo/Video Moment">Photo/Video Moment</option>
                <option value="Late Night Surge">Late Night Surge</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="custom-idea-cost-input"
                style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 6 }}
              >
                Est. Cost ({currency})
              </label>
              <input
                id="custom-idea-cost-input"
                type="number"
                value={newIdea.estimatedCost}
                onChange={(e) => setNewIdea((i) => ({ ...i, estimatedCost: Number(e.target.value) }))}
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
          </div>

          <div>
            <label
              htmlFor="custom-idea-blueprint-textarea"
              style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 6 }}
            >
              Step-by-Step Execution Blueprint
            </label>
            <textarea
              id="custom-idea-blueprint-textarea"
              value={newIdea.executionBlueprint}
              onChange={(e) => setNewIdea((i) => ({ ...i, executionBlueprint: e.target.value }))}
              rows={4}
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
                lineHeight: 1.5,
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
              Save Activation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
