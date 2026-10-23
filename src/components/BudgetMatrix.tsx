'use client';

import React, { useState } from 'react';
import {
  Lock,
  Unlock,
  TrendingDown,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  DollarSign,
  Users,
  UtensilsCrossed,
  PieChart,
} from 'lucide-react';
import { EventBlueprint, BudgetCategory } from '@/lib/types';
import { formatNumber } from '@/lib/format';

const BUDGET_COLORS = [
  '#F59E0B', '#10B981', '#38BDF8', '#8B5CF6', '#F43F5E', '#EC4899', '#14B8A6', '#F97316',
];

interface BudgetMatrixProps {
  blueprint: EventBlueprint;
  onUpdateBudget: (updated: BudgetCategory[]) => void;
  onAIRebalance: (mode: 'rebalance' | 'slash15') => void;
  isRebalancing: boolean;
}

export default function BudgetMatrix({ blueprint, onUpdateBudget, onAIRebalance, isRebalancing }: BudgetMatrixProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { eventSummary, budgetBreakdown } = blueprint;

  const totalAllocated = budgetBreakdown.reduce((sum, c) => sum + c.allocatedAmount, 0);
  const unallocated = eventSummary.totalBudget - totalAllocated;
  const perGuestCost = Math.round(eventSummary.totalBudget / eventSummary.guestCount);
  const cm = eventSummary.cateringMatrix;
  const sym = eventSummary.currency === 'INR' ? '₹' : '$';

  const handleSliderChange = (id: string, newAmount: number) => {
    const updated = budgetBreakdown.map(c => {
      if (c.id !== id) return c;
      const pct = Math.round((newAmount / eventSummary.totalBudget) * 100);
      return { ...c, allocatedAmount: newAmount, percentage: pct };
    });
    onUpdateBudget(updated);
  };

  const toggleLock = (id: string) => {
    const updated = budgetBreakdown.map(c => {
      if (c.id !== id) return c;
      return { ...c, locked: !c.locked };
    });
    onUpdateBudget(updated);
  };

  return (
    <div className="animate-fade-in" role="region" aria-label="Interactive Budget Matrix & Catering Calculator">
      {/* KPI Cards */}
      <div
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 24 }}
        role="region"
        aria-label="Budget Key Performance Indicators"
      >
        <div className="kpi-card" tabIndex={0} aria-label={`Total Budget: ${sym}${formatNumber(eventSummary.totalBudget)}`}>
          <span className="kpi-label"><DollarSign size={10} aria-hidden="true" style={{ display: 'inline' }} /> Total Budget</span>
          <span className="kpi-value text-gold" suppressHydrationWarning>{sym}{formatNumber(eventSummary.totalBudget)}</span>
        </div>
        <div className="kpi-card" tabIndex={0} aria-label={`Per-Guest Cost: ${sym}${formatNumber(perGuestCost)}`}>
          <span className="kpi-label"><Users size={10} aria-hidden="true" style={{ display: 'inline' }} /> Per-Guest Cost</span>
          <span className="kpi-value" suppressHydrationWarning>{sym}{formatNumber(perGuestCost)}</span>
        </div>
        <div className="kpi-card" tabIndex={0} aria-label={`Allocated: ${sym}${formatNumber(totalAllocated)}, Reserve: ${sym}${formatNumber(Math.abs(unallocated))}`}>
          <span className="kpi-label"><PieChart size={10} aria-hidden="true" style={{ display: 'inline' }} /> Allocated / Reserve</span>
          <span className="kpi-value" suppressHydrationWarning style={{ color: unallocated >= 0 ? 'var(--emerald)' : 'var(--crisis-coral)' }}>
            {sym}{formatNumber(totalAllocated)}
            <span style={{ fontSize: 14, color: 'var(--text-tertiary)', fontWeight: 500 }}> / {sym}{formatNumber(Math.abs(unallocated))} {unallocated >= 0 ? 'reserve' : 'over'}</span>
          </span>
        </div>
        <div className="kpi-card" tabIndex={0} aria-label={`Catering: ${cm.recommendedPlates} plates recommended with ${cm.bufferPercentage}% buffer`}>
          <span className="kpi-label"><UtensilsCrossed size={10} aria-hidden="true" style={{ display: 'inline' }} /> Catering Plates</span>
          <span className="kpi-value">{cm.recommendedPlates}
            <span style={{ fontSize: 13, color: 'var(--text-tertiary)', fontWeight: 500 }}> ({cm.bufferPercentage}% buffer)</span>
          </span>
          <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }} suppressHydrationWarning>{sym}{formatNumber(cm.perPlateCostEstimate)}/plate est.</span>
        </div>
      </div>

      {/* Catering Waste Tip */}
      <aside
        className="saving-hack-banner"
        aria-label="Catering Waste Prevention Tip"
        style={{ marginBottom: 20, display: 'flex', alignItems: 'flex-start', gap: 8 }}
      >
        <Lightbulb size={16} aria-hidden="true" style={{ flexShrink: 0, marginTop: 1 }} />
        <div>
          <span style={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Catering Waste Prevention</span>
          <p style={{ marginTop: 4, color: 'var(--text-secondary)', fontSize: 13 }}>{cm.wastePreventionTip}</p>
        </div>
      </aside>

      {/* Budget Allocation Bar */}
      <section style={{ marginBottom: 24 }} aria-label="Visual Budget Proportional Breakdown">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <h3 style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Budget Allocation
          </h3>
          <span className="font-mono" style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
            {budgetBreakdown.length} categories
          </span>
        </div>
        <div
          className="budget-bar"
          role="img"
          aria-label={`Visual breakdown of budget across ${budgetBreakdown.length} categories summing to 100%`}
        >
          {budgetBreakdown.map((cat, i) => (
            <div
              key={cat.id}
              className="budget-segment"
              title={`${cat.category}: ${sym}${formatNumber(cat.allocatedAmount)} (${cat.percentage}%)`}
              style={{
                width: `${cat.percentage}%`,
                background: BUDGET_COLORS[i % BUDGET_COLORS.length],
                opacity: cat.locked ? 0.6 : 1,
              }}
            />
          ))}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 10 }}>
          {budgetBreakdown.map((cat, i) => (
            <div key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--text-tertiary)' }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: BUDGET_COLORS[i % BUDGET_COLORS.length] }} aria-hidden="true" />
              <span>{cat.category}</span>
              <span className="font-mono text-secondary">{cat.percentage}%</span>
              {cat.locked && <Lock size={10} color="var(--violet)" aria-label="Locked" />}
            </div>
          ))}
        </div>
      </section>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }} className="no-print">
        <button
          className="btn-secondary"
          aria-label="AI Rebalance Unlocked Categories"
          onClick={() => onAIRebalance('rebalance')}
          disabled={isRebalancing}
          style={{ fontSize: 13 }}
        >
          <RefreshCw size={14} aria-hidden="true" className={isRebalancing ? 'spinner' : ''} />
          {isRebalancing ? 'Rebalancing...' : 'AI Rebalance Unlocked'}
        </button>
        <button
          className="btn-secondary"
          aria-label="AI Slash 15% Without Losing Vibe"
          onClick={() => onAIRebalance('slash15')}
          disabled={isRebalancing}
          style={{ fontSize: 13 }}
        >
          <TrendingDown size={14} aria-hidden="true" />
          AI Slash 15% Without Losing Vibe
        </button>
      </div>

      {/* Live Region for Rebalancing Telemetry */}
      <div role="status" aria-live="polite" className="sr-only">
        {isRebalancing ? 'AI is rebalancing unlocked budget categories...' : `Current allocated budget is ${sym}${formatNumber(totalAllocated)}`}
      </div>

      {/* Category Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }} role="list" aria-label="Budget Categories List">
        {budgetBreakdown.map((cat, i) => {
          const expanded = expandedId === cat.id;
          const sliderMax = Math.round(eventSummary.totalBudget * 0.5);

          return (
            <article
              key={cat.id}
              className="card"
              role="listitem"
              style={{ overflow: 'hidden', borderLeft: `3px solid ${BUDGET_COLORS[i % BUDGET_COLORS.length]}` }}
            >
              {/* Category Header */}
              <div
                role="button"
                tabIndex={0}
                aria-expanded={expanded}
                aria-label={`${expanded ? 'Collapse' : 'Expand'} ${cat.category} details. Allocated: ${sym}${formatNumber(cat.allocatedAmount)} (${cat.percentage}%)`}
                onClick={() => setExpandedId(expanded ? null : cat.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setExpandedId(expanded ? null : cat.id);
                  }
                }}
                style={{
                  padding: '14px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  userSelect: 'none',
                  gap: 12,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: BUDGET_COLORS[i % BUDGET_COLORS.length] }} aria-hidden="true" />
                  <span style={{ fontWeight: 700, fontSize: 14 }}>{cat.category}</span>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <span className={cat.priority === 'High' ? 'gold-badge' : 'sky-badge'} style={{ fontSize: 10 }}>
                      {cat.priority}
                    </span>
                    {cat.locked && (
                      <span className="violet-badge" style={{ fontSize: 10, display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Lock size={9} aria-hidden="true" /> Locked
                      </span>
                    )}
                  </div>
                </div>
                <span className="font-mono" suppressHydrationWarning style={{ fontSize: 16, fontWeight: 700, color: BUDGET_COLORS[i % BUDGET_COLORS.length] }}>
                  {sym}{formatNumber(cat.allocatedAmount)}
                </span>
                <span className="font-mono" style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
                  {cat.percentage}%
                </span>
                {expanded ? (
                  <ChevronUp size={16} aria-hidden="true" color="var(--text-tertiary)" />
                ) : (
                  <ChevronDown size={16} aria-hidden="true" color="var(--text-tertiary)" />
                )}
              </div>

              {/* Expanded Content */}
              {expanded && (
                <div style={{ padding: '0 18px 18px', borderTop: '1px solid var(--hairline)', paddingTop: 16 }} className="animate-fade-in">
                  {/* Slider */}
                  <div style={{ marginBottom: 14 }} className="no-print">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <label htmlFor={`slider-${cat.id}`} style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
                        Adjust Allocation
                      </label>
                      <button
                        className="btn-ghost"
                        aria-label={cat.locked ? `Unlock ${cat.category} budget category` : `Lock ${cat.category} budget category`}
                        onClick={(e) => { e.stopPropagation(); toggleLock(cat.id); }}
                        style={{ padding: '4px 8px', fontSize: 11, gap: 4 }}
                      >
                        {cat.locked ? <Lock size={12} aria-hidden="true" /> : <Unlock size={12} aria-hidden="true" />}
                        {cat.locked ? 'Unlock' : 'Lock'}
                      </button>
                    </div>
                    <input
                      id={`slider-${cat.id}`}
                      type="range"
                      role="slider"
                      min={0}
                      max={sliderMax}
                      step={1000}
                      value={cat.allocatedAmount}
                      disabled={cat.locked}
                      aria-label={`Adjust budget for ${cat.category}`}
                      aria-valuemin={0}
                      aria-valuemax={sliderMax}
                      aria-valuenow={cat.allocatedAmount}
                      aria-valuetext={`${sym}${formatNumber(cat.allocatedAmount)}`}
                      onChange={(e) => handleSliderChange(cat.id, parseInt(e.target.value))}
                      style={{ opacity: cat.locked ? 0.4 : 1, width: '100%' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 11, color: 'var(--text-tertiary)' }}>
                      <span>{sym}0</span>
                      <span suppressHydrationWarning>{sym}{formatNumber(sliderMax)}</span>
                    </div>
                  </div>

                  {/* Line Items */}
                  <div style={{ marginBottom: 14 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      Line Items
                    </span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }} role="list">
                      {cat.lineItems.map((item, j) => (
                        <span
                          key={j}
                          role="listitem"
                          style={{
                            padding: '4px 10px',
                            background: 'var(--surface-elevated)',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: 12,
                            color: 'var(--text-secondary)',
                            border: '1px solid var(--hairline)',
                          }}
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* AI Saving Hack */}
                  {cat.aiSavingHack && (
                    <div className="saving-hack-banner">
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                        <Lightbulb size={14} aria-hidden="true" color="var(--gold)" style={{ flexShrink: 0, marginTop: 2 }} />
                        <div>
                          <span style={{ fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            AI Insider Saving Hack
                          </span>
                          <p style={{ marginTop: 2, color: 'var(--text-secondary)', fontSize: 12, lineHeight: 1.5 }}>
                            {cat.aiSavingHack}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
