'use client';

import React from 'react';
import {
  PieChart,
  Clock,
  Store,
  Sparkles,
  AlertOctagon,
} from 'lucide-react';

interface WorkspaceTabsProps {
  activeTab: number;
  setActiveTab: (id: number) => void;
  hasCrisisAlert: boolean;
}

interface TabDef {
  id: number;
  label: string;
  icon: React.ReactNode;
  hasAlert?: boolean;
}

/**
 * WorkspaceTabs Component
 *
 * Semantic WAI-ARIA tab navigation bar with arrow key navigation,
 * focus retention, and operational status indicators.
 */
export default function WorkspaceTabs({
  activeTab,
  setActiveTab,
  hasCrisisAlert,
}: WorkspaceTabsProps) {
  const tabs: TabDef[] = [
    { id: 0, label: 'Budget Matrix & Catering', icon: <PieChart size={16} aria-hidden="true" /> },
    { id: 1, label: 'Run-of-Show Timeline', icon: <Clock size={16} aria-hidden="true" /> },
    { id: 2, label: 'Vendor War-Room', icon: <Store size={16} aria-hidden="true" /> },
    { id: 3, label: 'Personalized Vibe Lab', icon: <Sparkles size={16} aria-hidden="true" /> },
    {
      id: 4,
      label: 'Crisis War-Room',
      icon: <AlertOctagon size={16} aria-hidden="true" />,
      hasAlert: hasCrisisAlert,
    },
  ];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const nextTab = (activeTab + 1) % tabs.length;
      setActiveTab(nextTab);
      document.getElementById(`tab-${nextTab}`)?.focus();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevTab = (activeTab - 1 + tabs.length) % tabs.length;
      setActiveTab(prevTab);
      document.getElementById(`tab-${prevTab}`)?.focus();
    }
  };

  return (
    <div
      role="tablist"
      aria-label="Workspace Sections"
      className="no-print"
      onKeyDown={handleKeyDown}
      style={{
        display: 'flex',
        gap: 8,
        overflowX: 'auto',
        paddingBottom: 8,
        marginBottom: 24,
        borderBottom: '1px solid var(--hairline)',
      }}
    >
      {tabs.map(tab => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={isActive}
            aria-controls={`tabpanel-${tab.id}`}
            tabIndex={isActive ? 0 : -1}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 18px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.86rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: isActive ? '1px solid var(--gold)' : '1px solid transparent',
              background: isActive ? 'var(--surface-elevated)' : 'transparent',
              color: isActive ? 'var(--gold)' : 'var(--text-secondary)',
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap',
              position: 'relative',
            }}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.hasAlert && (
              <span
                aria-label="Crisis alert active"
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: 'var(--crisis-coral)',
                  display: 'inline-block',
                  boxShadow: '0 0 8px var(--crisis-coral)',
                }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
