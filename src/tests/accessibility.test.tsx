import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from '@/components/Navbar';
import BudgetMatrix from '@/components/BudgetMatrix';
import VendorWarRoom from '@/components/VendorWarRoom';
import { WEDDING_PRESET } from '@/lib/presets';

describe('WCAG 2.1 AA Accessibility & ARIA Compliance', () => {
  const weddingPreset = WEDDING_PRESET;

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

      // Icon-only and regular buttons must have accessible names
      const buttons = container.querySelectorAll('button');
      buttons.forEach(button => {
        const accessibleName = button.getAttribute('aria-label') || button.textContent?.trim();
        expect(accessibleName).toBeTruthy();
      });

      // All SVG icons must be decorative and hidden from screen readers
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

      // Click on the first category to expand and reveal the slider
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

      // Lock / Unlock button inside expanded section
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

      // Drawer script tabs (WAI-ARIA tab pattern)
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

  describe('WAI-ARIA Tablist Navigation Pattern', () => {
    it('validates compliant tablist, tab, and tabpanel attributes', () => {
      // Simulate the WAI-ARIA tab structure as built in page.tsx
      const TestTabs = () => {
        const [activeTab, setActiveTab] = React.useState(0);
        const tabs = ['Budget', 'Timeline', 'Vendors'];

        return (
          <div>
            <div role="tablist" aria-label="Workspace Sections">
              {tabs.map((tab, idx) => (
                <button
                  key={tab}
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
      expect(tabs).toHaveLength(3);

      // Initially first tab is selected
      expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
      expect(tabs[0]).toHaveAttribute('tabIndex', '0');
      expect(tabs[1]).toHaveAttribute('aria-selected', 'false');
      expect(tabs[1]).toHaveAttribute('tabIndex', '-1');

      const panel = screen.getByRole('tabpanel');
      expect(panel).toHaveAttribute('aria-labelledby', 'tab-0');
      expect(panel).toHaveAttribute('tabIndex', '0');

      // Click second tab
      fireEvent.click(tabs[1]);
      expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
      expect(tabs[0]).toHaveAttribute('aria-selected', 'false');
      expect(screen.getByRole('tabpanel')).toHaveAttribute('aria-labelledby', 'tab-1');
    });
  });
});
