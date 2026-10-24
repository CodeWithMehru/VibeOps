import React, { useState } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CommandMutatorBar from '@/components/CommandMutatorBar';
import EventSummaryBanner from '@/components/EventSummaryBanner';
import GuestCohortStudio from '@/components/GuestCohortStudio';
import { WEDDING_PRESET } from '@/lib/presets';
import { EventBlueprint } from '@/lib/types';
import { applyQuickCommandMutation } from '@/lib/domain-engine';
import { formatNumber } from '@/lib/format';

// Mock Navigator Clipboard
beforeEach(() => {
  Object.assign(navigator, {
    clipboard: {
      writeText: vi.fn().mockResolvedValue(undefined),
    },
  });
});

/**
 * Integrated Harness combining CommandMutatorBar, EventSummaryBanner,
 * and GuestCohortStudio with live state synchronization.
 */
function IntegratedWorkspaceHarness() {
  const [blueprint, setBlueprint] = useState<EventBlueprint>(WEDDING_PRESET);
  const [quickCommand, setQuickCommand] = useState('');
  const [isMutating, setIsMutating] = useState(false);
  const [commandFeedback, setCommandFeedback] = useState<string | null>(null);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const handleExecuteCommand = (cmd: string) => {
    setIsMutating(true);
    const result = applyQuickCommandMutation(blueprint, cmd);
    setBlueprint(result.updatedBlueprint);
    setCommandFeedback(result.appliedSummary);
    setIsMutating(false);
  };

  const tabs = [
    { id: 0, label: 'Budget Matrix & Catering' },
    { id: 1, label: 'Run-of-Show Timeline' },
    { id: 2, label: 'Vendor War-Room' },
    { id: 3, label: 'Personalized Vibe Lab' },
    { id: 4, label: 'Crisis War-Room' },
  ];

  return (
    <div>
      <EventSummaryBanner
        blueprint={blueprint}
        sym="₹"
        wizardOpen={wizardOpen}
        onOpenWizard={() => setWizardOpen(true)}
      />

      <CommandMutatorBar
        quickCommand={quickCommand}
        setQuickCommand={setQuickCommand}
        isMutating={isMutating}
        commandFeedback={commandFeedback}
        onExecuteCommand={handleExecuteCommand}
      />

      {/* ARIA Accessible Tablist with Arrow Navigation */}
      <div
        role="tablist"
        aria-label="Workspace Sections"
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') {
            e.preventDefault();
            const nextTab = (activeTab + 1) % tabs.length;
            setActiveTab(nextTab);
            document.getElementById(`test-tab-${nextTab}`)?.focus();
          } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            const prevTab = (activeTab - 1 + tabs.length) % tabs.length;
            setActiveTab(prevTab);
            document.getElementById(`test-tab-${prevTab}`)?.focus();
          }
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            id={`test-tab-${tab.id}`}
            aria-selected={activeTab === tab.id}
            tabIndex={activeTab === tab.id ? 0 : -1}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <GuestCohortStudio eventSummary={blueprint.eventSummary} />
    </div>
  );
}

describe('VibeOps End-to-End Command & Production Integration Suite', () => {
  it('renders EventSummaryBanner, CommandMutatorBar, and GuestCohortStudio seamlessly', () => {
    render(<IntegratedWorkspaceHarness />);

    expect(screen.getByRole('heading', { level: 1, name: WEDDING_PRESET.eventSummary.title })).toBeInTheDocument();
    expect(screen.getByRole('search', { name: /AI Blueprint Command Mutator/i })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: /Guest Cohort, Dietary Split & Smart Invite Studio/i })).toBeInTheDocument();
  });

  it('executes a quick suggestion pill mutation and updates event telemetry instantaneously', async () => {
    render(<IntegratedWorkspaceHarness />);

    const cut10Pill = screen.getByRole('button', { name: /Run quick suggestion: Cut Total Spend by 10%/i });
    expect(cut10Pill).toBeInTheDocument();

    const originalBudget = WEDDING_PRESET.eventSummary.totalBudget;
    fireEvent.click(cut10Pill);

    // Verify feedback announcement
    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent(/Slashed total budget by 10%/i);
    });

    // Verify updated telemetry in summary card
    const expectedBudget = Math.round(originalBudget * 0.9);
    expect(screen.getByLabelText(new RegExp(`Total Operational Budget: ₹${formatNumber(expectedBudget)}`))).toBeInTheDocument();
  });

  it('executes custom command directive via text input and enter key', async () => {
    render(<IntegratedWorkspaceHarness />);

    const input = screen.getByPlaceholderText(/Type command/i);
    fireEvent.change(input, { target: { value: 'Add VIP Guest Buffer +25 PAX' } });

    const submitBtn = screen.getByRole('button', { name: /Execute operational command on blueprint/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent(/Increased event headcount by \+25 PAX/i);
    });
  });

  it('switches invite broadcast formats and copies tailored scripts to clipboard', async () => {
    render(<IntegratedWorkspaceHarness />);

    // Default is WhatsApp
    const waButton = screen.getByRole('button', { name: /Format invite for WhatsApp/i });
    expect(waButton).toHaveAttribute('aria-pressed', 'true');

    // Switch to Formal VIP
    const formalButton = screen.getByRole('button', { name: /Format invite as Formal VIP/i });
    fireEvent.click(formalButton);
    expect(formalButton).toHaveAttribute('aria-pressed', 'true');
    expect(waButton).toHaveAttribute('aria-pressed', 'false');

    // Switch to Community
    const communityButton = screen.getByRole('button', { name: /Format invite for Community Announcement/i });
    fireEvent.click(communityButton);
    expect(communityButton).toHaveAttribute('aria-pressed', 'true');

    // Copy Invite
    const copyBtn = screen.getByRole('button', { name: /Copy invitation broadcast text to clipboard/i });
    fireEvent.click(copyBtn);

    expect(navigator.clipboard.writeText).toHaveBeenCalled();
    await waitFor(() => {
      expect(screen.getByText('Copied!')).toBeInTheDocument();
    });
  });

  it('supports WAI-ARIA ArrowRight and ArrowLeft keyboard tab switching', () => {
    render(<IntegratedWorkspaceHarness />);

    const tab0 = screen.getByRole('tab', { name: /Budget Matrix & Catering/i });
    const tab1 = screen.getByRole('tab', { name: /Run-of-Show Timeline/i });
    const tab4 = screen.getByRole('tab', { name: /Crisis War-Room/i });

    expect(tab0).toHaveAttribute('aria-selected', 'true');
    expect(tab1).toHaveAttribute('aria-selected', 'false');

    const tablist = screen.getByRole('tablist', { name: /Workspace Sections/i });

    // Press ArrowRight -> tab 1 should be selected
    fireEvent.keyDown(tablist, { key: 'ArrowRight' });
    expect(tab1).toHaveAttribute('aria-selected', 'true');
    expect(tab0).toHaveAttribute('aria-selected', 'false');

    // Press ArrowLeft twice -> tab 0 then wrap around to tab 4
    fireEvent.keyDown(tablist, { key: 'ArrowLeft' });
    expect(tab0).toHaveAttribute('aria-selected', 'true');

    fireEvent.keyDown(tablist, { key: 'ArrowLeft' });
    expect(tab4).toHaveAttribute('aria-selected', 'true');
  });

  it('triggers the Architect New Blueprint modal from the event summary banner', () => {
    render(<IntegratedWorkspaceHarness />);

    const architectBtn = screen.getByRole('button', { name: /Open Event Architect Wizard/i });
    expect(architectBtn).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(architectBtn);
    expect(architectBtn).toHaveAttribute('aria-expanded', 'true');
  });
});
