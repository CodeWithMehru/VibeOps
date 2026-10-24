'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import EventWizard from '@/components/EventWizard';
import CommandMutatorBar from '@/components/CommandMutatorBar';
import EventSummaryBanner from '@/components/EventSummaryBanner';
import WorkspaceTabs from '@/components/WorkspaceTabs';
import WorkspacePanels from '@/components/WorkspacePanels';
import { WEDDING_PRESET, PRESET_MAP } from '@/lib/presets';
import { exportBlueprint } from '@/lib/export-utils';
import {
  requestGenerateBlueprint,
  requestRebalanceBudget,
  requestSimulateCrisis,
  requestMutateBlueprint,
} from '@/lib/ai-client';
import { EventBlueprint, CrisisResponse, EventWizardInput } from '@/lib/types';

export default function Home() {
  const [blueprint, setBlueprint] = useState<EventBlueprint>(WEDDING_PRESET);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [apiKey, setApiKey] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      try {
        return localStorage.getItem('vibeops_groq_api_key') || '';
      } catch {
        return '';
      }
    }
    return '';
  });
  const [wizardOpen, setWizardOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [modelUsed, setModelUsed] = useState<string>('llama-3.3-70b-versatile');
  const [latencyMs, setLatencyMs] = useState<number>(312);
  const [crisisResponse, setCrisisResponse] = useState<CrisisResponse | null>(null);
  const [isRebalancing, setIsRebalancing] = useState<boolean>(false);
  const [quickCommand, setQuickCommand] = useState<string>('');
  const [commandFeedback, setCommandFeedback] = useState<string | null>(null);
  const [isMutating, setIsMutating] = useState<boolean>(false);

  const handleApiKeyChange = (newKey: string) => {
    setApiKey(newKey);
    try {
      localStorage.setItem('vibeops_groq_api_key', newKey);
    } catch {
      // Storage unavailable
    }
  };

  const handleLoadPreset = (key: string) => {
    const p = PRESET_MAP[key];
    if (p) {
      setBlueprint(p);
      setCrisisResponse(null);
      setModelUsed('llama-3.3-70b-versatile (Instant Preset)');
      setLatencyMs(18);
    }
  };

  const handleGenerateBlueprint = async (input: EventWizardInput) => {
    setIsLoading(true);
    setLoadingMessage('Initializing Groq LPU pipeline and analyzing regional market rates...');
    try {
      const res = await requestGenerateBlueprint(input, apiKey);
      setBlueprint(res.data);
      setModelUsed(res.modelUsed);
      setLatencyMs(res.latencyMs);
      setCrisisResponse(null);
      setWizardOpen(false);
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  const handleAIRebalance = async (mode: 'rebalance' | 'slash15') => {
    setIsRebalancing(true);
    try {
      const res = await requestRebalanceBudget(blueprint, mode, apiKey);
      setBlueprint(prev => ({ ...prev, budgetBreakdown: res.data }));
      setModelUsed(res.modelUsed);
      setLatencyMs(res.latencyMs);
    } finally {
      setIsRebalancing(false);
    }
  };

  const handleSimulateCrisis = async (scenario: string) => {
    setIsLoading(true);
    setLoadingMessage('Simulating chaos containment protocol and budget shock absorption...');
    try {
      const res = await requestSimulateCrisis(blueprint.eventSummary, blueprint.budgetBreakdown, scenario, apiKey);
      setCrisisResponse(res.data);
      setModelUsed(res.modelUsed);
      setLatencyMs(res.latencyMs);
      setActiveTab(4);
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  const handleExecuteCommand = async (cmdToRun: string) => {
    const cmd = (cmdToRun || quickCommand).trim();
    if (!cmd || isMutating) return;

    setIsMutating(true);
    setLoadingMessage(`Executing operational directive: "${cmd}"...`);
    try {
      const res = await requestMutateBlueprint(blueprint, cmd, apiKey);
      setBlueprint(res.data.updatedBlueprint);
      setCommandFeedback(res.data.appliedSummary);
      setModelUsed(res.modelUsed);
      setLatencyMs(res.latencyMs);
    } finally {
      setIsMutating(false);
      setQuickCommand('');
      setTimeout(() => setCommandFeedback(null), 6000);
    }
  };

  const sym = blueprint.eventSummary.currency === 'INR' ? '₹' : '$';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--carbon)', color: 'var(--text-primary)' }}>
      <Navbar
        modelUsed={modelUsed}
        latencyMs={latencyMs}
        onLoadPreset={handleLoadPreset}
        onExport={format => exportBlueprint(blueprint, format)}
        hasBlueprint={!!blueprint}
        apiKey={apiKey}
        onApiKeyChange={handleApiKeyChange}
      />

      <div role="status" aria-live="polite" className="sr-only">
        {isLoading
          ? loadingMessage
          : `Active section: tab ${activeTab + 1} for ${blueprint.eventSummary.title}`}
      </div>

      <main id="main-content" style={{ maxWidth: 1440, margin: '0 auto', padding: '24px 24px 60px 24px' }}>
        <EventSummaryBanner
          blueprint={blueprint}
          sym={sym}
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

        <WorkspaceTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          hasCrisisAlert={!!crisisResponse}
        />

        <WorkspacePanels
          activeTab={activeTab}
          blueprint={blueprint}
          setBlueprint={setBlueprint}
          crisisResponse={crisisResponse}
          setCrisisResponse={setCrisisResponse}
          onAIRebalance={handleAIRebalance}
          isRebalancing={isRebalancing}
          onSimulateCrisis={handleSimulateCrisis}
          isLoading={isLoading}
          onNavigateToCrisis={() => setActiveTab(4)}
        />
      </main>

      <footer
        role="contentinfo"
        className="no-print"
        style={{
          borderTop: '1px solid var(--hairline)',
          padding: '24px 20px',
          textAlign: 'center',
          fontSize: '0.8rem',
          color: 'var(--text-tertiary)',
        }}
      >
        <p>
          VibeOps — Autonomous Event Production Command Center & Crisis War-Room • Built for Hack2Skill PromptWars 2026 Challenge 5
        </p>
      </footer>

      <EventWizard
        isOpen={wizardOpen}
        onClose={() => setWizardOpen(false)}
        onGenerate={handleGenerateBlueprint}
        isLoading={isLoading}
        loadingMessage={loadingMessage}
      />
    </div>
  );
}
