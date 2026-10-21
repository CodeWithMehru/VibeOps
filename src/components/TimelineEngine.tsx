'use client';

import React, { useState } from 'react';
import {
  Clock,
  AlertTriangle,
  CheckCircle2,
  Circle,
  PlayCircle,
  Filter,
  Plus,
  Zap,
} from 'lucide-react';
import { TimelineItem, TimelineStatus, TimelineCriticality } from '@/lib/types';

interface TimelineEngineProps {
  timeline: TimelineItem[];
  onUpdateTimeline: (updated: TimelineItem[]) => void;
  onTriggerCrisis: () => void;
}

const STATUS_CONFIG: Record<TimelineStatus, { icon: React.ReactNode; label: string; color: string }> = {
  pending: { icon: <Circle size={16} />, label: 'Pending', color: 'var(--text-tertiary)' },
  'in-progress': { icon: <PlayCircle size={16} />, label: 'In Progress', color: 'var(--gold)' },
  completed: { icon: <CheckCircle2 size={16} />, label: 'Completed', color: 'var(--emerald)' },
};

const CRITICALITY_MAP: Record<TimelineCriticality, string> = {
  Critical: 'crisis-badge',
  High: 'gold-badge',
  Normal: 'sky-badge',
};

const NEXT_STATUS: Record<TimelineStatus, TimelineStatus> = {
  pending: 'in-progress',
  'in-progress': 'completed',
  completed: 'pending',
};

export default function TimelineEngine({ timeline, onUpdateTimeline, onTriggerCrisis }: TimelineEngineProps) {
  const [phaseFilter, setPhaseFilter] = useState<string>('all');
  const [critFilter, setCritFilter] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({ title: '', phase: 'Event Day - Morning', owner: '', timeSlot: '' });

  const phases = Array.from(new Set(timeline.map(t => t.phase)));
  const completed = timeline.filter(t => t.status === 'completed').length;
  const progress = timeline.length > 0 ? Math.round((completed / timeline.length) * 100) : 0;

  const filtered = timeline.filter(t => {
    if (phaseFilter !== 'all' && t.phase !== phaseFilter) return false;
    if (critFilter !== 'all' && t.criticality !== critFilter) return false;
    return true;
  });

  const toggleStatus = (id: string) => {
    const updated = timeline.map(t =>
      t.id === id ? { ...t, status: NEXT_STATUS[t.status] } : t
    );
    onUpdateTimeline(updated);
  };

  const addMilestone = () => {
    if (!newItem.title) return;
    const item: TimelineItem = {
      id: `t-custom-${Date.now()}`,
      phase: newItem.phase,
      timeSlot: newItem.timeSlot || 'TBD',
      title: newItem.title,
      owner: newItem.owner || 'Unassigned',
      criticality: 'Normal',
      status: 'pending',
      dependencyNote: 'Custom milestone added by user',
    };
    onUpdateTimeline([...timeline, item]);
    setNewItem({ title: '', phase: 'Event Day - Morning', owner: '', timeSlot: '' });
    setShowAddForm(false);
  };

  return (
    <div className="animate-fade-in">
      {/* Readiness Bar */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Clock size={18} color="var(--gold)" />
              Event Readiness
            </h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span className="font-mono" style={{ fontSize: 24, fontWeight: 800, color: progress === 100 ? 'var(--emerald)' : 'var(--gold)' }}>
              {progress}%
            </span>
            <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
              {completed}/{timeline.length} tasks
            </span>
          </div>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Filters + Actions */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }} className="no-print">
        <Filter size={14} color="var(--text-tertiary)" />

        <select
          className="input-field"
          value={phaseFilter}
          onChange={(e) => setPhaseFilter(e.target.value)}
          style={{ width: 'auto', fontSize: 12, padding: '6px 30px 6px 10px' }}
        >
          <option value="all">All Phases</option>
          {phases.map(p => <option key={p} value={p}>{p}</option>)}
        </select>

        <select
          className="input-field"
          value={critFilter}
          onChange={(e) => setCritFilter(e.target.value)}
          style={{ width: 'auto', fontSize: 12, padding: '6px 30px 6px 10px' }}
        >
          <option value="all">All Criticality</option>
          <option value="Critical">🔴 Critical</option>
          <option value="High">🟡 High</option>
          <option value="Normal">🔵 Normal</option>
        </select>

        <div style={{ flex: 1 }} />

        <button className="btn-ghost" onClick={() => setShowAddForm(!showAddForm)} style={{ fontSize: 12 }}>
          <Plus size={14} /> Add Milestone
        </button>
        <button className="btn-crisis" onClick={onTriggerCrisis} style={{ fontSize: 12, padding: '6px 12px' }}>
          <Zap size={13} /> Trigger Crisis
        </button>
      </div>

      {/* Add Milestone Form */}
      {showAddForm && (
        <div className="card" style={{ padding: 16, marginBottom: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
            <input
              className="input-field"
              placeholder="Milestone title"
              value={newItem.title}
              onChange={(e) => setNewItem(n => ({ ...n, title: e.target.value }))}
            />
            <input
              className="input-field"
              placeholder="Owner"
              value={newItem.owner}
              onChange={(e) => setNewItem(n => ({ ...n, owner: e.target.value }))}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 10 }}>
            <select
              className="input-field"
              value={newItem.phase}
              onChange={(e) => setNewItem(n => ({ ...n, phase: e.target.value }))}
            >
              {phases.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <input
              className="input-field"
              placeholder="Time slot (e.g. 06:00 AM)"
              value={newItem.timeSlot}
              onChange={(e) => setNewItem(n => ({ ...n, timeSlot: e.target.value }))}
            />
            <button className="btn-primary" onClick={addMilestone} style={{ fontSize: 13, padding: '8px 16px' }}>
              Add
            </button>
          </div>
        </div>
      )}

      {/* Timeline Items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {filtered.map((item, idx) => {
          const showPhaseHeader = idx === 0 || filtered[idx - 1].phase !== item.phase;
          const statusCfg = STATUS_CONFIG[item.status];

          return (
            <React.Fragment key={item.id}>
              {showPhaseHeader && (
                <div style={{
                  padding: '12px 0 6px',
                  fontSize: 11,
                  fontWeight: 700,
                  color: 'var(--gold)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  borderBottom: '1px solid var(--hairline)',
                  marginTop: idx > 0 ? 12 : 0,
                }}>
                  {item.phase}
                </div>
              )}
              <div
                className="card"
                style={{
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                  borderRadius: 'var(--radius-md)',
                  opacity: item.status === 'completed' ? 0.65 : 1,
                }}
              >
                {/* Status Toggle */}
                <button
                  className="no-print"
                  onClick={() => toggleStatus(item.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: statusCfg.color,
                    padding: 2,
                    marginTop: 1,
                    flexShrink: 0,
                    transition: 'transform 0.15s',
                  }}
                  title={`Click to change: ${statusCfg.label} → ${STATUS_CONFIG[NEXT_STATUS[item.status]].label}`}
                >
                  {statusCfg.icon}
                </button>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                    <span style={{
                      fontWeight: 600,
                      fontSize: 14,
                      textDecoration: item.status === 'completed' ? 'line-through' : 'none',
                    }}>
                      {item.title}
                    </span>
                    <span className={CRITICALITY_MAP[item.criticality]} style={{ fontSize: 10 }}>
                      {item.criticality}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 12, color: 'var(--text-tertiary)' }}>
                    <span className="font-mono">{item.timeSlot}</span>
                    <span>👤 {item.owner}</span>
                  </div>
                  {item.dependencyNote && (
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 4, marginTop: 6, fontSize: 12, color: 'var(--text-tertiary)', lineHeight: 1.4 }}>
                      <AlertTriangle size={12} style={{ flexShrink: 0, marginTop: 1 }} />
                      {item.dependencyNote}
                    </div>
                  )}
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
