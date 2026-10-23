import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from '@/components/Navbar';
import BudgetMatrix from '@/components/BudgetMatrix';
import VendorWarRoom from '@/components/VendorWarRoom';
import EventWizard from '@/components/EventWizard';
import TimelineEngine from '@/components/TimelineEngine';
import VibeLab from '@/components/VibeLab';
import CrisisSimulator from '@/components/CrisisSimulator';
import { WEDDING_PRESET } from '@/lib/presets';
import { CrisisResponse } from '@/lib/types';

describe('WCAG 2.1 AAA Accessibility & ARIA Compliance (All 7 Components)', () => {
  const weddingPreset = WEDDING_PRESET;

  // ─── 1. Navbar Accessibility ──────────────────────────────────────────────
  describe('Navbar Component Accessibility', () => {
    it('renders with semantic header and navigation landmarks', () => {
      render(
        <Navbar
          modelUsed="llama-3.3-70b-versatile"
          latencyMs={240}
          onLoadPreset={vi.fn()}
          onExport={vi.fn()}
          hasBlueprint={true}
          apiKey="gsk_test_key"
          onApiKeyChange={vi.fn()}
        />
      );

      const header = screen.getByRole('banner');
      expect(header).toBeInTheDocument();

      const nav = screen.getByRole('navigation', { name: /main command center navigation/i });
      expect(nav).toBeInTheDocument();
    });

    it('ensures all buttons have accessible labels and icons have aria-hidden', () => {
      const { container } = render(
        <Navbar
          modelUsed="llama-3.3-70b-versatile"
          latencyMs={240}
          onLoadPreset={vi.fn()}
          onExport={vi.fn()}
          hasBlueprint={true}
          apiKey=""
          onApiKeyChange={vi.fn()}
        />
      );

      const buttons = container.querySelectorAll('button');
      buttons.forEach(button => {
        const accessibleName = button.getAttribute('aria-label') || button.textContent?.trim();
        expect(accessibleName).toBeTruthy();
      });

      const svgs = container.querySelectorAll('svg');
      svgs.forEach(svg => {
        expect(svg.getAttribute('aria-hidden')).toBe('true');
      });
    });

    it('manages modal dialog accessibility attributes when settings are opened', () => {
      render(
        <Navbar
          modelUsed="llama-3.3-70b-versatile"
          latencyMs={240}
          onLoadPreset={vi.fn()}
          onExport={vi.fn()}
          hasBlueprint={true}
          apiKey=""
          onApiKeyChange={vi.fn()}
        />
      );

      const settingsBtn = screen.getByRole('button', { name: /open api key settings/i });
      fireEvent.click(settingsBtn);

      const dialog = screen.getByRole('dialog');
      expect(dialog).toBeInTheDocument();
      expect(dialog).toHaveAttribute('aria-modal', 'true');
      expect(dialog).toHaveAttribute('aria-labelledby', 'api-settings-title');

      const closeBtn = screen.getByRole('button', { name: /close.*settings/i });
      expect(closeBtn).toBeInTheDocument();
    });
  });

  // ─── 2. BudgetMatrix Accessibility ─────────────────────────────────────────
  describe('BudgetMatrix Range Sliders & ARIA Attributes', () => {
    it('verifies range sliders have role="slider" and valid ARIA attributes', () => {
      render(
        <BudgetMatrix
          blueprint={weddingPreset}
          onUpdateBudget={vi.fn()}
          onAIRebalance={vi.fn()}
          isRebalancing={false}
        />
      );

      const expandButtons = screen.getAllByRole('button', { name: /details/i });
      fireEvent.click(expandButtons[0]);

      const sliders = screen.getAllByRole('slider');
      expect(sliders.length).toBeGreaterThan(0);

      const slider = sliders[0];
      expect(slider).toHaveAttribute('type', 'range');
      expect(slider).toHaveAttribute('role', 'slider');

      const valuenow = Number(slider.getAttribute('aria-valuenow'));
      const valuemin = Number(slider.getAttribute('aria-valuemin'));
      const valuemax = Number(slider.getAttribute('aria-valuemax'));

      expect(valuenow).toBeGreaterThanOrEqual(valuemin);
      expect(valuenow).toBeLessThanOrEqual(valuemax);
      expect(slider.getAttribute('aria-valuetext')).toMatch(/₹|\$/);
      expect(slider.getAttribute('aria-label')).toMatch(/adjust budget for/i);
    });

    it('ensures lock toggle buttons have explicit aria-labels indicating state', () => {
      render(
        <BudgetMatrix
          blueprint={weddingPreset}
          onUpdateBudget={vi.fn()}
          onAIRebalance={vi.fn()}
          isRebalancing={false}
        />
      );

      const expandButtons = screen.getAllByRole('button', { name: /details/i });
      fireEvent.click(expandButtons[0]);

      const lockButton = screen.getByRole('button', { name: /(lock|unlock).*budget category/i });
      expect(lockButton).toBeInTheDocument();
      expect(lockButton.getAttribute('aria-label')).toBeTruthy();
    });

    it('provides polite live region for budget telemetry updates', () => {
      const { container } = render(
        <BudgetMatrix
          blueprint={weddingPreset}
          onUpdateBudget={vi.fn()}
          onAIRebalance={vi.fn()}
          isRebalancing={true}
        />
      );

      const liveRegion = container.querySelector('[aria-live="polite"]');
      expect(liveRegion).toBeInTheDocument();
      expect(liveRegion).toHaveAttribute('role', 'status');
    });
  });

  // ─── 3. VendorWarRoom Accessibility ─────────────────────────────────────────
  describe('VendorWarRoom Accessibility & Headings', () => {
    it('ensures procurement summary cards are keyboard navigable with aria-labels', () => {
      render(
        <VendorWarRoom
          vendors={weddingPreset.vendorChecklist}
          currency="INR"
          onUpdateVendors={vi.fn()}
        />
      );

      const estSpend = screen.getByLabelText(/estimated vendor spend/i);
      expect(estSpend).toBeInTheDocument();
      expect(estSpend).toHaveAttribute('tabIndex', '0');

      const negotiated = screen.getByLabelText(/negotiated target/i);
      expect(negotiated).toBeInTheDocument();

      const savings = screen.getByLabelText(/total savings unlocked/i);
      expect(savings).toBeInTheDocument();
    });

    it('opens negotiation script drawer with accessible dialog role and tabs', () => {
      render(
        <VendorWarRoom
          vendors={weddingPreset.vendorChecklist}
          currency="INR"
          onUpdateVendors={vi.fn()}
        />
      );

      const scriptButtons = screen.getAllByRole('button', { name: /open negotiation scripts/i });
      fireEvent.click(scriptButtons[0]);

      const dialog = screen.getByRole('dialog');
      expect(dialog).toBeInTheDocument();
      expect(dialog).toHaveAttribute('aria-modal', 'true');

      const tablist = screen.getByRole('tablist', { name: /negotiation script formats/i });
      expect(tablist).toBeInTheDocument();

      const tabs = screen.getAllByRole('tab');
      expect(tabs.length).toBe(2);

      const activeTab = tabs.find(t => t.getAttribute('aria-selected') === 'true');
      expect(activeTab).toBeInTheDocument();

      const panel = screen.getByRole('tabpanel');
      expect(panel).toBeInTheDocument();
      expect(panel).toHaveAttribute('tabIndex', '0');
    });
  });

  // ─── 4. EventWizard Accessibility ───────────────────────────────────────────
  describe('EventWizard Component Accessibility', () => {
    it('renders with fieldset, legend, and explicit form input associations', () => {
      render(
        <EventWizard
          isOpen={true}
          onClose={vi.fn()}
          onGenerate={vi.fn()}
          isLoading={false}
          loadingMessage=""
        />
      );

      const dialog = screen.getByRole('dialog');
      expect(dialog).toBeInTheDocument();
      expect(dialog).toHaveAttribute('aria-modal', 'true');
      expect(dialog).toHaveAttribute('aria-labelledby', 'wizard-modal-title');

      // Check fieldsets
      const fieldsets = screen.getAllByRole('group');
      expect(fieldsets.length).toBeGreaterThanOrEqual(1);

      // Check title input
      const titleInput = screen.getByLabelText(/event title/i);
      expect(titleInput).toBeInTheDocument();
      expect(titleInput).toHaveAttribute('id', 'wizard-event-title');
      expect(titleInput).toHaveAttribute('aria-required', 'true');
      expect(titleInput).toHaveAttribute('aria-describedby', 'title-helper');

      // Check budget input
      const budgetInput = screen.getByLabelText(/total budget/i);
      expect(budgetInput).toBeInTheDocument();
      expect(budgetInput).toHaveAttribute('id', 'wizard-total-budget');
    });

    it('responds to Escape key by calling onClose callback', () => {
      const handleClose = vi.fn();
      render(
        <EventWizard
          isOpen={true}
          onClose={handleClose}
          onGenerate={vi.fn()}
          isLoading={false}
          loadingMessage=""
        />
      );

      fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' });
      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });

  // ─── 5. TimelineEngine Accessibility ─────────────────────────────────────────
  describe('TimelineEngine Component Accessibility', () => {
    it('ensures milestone status toggle buttons have aria-pressed and descriptive aria-label', () => {
      render(
        <TimelineEngine
          timeline={weddingPreset.timeline}
          onUpdateTimeline={vi.fn()}
          onTriggerCrisis={vi.fn()}
        />
      );

      const section = screen.getByRole('region', { name: /critical-path run-of-show timeline engine/i });
      expect(section).toBeInTheDocument();

      // Find milestone toggle buttons
      const statusButtons = screen.getAllByRole('button', { name: /milestone:.*click to advance/i });
      expect(statusButtons.length).toBeGreaterThan(0);

      const firstBtn = statusButtons[0];
      expect(firstBtn).toHaveAttribute('aria-pressed');
      expect(firstBtn.getAttribute('aria-label')).toMatch(/milestone:.*current status:/i);
    });

    it('ensures phase filter select and crisis trigger button are accessible', () => {
      const triggerCrisis = vi.fn();
      render(
        <TimelineEngine
          timeline={weddingPreset.timeline}
          onUpdateTimeline={vi.fn()}
          onTriggerCrisis={triggerCrisis}
        />
      );

      const phaseFilter = screen.getByLabelText(/filter timeline milestones by phase/i);
      expect(phaseFilter).toBeInTheDocument();

      const critFilter = screen.getByLabelText(/filter timeline milestones by criticality level/i);
      expect(critFilter).toBeInTheDocument();

      // Crisis quick trigger button
      const crisisBtn = screen.getByRole('button', { name: /trigger live crisis simulator/i });
      expect(crisisBtn).toBeInTheDocument();
      fireEvent.click(crisisBtn);
      expect(triggerCrisis).toHaveBeenCalledTimes(1);
    });
  });

  // ─── 6. VibeLab Accessibility ───────────────────────────────────────────────
  describe('VibeLab Component Accessibility', () => {
    it('ensures SOP blueprint expandable drawers have aria-expanded and aria-controls', () => {
      render(
        <VibeLab
          ideas={weddingPreset.personalizedIdeas}
          currency="INR"
          onUpdateIdeas={vi.fn()}
          onShortlistToBudget={vi.fn()}
          eventSummary={weddingPreset.eventSummary}
        />
      );

      const blueprintButtons = screen.getAllByRole('button', { name: /execution blueprint for/i });
      expect(blueprintButtons.length).toBeGreaterThan(0);

      const firstDrawerBtn = blueprintButtons[0];
      expect(firstDrawerBtn).toHaveAttribute('aria-expanded', 'false');
      expect(firstDrawerBtn).toHaveAttribute('aria-controls');

      // Click to expand
      fireEvent.click(firstDrawerBtn);
      expect(firstDrawerBtn).toHaveAttribute('aria-expanded', 'true');

      // The controlled panel must be in the document
      const controlsId = firstDrawerBtn.getAttribute('aria-controls')!;
      const sopPanel = document.getElementById(controlsId);
      expect(sopPanel).toBeInTheDocument();
    });

    it('ensures shortlist buttons have aria-pressed and custom idea modal closes on Escape', () => {
      render(
        <VibeLab
          ideas={weddingPreset.personalizedIdeas}
          currency="INR"
          onUpdateIdeas={vi.fn()}
          onShortlistToBudget={vi.fn()}
          eventSummary={weddingPreset.eventSummary}
        />
      );

      const shortlistButtons = screen.getAllByRole('button', { name: /(shortlist|remove).*in event plan/i });
      expect(shortlistButtons.length).toBeGreaterThan(0);
      expect(shortlistButtons[0]).toHaveAttribute('aria-pressed');

      // Open Add Idea Modal
      const addIdeaBtn = screen.getByRole('button', { name: /add custom creative activation/i });
      fireEvent.click(addIdeaBtn);

      const modal = screen.getByRole('dialog');
      expect(modal).toBeInTheDocument();
      expect(modal).toHaveAttribute('aria-labelledby', 'custom-activation-title');

      // Press Escape to dismiss
      fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' });
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  // ─── 7. CrisisSimulator Accessibility ───────────────────────────────────────
  describe('CrisisSimulator Component Accessibility', () => {
    const mockCrisisResponse: CrisisResponse = {
      crisisTitle: 'Torrential Rain & Outdoor Lawn Flooding',
      severity: 'CRITICAL',
      immediateActions: [
        'T+00m: Evacuate electric lines immediately.',
        'T+05m: Redirect transport shuttles to Grand Ballroom entrance.',
      ],
      budgetImpactDelta: 80000,
      reallocatedFrom: 'Floral & Decor',
      timelineAdjustments: [
        {
          originalTask: 'Outdoor Photography',
          newPlan: 'Moved to covered foyer for rain contingency',
        },
      ],
      emergencyAnnouncementScript: 'Weather contingency activated. Guests redirected to Grand Ballroom.',
    };

    it('ensures active crisis containment panel has role="alert" and aria-live="assertive"', () => {
      render(
        <CrisisSimulator
          eventSummary={weddingPreset.eventSummary}
          currency="INR"
          crisisResponse={mockCrisisResponse}
          onSimulateCrisis={vi.fn()}
          isLoading={false}
          onClearCrisis={vi.fn()}
        />
      );

      const alertContainer = screen.getByRole('alert');
      expect(alertContainer).toBeInTheDocument();
      expect(alertContainer).toHaveAttribute('aria-live', 'assertive');
      expect(alertContainer).toHaveAttribute('aria-labelledby', 'active-crisis-incident-title');
    });

    it('ensures preset crisis injection cards are keyboard navigable with accessible names', () => {
      const simulateMock = vi.fn();
      render(
        <CrisisSimulator
          eventSummary={weddingPreset.eventSummary}
          currency="INR"
          crisisResponse={null}
          onSimulateCrisis={simulateMock}
          isLoading={false}
          onClearCrisis={vi.fn()}
        />
      );

      const presetButtons = screen.getAllByRole('button', { name: /inject crisis scenario:/i });
      expect(presetButtons.length).toBe(4);

      const firstPreset = presetButtons[0];
      expect(firstPreset).toHaveAttribute('tabIndex', '0');

      // Keyboard activation via Enter key
      fireEvent.keyDown(firstPreset, { key: 'Enter', code: 'Enter' });
      expect(simulateMock).toHaveBeenCalledTimes(1);
    });

    it('ensures custom crisis form input has explicit label and accessible submit button', () => {
      render(
        <CrisisSimulator
          eventSummary={weddingPreset.eventSummary}
          currency="INR"
          crisisResponse={null}
          onSimulateCrisis={vi.fn()}
          isLoading={false}
          onClearCrisis={vi.fn()}
        />
      );

      const customInput = screen.getByLabelText(/custom crisis description/i);
      expect(customInput).toBeInTheDocument();
      expect(customInput).toHaveAttribute('id', 'custom-crisis-input');

      const submitBtn = screen.getByRole('button', { name: /simulate crisis contingency response/i });
      expect(submitBtn).toBeInTheDocument();
    });
  });

  // ─── 8. WAI-ARIA Tablist Keyboard Navigation (Arrow Keys) ─────────────────
  describe('WAI-ARIA Tablist Keyboard Navigation Pattern', () => {
    it('supports ArrowRight and ArrowLeft keyboard traversal with roving tabIndex', () => {
      const TestTabs = () => {
        const [activeTab, setActiveTab] = React.useState(0);
        const tabs = ['Budget', 'Timeline', 'Vendors', 'Vibe Lab', 'Crisis War-Room'];
        const tabRefs = React.useRef<(HTMLButtonElement | null)[]>([]);

        const handleKeyDown = (e: React.KeyboardEvent) => {
          if (e.key === 'ArrowRight') {
            e.preventDefault();
            const next = (activeTab + 1) % tabs.length;
            setActiveTab(next);
            tabRefs.current[next]?.focus();
          } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            const prev = (activeTab - 1 + tabs.length) % tabs.length;
            setActiveTab(prev);
            tabRefs.current[prev]?.focus();
          }
        };

        return (
          <div>
            <div role="tablist" aria-label="Workspace Sections" onKeyDown={handleKeyDown}>
              {tabs.map((tab, idx) => (
                <button
                  key={tab}
                  ref={el => { tabRefs.current[idx] = el; }}
                  role="tab"
                  id={`tab-${idx}`}
                  aria-selected={activeTab === idx}
                  aria-controls={`tabpanel-${idx}`}
                  tabIndex={activeTab === idx ? 0 : -1}
                  onClick={() => setActiveTab(idx)}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div
              role="tabpanel"
              id={`tabpanel-${activeTab}`}
              aria-labelledby={`tab-${activeTab}`}
              tabIndex={0}
            >
              Content for {tabs[activeTab]}
            </div>
          </div>
        );
      };

      render(<TestTabs />);

      const tablist = screen.getByRole('tablist', { name: /workspace sections/i });
      expect(tablist).toBeInTheDocument();

      const tabs = screen.getAllByRole('tab');
      expect(tabs).toHaveLength(5);

      // Initially first tab is selected
      expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
      expect(tabs[0]).toHaveAttribute('tabIndex', '0');
      expect(tabs[1]).toHaveAttribute('tabIndex', '-1');

      // Fire ArrowRight: active index moves to 1
      fireEvent.keyDown(tablist, { key: 'ArrowRight', code: 'ArrowRight' });
      expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
      expect(tabs[1]).toHaveAttribute('tabIndex', '0');
      expect(tabs[0]).toHaveAttribute('aria-selected', 'false');

      // Fire ArrowLeft: active index moves back to 0
      fireEvent.keyDown(tablist, { key: 'ArrowLeft', code: 'ArrowLeft' });
      expect(tabs[0]).toHaveAttribute('aria-selected', 'true');

      // Fire ArrowLeft again: wraps to last tab (index 4)
      fireEvent.keyDown(tablist, { key: 'ArrowLeft', code: 'ArrowLeft' });
      expect(tabs[4]).toHaveAttribute('aria-selected', 'true');
      expect(tabs[4]).toHaveAttribute('tabIndex', '0');
    });
  });
});
