'use client';

import React from 'react';
import BudgetMatrix from './BudgetMatrix';
import TimelineEngine from './TimelineEngine';
import VendorWarRoom from './VendorWarRoom';
import VibeLab from './VibeLab';
import CrisisSimulator from './CrisisSimulator';
import { EventBlueprint, CrisisResponse, PersonalizedIdea } from '@/lib/types';

interface WorkspacePanelsProps {
  activeTab: number;
  blueprint: EventBlueprint;
  setBlueprint: React.Dispatch<React.SetStateAction<EventBlueprint>>;
  crisisResponse: CrisisResponse | null;
  setCrisisResponse: (r: CrisisResponse | null) => void;
  onAIRebalance: (mode: 'rebalance' | 'slash15') => Promise<void>;
  isRebalancing: boolean;
  onSimulateCrisis: (scenario: string) => Promise<void>;
  isLoading: boolean;
  onNavigateToCrisis: () => void;
}

/**
 * WorkspacePanels Component
 *
 * Hosts the active operational workspace view corresponding to the active tab:
 * BudgetMatrix, TimelineEngine, VendorWarRoom, VibeLab, or CrisisSimulator.
 */
export default function WorkspacePanels({
  activeTab,
  blueprint,
  setBlueprint,
  crisisResponse,
  setCrisisResponse,
  onAIRebalance,
  isRebalancing,
  onSimulateCrisis,
  isLoading,
  onNavigateToCrisis,
}: WorkspacePanelsProps) {
  const handleShortlistIdea = (idea: PersonalizedIdea) => {
    const updatedBudget = blueprint.budgetBreakdown.map(c => {
      const catLower = c.category.toLowerCase();
      if (catLower.includes('decor') || catLower.includes('entertainment') || catLower.includes('experience')) {
        return {
          ...c,
          lineItems: [...c.lineItems, `Shortlisted Activation: ${idea.title}`],
        };
      }
      return c;
    });
    setBlueprint(prev => ({ ...prev, budgetBreakdown: updatedBudget }));
  };

  return (
    <div
      role="tabpanel"
      id={`tabpanel-${activeTab}`}
      aria-labelledby={`tab-${activeTab}`}
      tabIndex={0}
      style={{ outline: 'none' }}
    >
      {activeTab === 0 && (
        <BudgetMatrix
          blueprint={blueprint}
          onUpdateBudget={updated => setBlueprint(prev => ({ ...prev, budgetBreakdown: updated }))}
          onAIRebalance={onAIRebalance}
          isRebalancing={isRebalancing}
        />
      )}

      {activeTab === 1 && (
        <TimelineEngine
          timeline={blueprint.timeline}
          onUpdateTimeline={updated => setBlueprint(prev => ({ ...prev, timeline: updated }))}
          onTriggerCrisis={onNavigateToCrisis}
        />
      )}

      {activeTab === 2 && (
        <VendorWarRoom
          vendors={blueprint.vendorChecklist}
          currency={blueprint.eventSummary.currency}
          onUpdateVendors={updated => setBlueprint(prev => ({ ...prev, vendorChecklist: updated }))}
        />
      )}

      {activeTab === 3 && (
        <VibeLab
          ideas={blueprint.personalizedIdeas}
          currency={blueprint.eventSummary.currency}
          onUpdateIdeas={updated => setBlueprint(prev => ({ ...prev, personalizedIdeas: updated }))}
          onShortlistToBudget={handleShortlistIdea}
          eventSummary={blueprint.eventSummary}
        />
      )}

      {activeTab === 4 && (
        <CrisisSimulator
          eventSummary={blueprint.eventSummary}
          currency={blueprint.eventSummary.currency}
          crisisResponse={crisisResponse}
          onSimulateCrisis={onSimulateCrisis}
          isLoading={isLoading}
          onClearCrisis={() => setCrisisResponse(null)}
        />
      )}
    </div>
  );
}
