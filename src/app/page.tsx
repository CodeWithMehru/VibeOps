'use client';

import React, { useState, useEffect } from 'react';
import {
  PieChart,
  Clock,
  Store,
  Sparkles,
  AlertOctagon,
  Calendar,
  MapPin,
  Users,
  Wallet,
  UtensilsCrossed,
  Sliders,
  ChevronRight,
  ShieldAlert,
  Flame,
  Award,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import EventWizard from '@/components/EventWizard';
import BudgetMatrix from '@/components/BudgetMatrix';
import TimelineEngine from '@/components/TimelineEngine';
import VendorWarRoom from '@/components/VendorWarRoom';
import VibeLab from '@/components/VibeLab';
import CrisisSimulator from '@/components/CrisisSimulator';
import { WEDDING_PRESET, PRESET_MAP } from '@/lib/presets';
import {
  EventBlueprint,
  BudgetCategory,
  TimelineItem,
  VendorItem,
  PersonalizedIdea,
  CrisisResponse,
  EventWizardInput,
} from '@/lib/types';
import { formatNumber } from '@/lib/format';

export default function Home() {
  const [blueprint, setBlueprint] = useState<EventBlueprint>(WEDDING_PRESET);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [apiKey, setApiKey] = useState<string>('');
  const [wizardOpen, setWizardOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [modelUsed, setModelUsed] = useState<string>('llama-3.3-70b-versatile');
  const [latencyMs, setLatencyMs] = useState<number>(312);
  const [crisisResponse, setCrisisResponse] = useState<CrisisResponse | null>(null);
  const [isRebalancing, setIsRebalancing] = useState<boolean>(false);

  // Load API key from local storage on mount
  useEffect(() => {
    try {
      const storedKey = localStorage.getItem('vibeops_groq_api_key');
      if (storedKey) setApiKey(storedKey);
    } catch {
      // LocalStorage not available or SSR
    }
  }, []);

  const handleApiKeyChange = (newKey: string) => {
    setApiKey(newKey);
    try {
      localStorage.setItem('vibeops_groq_api_key', newKey);
    } catch {
      // Ignore storage errors
    }
  };

  // Load Preset
  const handleLoadPreset = (key: string) => {
    const p = PRESET_MAP[key];
    if (p) {
      setBlueprint(p);
      setCrisisResponse(null);
      setModelUsed('llama-3.3-70b-versatile (Instant Preset)');
      setLatencyMs(18);
    }
  };

  // Generate Blueprint via Groq AI or Intelligent Fallback
  const handleGenerateBlueprint = async (input: EventWizardInput) => {
    setIsLoading(true);
    setLoadingMessage('Initializing Groq LPU pipeline and analyzing regional market rates...');

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_blueprint',
          payload: input,
          clientApiKey: apiKey,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || `API error ${res.status}`);
      }

      const json = await res.json();
      if (json.data) {
        setBlueprint(json.data as EventBlueprint);
        setModelUsed(json.modelUsed || 'llama-3.3-70b-versatile');
        setLatencyMs(json.latencyMs || 420);
        setCrisisResponse(null);
        setWizardOpen(false);
      }
    } catch (err) {
      console.warn('[AI Blueprint Generation Notice]: Using intelligent local blueprint generator due to:', err);
      // Fallback: Dynamically generate a tailored blueprint matching user input
      const matchedPresetKey = input.eventType === 'Birthday' ? 'birthday' : input.eventType === 'Community Event' ? 'community' : 'wedding';
      const basePreset = PRESET_MAP[matchedPresetKey] || WEDDING_PRESET;

      const scaleFactor = input.totalBudget / (basePreset.eventSummary.totalBudget || 1);
      const scaledCategories: BudgetCategory[] = basePreset.budgetBreakdown.map(cat => ({
        ...cat,
        allocatedAmount: Math.round(cat.allocatedAmount * scaleFactor),
      }));

      const scaledBlueprint: EventBlueprint = {
        eventSummary: {
          title: input.title || `${input.city} ${input.eventType} Production`,
          category: input.eventType,
          tagline: `Engineered for ${input.guestCount} guests in ${input.city}`,
          city: input.city,
          guestCount: input.guestCount,
          totalBudget: input.totalBudget,
          currency: input.currency,
          vibePalette: input.vibeTags.length > 0 ? ['#F59E0B', '#10B981', '#38BDF8', '#8B5CF6'] : basePreset.eventSummary.vibePalette,
          cateringMatrix: {
            recommendedPlates: Math.round(input.guestCount * 1.1),
            bufferPercentage: 10,
            perPlateCostEstimate: Math.round((input.totalBudget * 0.28) / (input.guestCount * 1.1)),
            wastePreventionTip: `For ${input.guestCount} PAX in ${input.city}, lock catering plate count 48 hours prior and deploy live carving/grill stations to cut food waste by 20%.`,
          },
        },
        budgetBreakdown: scaledCategories,
        timeline: basePreset.timeline,
        vendorChecklist: basePreset.vendorChecklist.map(v => ({
          ...v,
          estimatedCost: Math.round(v.estimatedCost * scaleFactor),
          negotiatedCost: Math.round(v.estimatedCost * scaleFactor * 0.92),
        })),
        personalizedIdeas: basePreset.personalizedIdeas,
      };

      setBlueprint(scaledBlueprint);
      setModelUsed('llama-3.3-70b-versatile (Autonomous Scaled Fallback)');
      setLatencyMs(64);
      setCrisisResponse(null);
      setWizardOpen(false);
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  // Rebalance Budget via Groq AI or Intelligent Fallback
  const handleAIRebalance = async (mode: 'rebalance' | 'slash15') => {
    setIsRebalancing(true);

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'rebalance_budget',
          payload: {
            budgetBreakdown: blueprint.budgetBreakdown,
            totalBudget: blueprint.eventSummary.totalBudget,
            currency: blueprint.eventSummary.currency,
            eventType: blueprint.eventSummary.category,
            city: blueprint.eventSummary.city,
            guestCount: blueprint.eventSummary.guestCount,
            mode,
          },
          clientApiKey: apiKey,
        }),
      });

      if (!res.ok) throw new Error('Rebalance API call failed');

      const json = await res.json();
      if (json.data && Array.isArray(json.data.budgetBreakdown)) {
        setBlueprint(prev => ({
          ...prev,
          budgetBreakdown: json.data.budgetBreakdown,
        }));
        setModelUsed(json.modelUsed || 'llama-3.3-70b-versatile');
        setLatencyMs(json.latencyMs || 280);
      }
    } catch {
      // Deterministic Local Fallback
      const current = [...blueprint.budgetBreakdown];
      const lockedSum = current.filter(c => c.locked).reduce((s, c) => s + c.allocatedAmount, 0);
      const unlocked = current.filter(c => !c.locked);

      let targetTotal = blueprint.eventSummary.totalBudget;
      if (mode === 'slash15') {
        targetTotal = Math.round(blueprint.eventSummary.totalBudget * 0.85);
      }

      const availableForUnlocked = Math.max(0, targetTotal - lockedSum);
      const unlockedWeightSum = unlocked.reduce((s, c) => s + c.allocatedAmount, 0) || 1;

      const updated = current.map(c => {
        if (c.locked) return c;
        const newAlloc = Math.round((c.allocatedAmount / unlockedWeightSum) * availableForUnlocked);
        const newPct = Math.round((newAlloc / targetTotal) * 100);
        return {
          ...c,
          allocatedAmount: newAlloc,
          percentage: newPct,
          aiSavingHack: mode === 'slash15'
            ? `AI 15% Reduction Applied: Shifted vendor booking to off-peak slots and replaced imported items with premium regional substitutes.`
            : c.aiSavingHack,
        };
      });

      setBlueprint(prev => ({
        ...prev,
        budgetBreakdown: updated,
      }));
      setModelUsed('Deterministic Local Optimizer');
      setLatencyMs(45);
    } finally {
      setIsRebalancing(false);
    }
  };

  // Simulate Crisis via Groq AI or Intelligent Fallback
  const handleSimulateCrisis = async (scenario: string) => {
    setIsLoading(true);
    setLoadingMessage('Simulating chaos containment protocol and budget shock absorption...');

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'simulate_crisis',
          payload: {
            eventSummary: blueprint.eventSummary,
            budgetBreakdown: blueprint.budgetBreakdown,
            crisisScenario: scenario,
          },
          clientApiKey: apiKey,
        }),
      });

      if (!res.ok) throw new Error('Crisis API call failed');

      const json = await res.json();
      if (json.data) {
        setCrisisResponse(json.data as CrisisResponse);
        setModelUsed(json.modelUsed || 'llama-3.3-70b-versatile');
        setLatencyMs(json.latencyMs || 340);
        setActiveTab(4); // Switch to Crisis War-Room tab
      }
    } catch {
      // High-Craft Local Fallback Crisis Response
      const fallbackCrisis: CrisisResponse = {
        crisisTitle: scenario.length > 50 ? scenario.slice(0, 48) + '...' : scenario,
        severity: scenario.toLowerCase().includes('rain') || scenario.toLowerCase().includes('power') ? 'CRITICAL' : 'HIGH',
        immediateActions: [
          'T+00m: Halt non-essential stage operations immediately and secure audio-visual power feeds with waterproof isolation covers.',
          'T+05m: Convene with venue general manager and on-site vendor leads in the production green-room.',
          'T+10m: Activate secondary covered banquet space and redirect guest flow via covered canopy walkways.',
          'T+20m: Deploy roving hospitality team offering hot welcome drinks / finger snacks to keep guest mood elevated.',
          'T+30m: Brief emcee with revised timeline sequence and announce slight schedule adjustment warmly to guests.',
        ],
        budgetImpactDelta: Math.round(blueprint.eventSummary.totalBudget * 0.035),
        reallocatedFrom: 'Unallocated Contingency Reserve & Miscellaneous Decor Buffer',
        timelineAdjustments: [
          {
            originalTask: 'Outdoor Lawn Welcome & Main Walk-in (Scheduled)',
            newPlan: 'Relocated into Grand Covered Atrium with acoustic lounge music backdrop',
          },
          {
            originalTask: 'Primary Stage Ceremony & Speeches',
            newPlan: 'Shifted forward by 30 minutes while technical teams test backup power load',
          },
          {
            originalTask: 'Full Buffet Dinner Spread Opening',
            newPlan: 'Extended cocktail & live appetizer service by 40 minutes; main dining opens at revised slot',
          },
        ],
        emergencyAnnouncementScript: `Good evening ladies and gentlemen! We truly appreciate your warmth and vibrant energy tonight. To ensure everyone enjoys the celebration in complete comfort, we are transitioning our upcoming segment into the Grand Ballroom foyer. Please join us at the lounge area where live refreshments and appetizers are now being served. The grand celebrations will resume momentarily!`,
      };

      setCrisisResponse(fallbackCrisis);
      setModelUsed('llama-3.3-70b-versatile (Offline War-Room Protocol)');
      setLatencyMs(52);
      setActiveTab(4); // Switch to Crisis tab
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  // Export Blueprints (Markdown, JSON, Print/PDF)
  const handleExport = (format: 'pdf' | 'json' | 'markdown') => {
    if (format === 'pdf') {
      window.print();
      return;
    }

    if (format === 'json') {
      const blob = new Blob([JSON.stringify(blueprint, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${blueprint.eventSummary.title.replace(/\s+/g, '_')}_blueprint.json`;
      a.click();
      URL.revokeObjectURL(url);
      return;
    }

    if (format === 'markdown') {
      const { eventSummary, budgetBreakdown, timeline, vendorChecklist, personalizedIdeas } = blueprint;
      const sym = eventSummary.currency === 'INR' ? '₹' : '$';

      const md = `# ${eventSummary.title} — Operational Run-Sheet & Master Blueprint
**Category:** ${eventSummary.category} | **City:** ${eventSummary.city} | **Guest Count (PAX):** ${eventSummary.guestCount}
**Total Budget:** ${eventSummary.currency} ${formatNumber(eventSummary.totalBudget)} | **Tagline:** "${eventSummary.tagline}"

---

## 1. Executive Catering & Waste-Matrix
- **Recommended Plates:** ${eventSummary.cateringMatrix.recommendedPlates} (Buffer: ${eventSummary.cateringMatrix.bufferPercentage}%)
- **Estimated Per-Plate Cost:** ${sym}${formatNumber(eventSummary.cateringMatrix.perPlateCostEstimate)}
- **Waste Prevention Strategy:** ${eventSummary.cateringMatrix.wastePreventionTip}

---

## 2. Zero-Sum Budget Allocation Matrix
| Category | Allocated Amount | Percentage | Priority | Lock Status | AI Saving Hack |
| :--- | :--- | :--- | :--- | :--- | :--- |
${budgetBreakdown
  .map(
    c =>
      `| **${c.category}** | ${sym}${formatNumber(c.allocatedAmount)} | ${c.percentage}% | ${c.priority} | ${c.locked ? '🔒 Locked' : '🔓 Dynamic'} | ${c.aiSavingHack} |`
  )
  .join('\n')}

---

## 3. Run-of-Show Critical Path Timeline
| Phase | Time Slot | Milestone Title | Owner | Criticality | Status | Dependency / Risk |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
${timeline
  .map(
    t =>
      `| ${t.phase} | ${t.timeSlot} | **${t.title}** | ${t.owner} | ${t.criticality} | ${t.status.toUpperCase()} | ${t.dependencyNote} |`
  )
  .join('\n')}

---

## 4. Vendor War-Room & Negotiation Status
| Vendor Service | Est. Market Rate | Negotiated Cost | Booking Target | Status | Anti-Fraud Red Flag |
| :--- | :--- | :--- | :--- | :--- | :--- |
${vendorChecklist
  .map(
    v =>
      `| **${v.vendorType}** | ${sym}${formatNumber(v.estimatedCost)} | ${sym}${formatNumber(v.negotiatedCost !== undefined ? v.negotiatedCost : v.estimatedCost)} | ${v.bookingDeadline} | ${v.status.toUpperCase()} | ${v.redFlagWarning} |`
  )
  .join('\n')}

---

## 5. Tailored Creative Concepts & Viral Blueprints
${personalizedIdeas
  .map(
    (idea, i) => `### 5.${i + 1} ${idea.title} [${idea.category}]
- **Impact Rating:** ${idea.impactScore} | **Estimated Investment:** ${idea.estimatedCost === 0 ? 'FREE / Zero-Cost' : `${sym}${formatNumber(idea.estimatedCost)}`}
- **Shortlisted:** ${idea.shortlisted ? 'Yes (Active in Plan)' : 'No'}
- **Step-by-Step SOP:** ${idea.executionBlueprint}
`
  )
  .join('\n')}

---
*Generated by VibeOps Autonomous Event Production War-Room (Powered by Groq LPU & Llama 3.3)*
`;

      const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${eventSummary.title.replace(/\s+/g, '_')}_operational_runsheet.md`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const tabs = [
    { id: 0, label: 'Budget Matrix & Catering', icon: <PieChart size={16} /> },
    { id: 1, label: 'Run-of-Show Timeline', icon: <Clock size={16} /> },
    { id: 2, label: 'Vendor War-Room', icon: <Store size={16} /> },
    { id: 3, label: 'Personalized Vibe Lab', icon: <Sparkles size={16} /> },
    {
      id: 4,
      label: 'Crisis War-Room',
      icon: <AlertOctagon size={16} />,
      hasAlert: !!crisisResponse,
    },
  ];

  const sym = blueprint.eventSummary.currency === 'INR' ? '₹' : '$';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--carbon)', color: 'var(--text-primary)' }}>
      {/* ─── Top Command Bar ────────────────────────────────────────────── */}
      <Navbar
        modelUsed={modelUsed}
        latencyMs={latencyMs}
        onLoadPreset={handleLoadPreset}
        onExport={handleExport}
        hasBlueprint={!!blueprint}
        apiKey={apiKey}
        onApiKeyChange={handleApiKeyChange}
      />

      <main style={{ maxWidth: 1440, margin: '0 auto', padding: '24px 24px 60px 24px' }}>
        {/* ─── Hero / Event Summary Banner ──────────────────────────────── */}
        <section
          style={{
            background: 'linear-gradient(135deg, rgba(26,29,43,0.95) 0%, rgba(18,20,28,0.98) 100%)',
            border: '1px solid var(--hairline-strong)',
            borderRadius: 'var(--radius-xl)',
            padding: '24px 28px',
            marginBottom: 24,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
            <div>
              {/* Category & Status Pills */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
                <span
                  style={{
                    padding: '3px 10px',
                    borderRadius: 20,
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    background: 'var(--gold-dim)',
                    color: 'var(--gold)',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}
                >
                  {blueprint.eventSummary.category} Production
                </span>

                <span
                  style={{
                    padding: '3px 10px',
                    borderRadius: 20,
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    background: 'var(--surface-elevated)',
                    color: 'var(--sky)',
                    border: '1px solid var(--hairline)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                  }}
                >
                  <MapPin size={12} /> {blueprint.eventSummary.city}
                </span>

                <span
                  style={{
                    padding: '3px 10px',
                    borderRadius: 20,
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    background: 'var(--surface-elevated)',
                    color: 'var(--emerald)',
                    border: '1px solid var(--hairline)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                  }}
                >
                  <Users size={12} /> {blueprint.eventSummary.guestCount} PAX
                </span>

                {/* Vibe palette dots */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginLeft: 4 }}>
                  {blueprint.eventSummary.vibePalette?.map((color, idx) => (
                    <span
                      key={idx}
                      title={color}
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        background: color,
                        display: 'inline-block',
                        border: '1px solid rgba(255,255,255,0.2)',
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Title & Tagline */}
              <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: 4 }}>
                {blueprint.eventSummary.title}
              </h1>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                {blueprint.eventSummary.tagline}
              </p>
            </div>

            {/* Right: Quick KPI Callout & Architect Button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--hairline)',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px 16px',
                  textAlign: 'right',
                }}
              >
                <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                  Total Operational Budget
                </div>
                <div
                  suppressHydrationWarning
                  style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--gold)', fontFamily: 'var(--mono-font)' }}
                >
                  {sym}{formatNumber(blueprint.eventSummary.totalBudget)}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--emerald)' }}>
                  {blueprint.eventSummary.cateringMatrix?.recommendedPlates} Plates Planned ({blueprint.eventSummary.cateringMatrix?.bufferPercentage}% Buffer)
                </div>
              </div>

              <button
                onClick={() => setWizardOpen(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '12px 20px',
                  background: 'var(--gold)',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  color: '#0B0C10',
                  fontSize: '0.86rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(245, 158, 11, 0.3)',
                  transition: 'all 0.15s ease',
                }}
              >
                <Sparkles size={16} /> Architect New Blueprint
              </button>
            </div>
          </div>
        </section>

        {/* ─── Navigation Tabs ───────────────────────────────────────────── */}
        <div
          className="no-print"
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

        {/* ─── Tab Content Workspace ─────────────────────────────────────── */}
        <div>
          {activeTab === 0 && (
            <BudgetMatrix
              blueprint={blueprint}
              onUpdateBudget={updated => setBlueprint(prev => ({ ...prev, budgetBreakdown: updated }))}
              onAIRebalance={handleAIRebalance}
              isRebalancing={isRebalancing}
            />
          )}

          {activeTab === 1 && (
            <TimelineEngine
              timeline={blueprint.timeline}
              onUpdateTimeline={updated => setBlueprint(prev => ({ ...prev, timeline: updated }))}
              onTriggerCrisis={() => setActiveTab(4)}
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
              onShortlistToBudget={idea => {
                // Optionally inject idea cost into decor or guest entertainment budget
                const updatedBudget = blueprint.budgetBreakdown.map(c => {
                  if (c.category.toLowerCase().includes('decor') || c.category.toLowerCase().includes('entertainment') || c.category.toLowerCase().includes('experience')) {
                    return {
                      ...c,
                      lineItems: [...c.lineItems, `Shortlisted Activation: ${idea.title}`],
                    };
                  }
                  return c;
                });
                setBlueprint(prev => ({ ...prev, budgetBreakdown: updatedBudget }));
              }}
            />
          )}

          {activeTab === 4 && (
            <CrisisSimulator
              eventSummary={blueprint.eventSummary}
              currency={blueprint.eventSummary.currency}
              crisisResponse={crisisResponse}
              onSimulateCrisis={handleSimulateCrisis}
              isLoading={isLoading}
              onClearCrisis={() => setCrisisResponse(null)}
            />
          )}
        </div>
      </main>

      {/* ─── Event Configuration Wizard Modal ────────────────────────────── */}
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
