import { CrisisResponse, CrisisSeverity, TimelineAdjustment } from './types';

export interface ParsedProtocolAction {
  minuteOffset: number;
  timeSlot: string;
  actionText: string;
}

/**
 * Parses minute-by-minute crisis action items into structured time offsets and instructions.
 * Example: "T+05m: Convene with venue general manager..." -> { minuteOffset: 5, timeSlot: "T+05m", actionText: "Convene with..." }
 */
export function parseMinuteByMinuteProtocol(actions: string[]): ParsedProtocolAction[] {
  if (!actions || !Array.isArray(actions)) return [];

  return actions.map((raw, index) => {
    const trimmed = raw.trim();
    const match = trimmed.match(/^T\+(\d+)(?:m|min)?:\s*(.+)$/i);

    if (match) {
      const minuteOffset = parseInt(match[1], 10);
      return {
        minuteOffset,
        timeSlot: `T+${String(minuteOffset).padStart(2, '0')}m`,
        actionText: match[2].trim(),
      };
    }

    // Default fallback if action lacks explicit T+XXm prefix
    const defaultOffset = index * 5;
    return {
      minuteOffset: defaultOffset,
      timeSlot: `T+${String(defaultOffset).padStart(2, '0')}m`,
      actionText: trimmed,
    };
  });
}

/**
 * Calculates budget delta shock absorption based on crisis severity level.
 * High severity crises trigger larger contingency reallocations.
 */
export function calculateBudgetDeltaReallocation(
  totalBudget: number,
  severity: CrisisSeverity,
  customPercent?: number
): { deltaAmount: number; percentage: number; recommendedSource: string } {
  const severityPercents: Record<CrisisSeverity, number> = {
    CRITICAL: 5.0,
    HIGH: 3.5,
    MODERATE: 2.0,
  };

  const percentage = customPercent !== undefined ? customPercent : severityPercents[severity];
  const deltaAmount = Math.round(totalBudget * (percentage / 100));

  let recommendedSource = 'Unallocated Contingency Reserve';
  if (severity === 'CRITICAL') {
    recommendedSource = 'Emergency Reserve + Non-Essential Stage Decor Buffers';
  } else if (severity === 'HIGH') {
    recommendedSource = 'Contingency Reserve & Miscellaneous Experience Cushion';
  }

  return {
    deltaAmount,
    percentage,
    recommendedSource,
  };
}

/**
 * Generates deterministic fallback crisis response protocol.
 */
export function generateFallbackCrisisResponse(
  scenario: string,
  totalBudget: number
): CrisisResponse {
  const isSevere = /rain|flood|power|transformer|blackout|dead|fire|hospital|injury|cancelled|short-circuit/i.test(scenario);
  const severity: CrisisSeverity = isSevere ? 'CRITICAL' : 'HIGH';
  const { deltaAmount, recommendedSource } = calculateBudgetDeltaReallocation(totalBudget, severity);

  const immediateActions = [
    'T+00m: Halt non-essential stage operations immediately and secure audio-visual power feeds with waterproof isolation covers.',
    'T+05m: Convene with venue general manager and on-site vendor leads in the production green-room.',
    'T+10m: Activate secondary covered banquet space and redirect guest flow via covered canopy walkways.',
    'T+20m: Deploy roving hospitality team offering hot welcome drinks / finger snacks to keep guest mood elevated.',
    'T+30m: Brief emcee with revised timeline sequence and announce slight schedule adjustment warmly to guests.',
  ];

  const timelineAdjustments: TimelineAdjustment[] = [
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
  ];

  return {
    crisisTitle: scenario.length > 50 ? scenario.slice(0, 48) + '...' : scenario,
    severity,
    immediateActions,
    budgetImpactDelta: deltaAmount,
    reallocatedFrom: recommendedSource,
    timelineAdjustments,
    emergencyAnnouncementScript: `Good evening ladies and gentlemen! We truly appreciate your warmth and vibrant energy tonight. To ensure everyone enjoys the celebration in complete comfort, we are transitioning our upcoming segment into the Grand Ballroom foyer. Please join us at the lounge area where live refreshments and appetizers are now being served. The grand celebrations will resume momentarily!`,
  };
}
