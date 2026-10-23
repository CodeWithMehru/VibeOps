import { BudgetCategory, CateringMatrix } from './types';

/**
 * Calculates catering plate buffer and cost estimation,
 * strictly guaranteeing that the recommended plates never drop below the guest count.
 */
export function calculateCateringBuffer(
  guestCount: number,
  bufferPercentage: number = 10,
  perPlateCostEstimate: number = 1500
): CateringMatrix {
  const safeGuestCount = Math.max(0, Math.round(guestCount));
  const safeBuffer = Math.max(0, bufferPercentage);

  // Recommended plates formula with ceiling: never drops below guest count
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
    perPlateCostEstimate,
    wastePreventionTip,
  };
}

/**
 * Rebalances unlocked budget categories while strictly preserving locked categories.
 * Enforces zero-sum budget integrity (total allocated = target budget).
 */
export function rebalanceBudget(
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
    // All categories are locked — cannot adjust allocations
    return categories.map(c => ({
      ...c,
      percentage: targetTotal > 0 ? Math.round((c.allocatedAmount / targetTotal) * 100) : 0,
    }));
  }

  const unlockedWeightSum = unlockedCategories.reduce((sum, c) => sum + c.allocatedAmount, 0) || 1;

  let allocatedRunningSum = 0;
  const updatedUnlocked = unlockedCategories.map((c, idx) => {
    // If last unlocked item, assign remainder to ensure exact zero-sum match
    let newAlloc: number;
    if (idx === unlockedCategories.length - 1) {
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
        ? `AI 15% Reduction Applied: Shifted vendor booking to off-peak slots and replaced imported items with premium regional substitutes.`
        : c.aiSavingHack,
    };
  });

  // Reassemble keeping original category order
  const unlockedMap = new Map(updatedUnlocked.map(u => [u.id, u]));

  return categories.map(c => {
    if (c.locked) {
      const pct = targetTotal > 0 ? Math.round((c.allocatedAmount / targetTotal) * 100) : 0;
      return { ...c, percentage: pct };
    }
    return unlockedMap.get(c.id) || c;
  });
}

/**
 * Computes budget allocation totals and variance.
 */
export function calculateBudgetTotals(categories: BudgetCategory[], totalBudget: number) {
  const totalAllocated = categories.reduce((sum, c) => sum + c.allocatedAmount, 0);
  const unallocated = totalBudget - totalAllocated;
  const percentageTotal = categories.reduce((sum, c) => sum + c.percentage, 0);

  return {
    totalAllocated,
    unallocated,
    percentageTotal,
    isBalanced: Math.abs(unallocated) < 10, // Tolerance for rounding
  };
}
