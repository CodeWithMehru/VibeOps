import { BudgetCategory } from './types';
import {
  calculateCateringMatrix,
  rebalanceBudgetCategories,
} from './domain-engine';

export const calculateCateringBuffer = calculateCateringMatrix;
export const rebalanceBudget = rebalanceBudgetCategories;

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
    isBalanced: Math.abs(unallocated) < 10,
  };
}
