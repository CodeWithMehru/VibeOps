/**
 * ─── VibeOps Pure Domain Engine ──────────────────────────────────────────────
 * High-performance, deterministic event production logic and mathematical models.
 * Zero external dependencies. Strictly typed and fully documented.
 */

import {
  BudgetCategory,
  CateringMatrix,
  CrisisSeverity,
  TimelineItem,
  VendorItem,
} from './types';

// ─── 1. Budget Rebalancing & Mathematical Models ─────────────────────────────

/**
 * Rebalances unlocked budget categories while strictly preserving locked allocations.
 * Guarantees zero-sum budget integrity (sum of allocated amounts matches targetTotal).
 *
 * @param categories - Array of budget categories to balance
 * @param totalBudget - The total target budget for the event
 * @param mode - 'rebalance' for standard proportional distribution, or 'slash15' for 15% total reduction
 * @returns Balanced array of BudgetCategory items with updated allocations and percentages
 *
 * @example
 * const balanced = rebalanceBudgetCategories(categories, 2500000, 'rebalance');
 */
export function rebalanceBudgetCategories(
  categories: BudgetCategory[],
  totalBudget: number,
  mode: 'rebalance' | 'slash15' = 'rebalance'
): BudgetCategory[] {
  if (!categories || categories.length === 0) return [];

  const targetTotal = mode === 'slash15' ? Math.round(totalBudget * 0.85) : totalBudget;
  const lockedCategories = categories.filter(c => c.locked);
  const unlockedCategories = categories.filter(c => !c.locked);

  const lockedSum = lockedCategories.reduce((sum, c) => sum + c.allocatedAmount, 0);
  const availableForUnlocked = Math.max(0, targetTotal - lockedSum);

  if (unlockedCategories.length === 0) {
    return categories.map(c => ({
      ...c,
      percentage: targetTotal > 0 ? Math.round((c.allocatedAmount / targetTotal) * 100) : 0,
    }));
  }

  const unlockedWeightSum = unlockedCategories.reduce((sum, c) => sum + c.allocatedAmount, 0) || 1;

  let allocatedRunningSum = 0;
  const updatedUnlocked = unlockedCategories.map((c, idx) => {
    let newAlloc: number;
    if (idx === unlockedCategories.length - 1) {
      // Rebalance remainder to ensure exact zero-sum match
      newAlloc = Math.max(0, availableForUnlocked - allocatedRunningSum);
    } else {
      const share = c.allocatedAmount / unlockedWeightSum;
      newAlloc = Math.round(share * availableForUnlocked);
      allocatedRunningSum += newAlloc;
    }

    const pct = targetTotal > 0 ? Math.round((newAlloc / targetTotal) * 100) : 0;

    return {
      ...c,
      allocatedAmount: newAlloc,
      percentage: pct,
      aiSavingHack: mode === 'slash15'
        ? 'AI 15% Reduction Applied: Shifted vendor booking to off-peak slots and replaced imported items with premium regional substitutes.'
        : c.aiSavingHack,
    };
  });

  const unlockedMap = new Map(updatedUnlocked.map(u => [u.id, u]));

  return categories.map(c => {
    if (c.locked) {
      const pct = targetTotal > 0 ? Math.round((c.allocatedAmount / targetTotal) * 100) : 0;
      return { ...c, percentage: pct };
    }
    return unlockedMap.get(c.id) || c;
  });
}

// ─── 2. Catering Plate Buffer Formula ────────────────────────────────────────

/**
 * Calculates recommended catering plates with a waste-prevention safety buffer.
 * Enforces the strict rule that recommended plates can NEVER drop below the guest count.
 *
 * @param guestCount - Number of expected guests (PAX)
 * @param bufferPercentage - Safety buffer percentage (default: 10%)
 * @param perPlateCost - Estimated cost per plate (default: 1500)
 * @returns CateringMatrix object with recommended plates, buffer, and tailored waste-reduction guidance
 *
 * @example
 * const catering = calculateCateringMatrix(350, 10, 850);
 * // catering.recommendedPlates === 385
 */
export function calculateCateringMatrix(
  guestCount: number,
  bufferPercentage: number = 10,
  perPlateCost: number = 1500
): CateringMatrix {
  const safeGuestCount = Math.max(0, Math.round(guestCount));
  const safeBuffer = Math.max(0, bufferPercentage);

  const bufferAddition = Math.ceil(safeGuestCount * (safeBuffer / 100));
  const recommendedPlates = safeGuestCount + bufferAddition;

  let wastePreventionTip = 'Employ live RSVP tracking and phased buffet tray deployment to minimize excess food waste.';
  if (safeGuestCount > 300) {
    wastePreventionTip = 'High-PAX Protocol: Deploy batch live cooking stations and partner with local food rescue NGO for audited leftover redistribution.';
  } else if (safeGuestCount > 100) {
    wastePreventionTip = 'Medium-PAX Strategy: Lock final headcount 48h prior with a rolling 8-10% buffer for sudden walk-ins.';
  }

  return {
    recommendedPlates: Math.max(safeGuestCount, recommendedPlates),
    bufferPercentage: safeBuffer,
    perPlateCostEstimate: perPlateCost,
    wastePreventionTip,
  };
}

// ─── 3. Vendor Financials & Negotiation Metrics ──────────────────────────────

export interface VendorProcurementMetrics {
  totalEstimated: number;
  totalNegotiated: number;
  totalSavings: number;
  bookedCount: number;
}

/**
 * Computes aggregate financial metrics across all contracted and pipeline vendors.
 *
 * @param vendors - Array of vendor items
 * @returns Object containing total estimated spend, negotiated commitment, unlocked savings, and booked count
 *
 * @example
 * const metrics = computeVendorProcurementMetrics(vendors);
 */
export function computeVendorProcurementMetrics(vendors: VendorItem[]): VendorProcurementMetrics {
  if (!vendors || !Array.isArray(vendors)) {
    return { totalEstimated: 0, totalNegotiated: 0, totalSavings: 0, bookedCount: 0 };
  }

  const totalEstimated = vendors.reduce((acc, v) => acc + (v.estimatedCost || 0), 0);
  const totalNegotiated = vendors.reduce(
    (acc, v) => acc + (v.negotiatedCost !== undefined ? v.negotiatedCost : v.estimatedCost || 0),
    0
  );
  const totalSavings = Math.max(0, totalEstimated - totalNegotiated);
  const bookedCount = vendors.filter(v => v.status === 'booked' || v.status === 'paid').length;

  return {
    totalEstimated,
    totalNegotiated,
    totalSavings,
    bookedCount,
  };
}

/**
 * Interpolates dynamic parameters into a vendor negotiation script template.
 *
 * @param template - The script template with [Placeholder] tokens
 * @param context - Key-value map of parameters (Date, GuestCount, Category, City, VendorType)
 * @returns Fully interpolated script string
 *
 * @example
 * interpolateNegotiationScript("Hello [Date] [Category]", { Date: "Oct 24", Category: "Wedding" })
 */
export function interpolateNegotiationScript(
  template: string,
  context: Record<string, string | number>
): string {
  if (!template) return '';

  let output = template;
  for (const [key, value] of Object.entries(context)) {
    const regex = new RegExp(`\\[${key}\\]`, 'gi');
    output = output.replace(regex, String(value));
  }
  return output;
}

// ─── 4. Timeline Readiness Calculation ───────────────────────────────────────

export interface TimelineReadiness {
  completedCount: number;
  totalCount: number;
  readinessPercentage: number;
  criticalPendingCount: number;
}

/**
 * Computes event readiness and critical-path completion percentage.
 *
 * @param timeline - Array of milestone timeline items
 * @returns Object with completion percentage and critical item counts
 */
export function calculateTimelineReadiness(timeline: TimelineItem[]): TimelineReadiness {
  if (!timeline || timeline.length === 0) {
    return { completedCount: 0, totalCount: 0, readinessPercentage: 0, criticalPendingCount: 0 };
  }

  const completedCount = timeline.filter(t => t.status === 'completed').length;
  const readinessPercentage = Math.round((completedCount / timeline.length) * 100);
  const criticalPendingCount = timeline.filter(
    t => t.criticality === 'Critical' && t.status !== 'completed'
  ).length;

  return {
    completedCount,
    totalCount: timeline.length,
    readinessPercentage,
    criticalPendingCount,
  };
}

// ─── 5. Crisis Shock Absorption Delta ───────────────────────────────────────

/**
 * Calculates the required emergency budget reallocation delta during operational crises.
 *
 * @param totalBudget - The total baseline event budget
 * @param severity - Incident threat level (CRITICAL: 5%, HIGH: 3.5%, MODERATE: 2%)
 * @returns Object containing the delta amount, percentage, and recommended donor category
 */
export function computeCrisisShockDelta(
  totalBudget: number,
  severity: CrisisSeverity
): { deltaAmount: number; percentage: number; recommendedSource: string } {
  const severityPercents: Record<CrisisSeverity, number> = {
    CRITICAL: 5.0,
    HIGH: 3.5,
    MODERATE: 2.0,
  };

  const percentage = severityPercents[severity] || 3.5;
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

// ─── 6. Natural-Language Mutation & Guest Cohort Sub-Engine ─────────────────
export * from './mutation-engine';
