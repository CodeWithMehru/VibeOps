'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

export interface CommandMutatorBarProps {
  quickCommand: string;
  setQuickCommand: (cmd: string) => void;
  isMutating: boolean;
  commandFeedback: string | null;
  onExecuteCommand: (cmd: string) => void;
}

const COMMAND_SUGGESTIONS = [
  'Cut Total Spend by 10%',
  'Add Drone Photography Vendor',
  'Add VIP Guest Buffer +25 PAX',
] as const;

/**
 * CommandMutatorBar Component
 *
 * Dedicated search-and-mutate bar that accepts natural language operational
 * directives to rebalance budget, inject vendors, adjust guest buffers,
 * or modify timeline states deterministically.
 */
export default function CommandMutatorBar({
  quickCommand,
  setQuickCommand,
  isMutating,
  commandFeedback,
  onExecuteCommand,
}: CommandMutatorBarProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onExecuteCommand(quickCommand);
  };

  return (
    <section style={{ marginBottom: 20 }} aria-label="AI Blueprint Command Bar">
      <form
        role="search"
        aria-label="AI Blueprint Command Mutator"
        onSubmit={handleSubmit}
        className="command-bar-form"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          background: 'var(--surface)',
          border: '1px solid var(--hairline-strong)',
          borderRadius: 'var(--radius-lg)',
          padding: '8px 14px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.25)',
        }}
      >
        <Sparkles size={18} aria-hidden="true" color="var(--gold)" style={{ flexShrink: 0 }} />
        <label htmlFor="ai-command-mutator-input" className="sr-only">
          AI Operational Directive Command
        </label>
        <input
          id="ai-command-mutator-input"
          type="text"
          placeholder="Type command (e.g. 'Cut Total Spend by 10%', 'Add Drone Photography Vendor', 'Add VIP Guest Buffer +25 PAX')..."
          value={quickCommand}
          onChange={(e) => setQuickCommand(e.target.value)}
          disabled={isMutating}
          aria-label="AI Operational Directive Command Input"
          style={{
            border: 'none',
            background: 'transparent',
            outline: 'none',
            color: 'var(--text-primary)',
            fontSize: '0.88rem',
            flex: 1,
          }}
        />
        <button
          type="submit"
          disabled={!quickCommand.trim() || isMutating}
          className="btn-primary"
          aria-label="Execute operational command on blueprint"
          style={{ padding: '8px 16px', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
        >
          {isMutating ? 'Executing...' : 'Run Directive'}
        </button>
      </form>

      {/* Feedback announcement */}
      {commandFeedback && (
        <div
          role="status"
          aria-live="polite"
          style={{
            marginTop: 8,
            padding: '8px 14px',
            background: 'var(--emerald-dim)',
            border: '1px solid var(--emerald)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--emerald)',
            fontSize: '0.82rem',
            fontWeight: 600,
          }}
        >
          ✓ {commandFeedback}
        </div>
      )}

      {/* Suggestion Pills */}
      <div
        style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, flexWrap: 'wrap' }}
        role="group"
        aria-label="Preset operational command suggestions"
      >
        <span style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Suggestions:
        </span>
        {COMMAND_SUGGESTIONS.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            className="suggestion-pill"
            aria-label={`Run quick suggestion: ${suggestion}`}
            onClick={() => onExecuteCommand(suggestion)}
            disabled={isMutating}
            style={{
              background: 'var(--surface-elevated)',
              border: '1px solid var(--hairline)',
              borderRadius: 20,
              padding: '4px 12px',
              fontSize: '0.74rem',
              color: 'var(--text-secondary)',
              cursor: isMutating ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--gold)';
              e.currentTarget.style.color = 'var(--gold)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--hairline)';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
          >
            + {suggestion}
          </button>
        ))}
      </div>
    </section>
  );
}
