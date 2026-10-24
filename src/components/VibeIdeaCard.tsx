'use client';

import React from 'react';
import {
  Tag,
  Zap,
  ListOrdered,
  Bookmark,
  BookmarkCheck,
} from 'lucide-react';
import { PersonalizedIdea } from '@/lib/types';
import { formatNumber } from '@/lib/format';

export interface VibeIdeaCardProps {
  idea: PersonalizedIdea;
  sym: string;
  isBlueprintExpanded: boolean;
  onToggleExpandBlueprint: (id: string | null) => void;
  onToggleShortlist: (id: string) => void;
}

/**
 * Parses freeform SOP text into individual numbered steps.
 */
function parseBlueprintSteps(text: string): string[] {
  if (!text) return [];
  const steps = text.split(/(?=Step\s*\d+:)/gi).map((s) => s.trim()).filter(Boolean);
  if (steps.length > 1) return steps;
  return text.split(/\.\s+/).filter(Boolean).map((s) => (s.endsWith('.') ? s : s + '.'));
}

/**
 * VibeIdeaCard Component
 *
 * Renders an individual bespoke concept with impact rating, cost calculation,
 * expandable step-by-step SOP execution drawer, and shortlist commitment action.
 */
export default function VibeIdeaCard({
  idea,
  sym,
  isBlueprintExpanded,
  onToggleExpandBlueprint,
  onToggleShortlist,
}: VibeIdeaCardProps) {
  const isShortlisted = !!idea.shortlisted;
  const steps = parseBlueprintSteps(idea.executionBlueprint);

  return (
    <article
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
            onClick={() => onToggleExpandBlueprint(isBlueprintExpanded ? null : idea.id)}
            aria-expanded={isBlueprintExpanded}
            aria-controls={`sop-panel-${idea.id}`}
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

        <ol
          id={`sop-panel-${idea.id}`}
          style={{ display: 'flex', flexDirection: 'column', gap: 8, listStyle: 'none', padding: 0, margin: 0 }}
        >
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
            onClick={() => onToggleExpandBlueprint(idea.id)}
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
          onClick={() => onToggleShortlist(idea.id)}
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
}
