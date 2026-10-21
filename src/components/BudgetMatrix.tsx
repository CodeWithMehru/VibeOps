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
    const updated = budgetBreakdown.map(c =>
      c.id === id ? { ...c, locked: !c.locked } : c
    );
    onUpdateBudget(updated);
  };

  return (
    <div className="animate-fade-in">
      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 24 }}>
        <div className="kpi-card">
          <span className="kpi-label"><DollarSign size={10} style={{ display: 'inline' }} /> Total Budget</span>
          <span className="kpi-value text-gold" suppressHydrationWarning>{sym}{formatNumber(eventSummary.totalBudget)}</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-label"><Users size={10} style={{ display: 'inline' }} /> Per-Guest Cost</span>
          <span className="kpi-value" suppressHydrationWarning>{sym}{formatNumber(perGuestCost)}</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-label"><PieChart size={10} style={{ display: 'inline' }} /> Allocated / Reserve</span>
          <span className="kpi-value" suppressHydrationWarning style={{ color: unallocated >= 0 ? 'var(--emerald)' : 'var(--crisis-coral)' }}>
            {sym}{formatNumber(totalAllocated)}
            <span style={{ fontSize: 14, color: 'var(--text-tertiary)', fontWeight: 500 }}> / {sym}{formatNumber(Math.abs(unallocated))} {unallocated >= 0 ? 'reserve' : 'over'}</span>
          </span>
        </div>
        <div className="kpi-card">
          <span className="kpi-label"><UtensilsCrossed size={10} style={{ display: 'inline' }} /> Catering Plates</span>
          <span className="kpi-value">{cm.recommendedPlates}
            <span style={{ fontSize: 13, color: 'var(--text-tertiary)', fontWeight: 500 }}> ({cm.bufferPercentage}% buffer)</span>
          </span>
          <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }} suppressHydrationWarning>{sym}{formatNumber(cm.perPlateCostEstimate)}/plate est.</span>
        </div>
      </div>

      {/* Catering Waste Tip */}
      <div className="saving-hack-banner" style={{ marginBottom: 20, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
        <Lightbulb size={16} style={{ flexShrink: 0, marginTop: 1 }} />
        <div>
          <span style={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Catering Waste Prevention</span>
          <p style={{ marginTop: 4, color: 'var(--text-secondary)', fontSize: 13 }}>{cm.wastePreventionTip}</p>
        </div>
      </div>

      {/* Budget Allocation Bar */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Budget Allocation
          </span>
          <span className="font-mono" style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
            {budgetBreakdown.length} categories
          </span>
        </div>
        <div className="budget-bar">
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
              <div style={{ width: 8, height: 8, borderRadius: 2, background: BUDGET_COLORS[i % BUDGET_COLORS.length] }} />
              {cat.category} ({cat.percentage}%)
            </div>
          ))}
        </div>
      </div>

      {/* AI Action Buttons */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }} className="no-print">
        <button
          className="btn-primary"
          onClick={() => onAIRebalance('rebalance')}
          disabled={isRebalancing}
          style={{ fontSize: 13, padding: '8px 16px' }}
        >
          {isRebalancing ? <div className="spinner" style={{ width: 14, height: 14 }} /> : <RefreshCw size={14} />}
          AI Rebalance Unlocked
        </button>
        <button
          className="btn-crisis"
          onClick={() => onAIRebalance('slash15')}
          disabled={isRebalancing}
          style={{ fontSize: 13, padding: '8px 16px' }}
        >
          <TrendingDown size={14} />
          AI Slash 15% Without Losing Vibe
        </button>
      </div>

      {/* Category Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {budgetBreakdown.map((cat, i) => {
          const expanded = expandedId === cat.id;
          return (
            <div key={cat.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
              {/* Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '14px 18px',
                  cursor: 'pointer',
                }}
                onClick={() => setExpandedId(expanded ? null : cat.id)}
              >
                <div style={{
                  width: 10,
                  height: 10,
                  borderRadius: 3,
                  background: BUDGET_COLORS[i % BUDGET_COLORS.length],
                  flexShrink: 0,
                }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 700, fontSize: 14 }}>{cat.category}</span>
                    <span className={cat.priority === 'High' ? 'crisis-badge' : cat.priority === 'Medium' ? 'gold-badge' : 'sky-badge'}
                      style={{ fontSize: 10 }}>
                      {cat.priority}
                    </span>
                    {cat.locked && (
                      <span className="violet-badge" style={{ fontSize: 10, display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Lock size={9} /> Locked
                      </span>
                    )}
                  </div>
                </div>
                <span className="font-mono" style={{ fontSize: 16, fontWeight: 700, color: BUDGET_COLORS[i % BUDGET_COLORS.length] }}>
                  {sym}{formatNumber(cat.allocatedAmount)}
                </span>
                <span className="font-mono" style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
                  {cat.percentage}%
                </span>
                {expanded ? <ChevronUp size={16} color="var(--text-tertiary)" /> : <ChevronDown size={16} color="var(--text-tertiary)" />}
              </div>

              {/* Expanded Content */}
              {expanded && (
                <div style={{ padding: '0 18px 18px', borderTop: '1px solid var(--hairline)', paddingTop: 16 }} className="animate-fade-in">
                  {/* Slider */}
                  <div style={{ marginBottom: 14 }} className="no-print">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Adjust Allocation</span>
                      <button
                        className="btn-ghost"
                        onClick={(e) => { e.stopPropagation(); toggleLock(cat.id); }}
                        style={{ padding: '4px 8px', fontSize: 11, gap: 4 }}
                      >
                        {cat.locked ? <Lock size={12} /> : <Unlock size={12} />}
                        {cat.locked ? 'Unlock' : 'Lock'}
                      </button>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={eventSummary.totalBudget * 0.5}
                      step={1000}
                      value={cat.allocatedAmount}
                      disabled={cat.locked}
                      onChange={(e) => handleSliderChange(cat.id, parseInt(e.target.value))}
                      style={{ opacity: cat.locked ? 0.4 : 1 }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 11, color: 'var(--text-tertiary)' }}>
                      <span>{sym}0</span>
                      <span>{sym}{formatNumber(Math.round(eventSummary.totalBudget * 0.5))}</span>
                    </div>
                  </div>

                  {/* Line Items */}
                  <div style={{ marginBottom: 14 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      Line Items
                    </span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
                      {cat.lineItems.map((item, j) => (
                        <span key={j} style={{
                          padding: '4px 10px',
                          background: 'var(--surface-elevated)',
                          border: '1px solid var(--hairline)',
                          borderRadius: 999,
                          fontSize: 12,
                          color: 'var(--text-secondary)',
                        }}>
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* AI Saving Hack */}
                  <div className="saving-hack-banner">
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                      <Lightbulb size={14} style={{ flexShrink: 0, marginTop: 1 }} />
                      <div>
                        <span style={{ fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.04em' }}>AI Insider Saving Hack</span>
                        <p style={{ marginTop: 3, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{cat.aiSavingHack}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
