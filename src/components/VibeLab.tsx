'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  TrendingUp,
  Plus,
  Filter,
} from 'lucide-react';
import { PersonalizedIdea, EventSummary } from '@/lib/types';
import { formatNumber } from '@/lib/format';
import GuestCohortStudio from './GuestCohortStudio';
import VibeIdeaCard from './VibeIdeaCard';
import VibeAddIdeaModal from './VibeAddIdeaModal';

interface VibeLabProps {
  ideas: PersonalizedIdea[];
  currency: string;
  onUpdateIdeas: (updated: PersonalizedIdea[]) => void;
  onShortlistToBudget?: (idea: PersonalizedIdea) => void;
  eventSummary?: EventSummary;
}

/**
 * VibeLab Component
 *
 * Creative ideation laboratory and cohort planning cockpit.
 * Showcases high-impact experiential activations with step-by-step SOP blueprints.
 */
export default function VibeLab({ ideas, currency, onUpdateIdeas, onShortlistToBudget, eventSummary }: VibeLabProps) {
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [expandedBlueprintId, setExpandedBlueprintId] = useState<string | null>(null);

  // Keyboard accessibility: Escape key listener for custom idea modal
  useEffect(() => {
    if (!showAddModal) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowAddModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showAddModal]);

  const sym = currency === 'INR' ? '₹' : '$';

  // Derived categories
  const categories = Array.from(new Set(ideas.map((i) => i.category)));
  const shortlistedIdeas = ideas.filter((i) => i.shortlisted);
  const shortlistedTotalCost = shortlistedIdeas.reduce((sum, i) => sum + i.estimatedCost, 0);

  const filteredIdeas = ideas.filter((i) => {
    if (categoryFilter === 'all') return true;
    return i.category === categoryFilter;
  });

  const toggleShortlist = (id: string) => {
    const updated = ideas.map((i) => {
      if (i.id !== id) return i;
      const nextShortlisted = !i.shortlisted;
      if (nextShortlisted && onShortlistToBudget) {
        onShortlistToBudget(i);
      }
      return { ...i, shortlisted: nextShortlisted };
    });
    onUpdateIdeas(updated);
  };

  const handleAddIdea = (newIdea: {
    title: string;
    category: string;
    estimatedCost: number;
    impactScore: string;
    executionBlueprint: string;
  }) => {
    const added: PersonalizedIdea = {
      id: `custom-idea-${Date.now()}`,
      title: newIdea.title.trim(),
      category: newIdea.category,
      estimatedCost: Number(newIdea.estimatedCost) || 0,
      impactScore: newIdea.impactScore || '9.0/10',
      executionBlueprint: newIdea.executionBlueprint,
      shortlisted: false,
    };

    onUpdateIdeas([...ideas, added]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }} role="region" aria-label="Personalized Ideas & Vibe Lab">
      {/* ─── Guest Cohort & Dietary Matrix Studio ───────────────────────── */}
      {eventSummary && <GuestCohortStudio eventSummary={eventSummary} />}

      {/* ─── Top Metrics Bar ────────────────────────────────────────────── */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 16,
        }}
        aria-label="Creative Concepts Overview"
      >
        <div
          tabIndex={0}
          aria-label={`Creative Concepts: ${ideas.length} Custom Ideas`}
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--hairline)',
            borderRadius: 'var(--radius-lg)',
            padding: '18px 20px',
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Creative Concepts
            </span>
            <Sparkles size={16} aria-hidden="true" style={{ color: 'var(--gold)' }} />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, fontFamily: 'var(--mono-font)', color: 'var(--text-primary)' }}>
            {ideas.length} Custom Ideas
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 4 }}>
            Tailored to event profile & regional culture
          </div>
        </div>

        <div
          tabIndex={0}
          aria-label={`Shortlisted Activations: ${shortlistedIdeas.length} Active`}
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--hairline)',
            borderRadius: 'var(--radius-lg)',
            padding: '18px 20px',
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Shortlisted Activations
            </span>
            <TrendingUp size={16} aria-hidden="true" style={{ color: 'var(--emerald)' }} />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, fontFamily: 'var(--mono-font)', color: 'var(--emerald)' }}>
            {shortlistedIdeas.length} Active
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 4 }}>
            Synced with budget & production plan
          </div>
        </div>

        <div
          tabIndex={0}
          aria-label={`Shortlisted Concept Spend: ${sym}${formatNumber(shortlistedTotalCost)}`}
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--hairline)',
            borderRadius: 'var(--radius-lg)',
            padding: '18px 20px',
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Concept Spend
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--gold)', fontWeight: 700 }}>Est.</span>
          </div>
          <div
            suppressHydrationWarning
            style={{ fontSize: '1.6rem', fontWeight: 700, fontFamily: 'var(--mono-font)', color: 'var(--gold)' }}
          >
            {sym}{formatNumber(shortlistedTotalCost)}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 4 }}>
            Committed to shortlisted viral elements
          </div>
        </div>
      </section>

      {/* ─── Category Filter & Action Bar ───────────────────────────────── */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }} role="group" aria-label="Concept Category Filters">
          <span style={{ fontSize: '0.82rem', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Filter size={14} aria-hidden="true" /> Filter Vibe:
          </span>
          <button
            aria-pressed={categoryFilter === 'all'}
            aria-label="Filter concepts: All Categories"
            onClick={() => setCategoryFilter('all')}
            style={{
              padding: '5px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              border: categoryFilter === 'all' ? '1px solid var(--gold)' : '1px solid var(--hairline)',
              background: categoryFilter === 'all' ? 'var(--gold-dim)' : 'transparent',
              color: categoryFilter === 'all' ? 'var(--gold)' : 'var(--text-secondary)',
            }}
          >
            All Categories ({ideas.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              aria-pressed={categoryFilter === cat}
              aria-label={`Filter concepts: ${cat}`}
              onClick={() => setCategoryFilter(cat)}
              style={{
                padding: '5px 12px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                border: categoryFilter === cat ? '1px solid var(--gold)' : '1px solid var(--hairline)',
                background: categoryFilter === cat ? 'var(--gold-dim)' : 'transparent',
                color: categoryFilter === cat ? 'var(--gold)' : 'var(--text-secondary)',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          aria-label="Add custom creative activation concept"
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
          }}
        >
          <Plus size={14} aria-hidden="true" /> Add Custom Idea
        </button>
      </div>

      {/* ─── Ideas Cards Grid ───────────────────────────────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: 20,
        }}
        role="list"
        aria-label="Personalized Creative Ideas"
      >
        {filteredIdeas.map((idea) => (
          <VibeIdeaCard
            key={idea.id}
            idea={idea}
            sym={sym}
            isBlueprintExpanded={expandedBlueprintId === idea.id}
            onToggleExpandBlueprint={(id) => setExpandedBlueprintId(id)}
            onToggleShortlist={toggleShortlist}
          />
        ))}
      </div>

      {/* ─── Add Custom Idea Modal ───────────────────────────────────────── */}
      <VibeAddIdeaModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddIdea={handleAddIdea}
        currency={currency}
      />
    </div>
  );
}
