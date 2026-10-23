'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  Bookmark,
  BookmarkCheck,
  TrendingUp,
  Tag,
  Plus,
  Filter,
  ListOrdered,
  X,
} from 'lucide-react';
import { PersonalizedIdea } from '@/lib/types';
import { formatNumber } from '@/lib/format';

interface VibeLabProps {
  ideas: PersonalizedIdea[];
  currency: string;
  onUpdateIdeas: (updated: PersonalizedIdea[]) => void;
  onShortlistToBudget?: (idea: PersonalizedIdea) => void;
}

export default function VibeLab({ ideas, currency, onUpdateIdeas, onShortlistToBudget }: VibeLabProps) {
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [expandedBlueprintId, setExpandedBlueprintId] = useState<string | null>(null);
  const [newIdea, setNewIdea] = useState({
    title: '',
    category: 'Guest Engagement',
    estimatedCost: 10000,
    impactScore: '9.2/10',
    executionBlueprint: 'Step 1: Procure required materials 48h prior. Step 2: Brief the emcee and event coordinators. Step 3: Run live activation during peak guest energy window. Step 4: Capture high-res photography and video for instant social media reels.',
  });

  const sym = currency === 'INR' ? '₹' : '$';

  // Derived categories
  const categories = Array.from(new Set(ideas.map(i => i.category)));
  const shortlistedIdeas = ideas.filter(i => i.shortlisted);
  const shortlistedTotalCost = shortlistedIdeas.reduce((sum, i) => sum + i.estimatedCost, 0);

  const filteredIdeas = ideas.filter(i => {
    if (categoryFilter === 'all') return true;
    return i.category === categoryFilter;
  });

  const toggleShortlist = (id: string) => {
    const updated = ideas.map(i => {
      if (i.id !== id) return i;
      const nextShortlisted = !i.shortlisted;
      if (nextShortlisted && onShortlistToBudget) {
        onShortlistToBudget(i);
      }
      return { ...i, shortlisted: nextShortlisted };
    });
    onUpdateIdeas(updated);
  };

  const handleAddIdea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIdea.title.trim()) return;

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
    setNewIdea({
      title: '',
      category: 'Guest Engagement',
      estimatedCost: 10000,
      impactScore: '9.2/10',
      executionBlueprint: 'Step 1: Procure required materials 48h prior. Step 2: Brief the emcee and event coordinators. Step 3: Run live activation during peak guest energy window. Step 4: Capture high-res photography and video for instant social media reels.',
    });
    setShowAddModal(false);
  };

  const parseBlueprintSteps = (text: string) => {
    if (!text) return [];
    const steps = text.split(/(?=Step\s*\d+:)/gi).map(s => s.trim()).filter(Boolean);
    if (steps.length > 1) return steps;
    return text.split(/\.\s+/).filter(Boolean).map(s => s.endsWith('.') ? s : s + '.');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }} role="region" aria-label="Personalized Ideas & Vibe Lab">
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
            Zero-slop, hyper-personalized activations
          </div>
        </div>

        <div
          tabIndex={0}
          aria-label={`Shortlisted: ${shortlistedIdeas.length} Active in Plan, valued at ${sym}${formatNumber(shortlistedTotalCost)}`}
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
              Shortlisted for Event
            </span>
            <BookmarkCheck size={16} aria-hidden="true" style={{ color: 'var(--emerald)' }} />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, fontFamily: 'var(--mono-font)', color: 'var(--emerald)' }}>
            {shortlistedIdeas.length} Active in Plan
          </div>
          <div suppressHydrationWarning style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 4 }}>
            {sym}{formatNumber(shortlistedTotalCost)} allocated to experimental vibe
          </div>
        </div>

        <div
          tabIndex={0}
          aria-label="Average Impact Rating: 9.3 out of 10"
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
              Average Impact Rating
            </span>
            <TrendingUp size={16} aria-hidden="true" style={{ color: 'var(--sky)' }} />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, fontFamily: 'var(--mono-font)', color: 'var(--sky)' }}>
            9.3 / 10
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 4 }}>
            High viral & memory index score
          </div>
        </div>

        <div
          tabIndex={0}
          aria-label="Execution Precision: 100% SOPs"
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
              Execution Precision
            </span>
            <ListOrdered size={16} aria-hidden="true" style={{ color: 'var(--violet)' }} />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, fontFamily: 'var(--mono-font)', color: 'var(--text-primary)' }}>
            100% SOPs
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 4 }}>
            Step-by-step blueprints provided
          </div>
        </div>
      </section>

      {/* ─── Category Filter & Custom Creation Bar ──────────────────────── */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }} role="group" aria-label="Creative Categories Filter">
          <span style={{ fontSize: '0.82rem', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Filter size={14} aria-hidden="true" /> Category:
          </span>
          <button
            aria-pressed={categoryFilter === 'all'}
            aria-label={`All categories (${ideas.length} ideas)`}
            onClick={() => setCategoryFilter('all')}
            style={{
              padding: '5px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              border: categoryFilter === 'all' ? '1px solid var(--gold)' : '1px solid var(--hairline)',
              background: categoryFilter === 'all' ? 'var(--gold-dim)' : 'transparent',
              color: categoryFilter === 'all' ? 'var(--gold)' : 'var(--text-secondary)',
            }}
          >
            All Categories ({ideas.length})
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              aria-pressed={categoryFilter === cat}
              aria-label={`Filter by ${cat}`}
              onClick={() => setCategoryFilter(cat)}
              style={{
                padding: '5px 12px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
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
          aria-label="Add custom creative activation"
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
        {filteredIdeas.map(idea => {
          const isShortlisted = !!idea.shortlisted;
          const isBlueprintExpanded = expandedBlueprintId === idea.id;
          const steps = parseBlueprintSteps(idea.executionBlueprint);

          return (
            <article
              key={idea.id}
              role="listitem"
              style={{
                background: 'var(--surface)',
                border: isShortlisted ? '1px solid var(--emerald)' : '1px solid var(--hairline)',
                borderRadius: 'var(--radius-lg)',
                padding: '22px',
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
                position: 'relative',
                boxShadow: isShortlisted ? '0 0 20px rgba(16, 185, 129, 0.15)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              {/* Header Badges */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '4px 10px',
                    borderRadius: 20,
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    background: 'var(--surface-elevated)',
                    border: '1px solid var(--hairline)',
                    color: 'var(--sky)',
                  }}
                >
                  <Tag size={12} aria-hidden="true" /> {idea.category}
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span
                    aria-label={`Impact score ${idea.impactScore}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      padding: '4px 10px',
                      borderRadius: 20,
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      background: 'var(--gold-dim)',
                      color: 'var(--gold)',
                      border: '1px solid rgba(245, 158, 11, 0.3)',
                    }}
                  >
                    <Zap size={13} aria-hidden="true" /> {idea.impactScore}
                  </span>
                </div>
              </div>

              {/* Title & Estimated Cost */}
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8, lineHeight: 1.3 }}>
                  {idea.title}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-tertiary)' }}>Estimated Investment:</span>
                  <span
                    suppressHydrationWarning
                    style={{ color: 'var(--emerald)', fontWeight: 700, fontFamily: 'var(--mono-font)' }}
                  >
                    {idea.estimatedCost === 0 ? 'FREE / Zero-Cost' : `${sym}${formatNumber(idea.estimatedCost)}`}
                  </span>
                </div>
              </div>

              {/* Execution Blueprint (Step-by-Step) */}
              <div
                style={{
                  background: 'var(--surface-elevated)',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px',
                  border: '1px solid var(--hairline)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 10,
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      color: 'var(--text-secondary)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <ListOrdered size={14} aria-hidden="true" style={{ color: 'var(--gold)' }} /> Execution Blueprint
                  </span>
                  <button
                    onClick={() => setExpandedBlueprintId(isBlueprintExpanded ? null : idea.id)}
                    aria-expanded={isBlueprintExpanded}
                    aria-label={`${isBlueprintExpanded ? 'Collapse' : 'Expand'} execution blueprint for ${idea.title}`}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--gold)',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {isBlueprintExpanded ? 'Collapse' : 'Expand All Steps'}
                  </button>
                </div>

                <ol style={{ display: 'flex', flexDirection: 'column', gap: 8, listStyle: 'none', padding: 0, margin: 0 }}>
                  {(isBlueprintExpanded ? steps : steps.slice(0, 2)).map((st, idx) => (
                    <li
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 8,
                        fontSize: '0.8rem',
                        lineHeight: 1.5,
                        color: 'var(--text-secondary)',
                      }}
                    >
                      <span
                        aria-hidden="true"
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: '50%',
                          background: 'var(--carbon)',
                          border: '1px solid var(--hairline-strong)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          color: 'var(--gold)',
                          flexShrink: 0,
                          marginTop: 2,
                        }}
                      >
                        {idx + 1}
                      </span>
                      <span>{st}</span>
                    </li>
                  ))}
                </ol>
                {!isBlueprintExpanded && steps.length > 2 && (
                  <button
                    onClick={() => setExpandedBlueprintId(idea.id)}
                    aria-label={`Expand ${steps.length - 2} more operational steps for ${idea.title}`}
                    style={{
                      fontSize: '0.74rem',
                      color: 'var(--text-tertiary)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      paddingLeft: 26,
                      marginTop: 6,
                      fontStyle: 'italic',
                      textAlign: 'left',
                      display: 'block',
                    }}
                  >
                    + {steps.length - 2} more operational steps...
                  </button>
                )}
              </div>

              {/* Action: Shortlist into Event Plan */}
              <div style={{ marginTop: 'auto', paddingTop: 6 }}>
                <button
                  onClick={() => toggleShortlist(idea.id)}
                  aria-pressed={isShortlisted}
                  aria-label={`${isShortlisted ? 'Remove' : 'Shortlist'} ${idea.title} in event plan`}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    padding: '10px 16px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    border: isShortlisted ? '1px solid var(--emerald)' : '1px solid var(--hairline-strong)',
                    background: isShortlisted ? 'var(--emerald-dim)' : 'var(--surface-elevated)',
                    color: isShortlisted ? 'var(--emerald)' : 'var(--text-primary)',
                  }}
                >
                  {isShortlisted ? (
                    <>
                      <BookmarkCheck size={16} aria-hidden="true" /> Shortlisted in Event Plan
                    </>
                  ) : (
                    <>
                      <Bookmark size={16} aria-hidden="true" /> Shortlist Idea into Event
                    </>
                  )}
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {/* ─── Add Custom Idea Modal ───────────────────────────────────────── */}
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
          role="dialog"
          aria-modal="true"
          aria-labelledby="custom-activation-title"
          onClick={() => setShowAddModal(false)}
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
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <h3 id="custom-activation-title" style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Add Custom Event Activation
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
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

            <form onSubmit={handleAddIdea} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label htmlFor="custom-idea-title-input" style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 6 }}>
                  Activation Concept Title *
                </label>
                <input
                  id="custom-idea-title-input"
                  type="text"
                  placeholder="e.g., Drone Light QR Code, Midnight Chai Bar"
                  value={newIdea.title}
                  onChange={e => setNewIdea(i => ({ ...i, title: e.target.value }))}
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
                  <label htmlFor="custom-idea-category-select" style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 6 }}>
                    Category
                  </label>
                  <select
                    id="custom-idea-category-select"
                    value={newIdea.category}
                    onChange={e => setNewIdea(i => ({ ...i, category: e.target.value }))}
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
                  <label htmlFor="custom-idea-cost-input" style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 6 }}>
                    Est. Cost ({currency})
                  </label>
                  <input
                    id="custom-idea-cost-input"
                    type="number"
                    value={newIdea.estimatedCost}
                    onChange={e => setNewIdea(i => ({ ...i, estimatedCost: Number(e.target.value) }))}
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
                <label htmlFor="custom-idea-blueprint-textarea" style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 6 }}>
                  Step-by-Step Execution Blueprint
                </label>
                <textarea
                  id="custom-idea-blueprint-textarea"
                  value={newIdea.executionBlueprint}
                  onChange={e => setNewIdea(i => ({ ...i, executionBlueprint: e.target.value }))}
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
                  Save Activation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
