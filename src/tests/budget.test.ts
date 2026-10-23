import { describe, it, expect } from 'vitest';
import {
  calculateCateringBuffer,
  rebalanceBudget,
  calculateBudgetTotals,
} from '@/lib/budget-utils';
import { BudgetCategory } from '@/lib/types';

describe('Budget & Catering Calculations', () => {
  const sampleCategories: BudgetCategory[] = [
    {
      id: 'cat-venue',
      category: 'Venue & Production',
      allocatedAmount: 800000,
      percentage: 32,
      priority: 'High',
      locked: true, // Locked category
      lineItems: ['Heritage Lawn Rental', 'Power Backup'],
      aiSavingHack: 'Book off-peak days for discount',
    },
    {
      id: 'cat-catering',
      category: 'Catering & Beverages',
      allocatedAmount: 750000,
      percentage: 30,
      priority: 'High',
      locked: false,
      lineItems: ['350 PAX Buffet', 'Live Stations'],
      aiSavingHack: 'Eliminate 1 starter to save ₹40k',
    },
    {
      id: 'cat-decor',
      category: 'Decor & Floral',
      allocatedAmount: 400000,
      percentage: 16,
      priority: 'Medium',
      locked: false,
      lineItems: ['Stage Backdrop', 'Entrance Aisle'],
      aiSavingHack: 'Use local seasonal flowers',
    },
    {
      id: 'cat-photo',
      category: 'Photo & Video',
      allocatedAmount: 300000,
      percentage: 12,
      priority: 'Medium',
      locked: false,
      lineItems: ['Candid Photography', 'Drone Cinema'],
      aiSavingHack: 'Hire single team for both photo and video',
    },
    {
      id: 'cat-entertainment',
      category: 'Entertainment & DJ',
      allocatedAmount: 250000,
      percentage: 10,
      priority: 'Low',
      locked: false,
      lineItems: ['Live Band', 'DJ Console'],
      aiSavingHack: 'Direct booking without agency markup',
    },
  ];

  const totalBudget = 2500000;

  describe('Catering Plate Buffer Calculation Formula', () => {
    it('ensures recommended plates never drop below guest count with positive buffer', () => {
      const guestCount = 350;
      const bufferPercentage = 10;
      const result = calculateCateringBuffer(guestCount, bufferPercentage, 1800);

      expect(result.recommendedPlates).toBeGreaterThanOrEqual(guestCount);
      expect(result.recommendedPlates).toBe(385); // 350 + ceil(35) = 385
      expect(result.bufferPercentage).toBe(10);
      expect(result.perPlateCostEstimate).toBe(1800);
    });

    it('ensures recommended plates equals guest count when buffer is 0%', () => {
      const guestCount = 120;
      const result = calculateCateringBuffer(guestCount, 0, 1200);

      expect(result.recommendedPlates).toBe(guestCount);
      expect(result.recommendedPlates).toBe(120);
    });

    it('handles small guest counts with ceiling rounding', () => {
      const guestCount = 45;
      const result = calculateCateringBuffer(guestCount, 15);

      // 45 * 0.15 = 6.75 -> ceil is 7 -> 45 + 7 = 52
      expect(result.recommendedPlates).toBe(52);
      expect(result.recommendedPlates).toBeGreaterThan(guestCount);
    });

    it('handles edge case of 0 guests safely without NaN or negative numbers', () => {
      const result = calculateCateringBuffer(0, 10);
      expect(result.recommendedPlates).toBe(0);
      expect(result.recommendedPlates).toBeGreaterThanOrEqual(0);
    });

    it('provides tailored waste prevention tips based on PAX scale', () => {
      const largeEvent = calculateCateringBuffer(500, 10);
      expect(largeEvent.wastePreventionTip).toContain('NGO');

      const mediumEvent = calculateCateringBuffer(150, 10);
      expect(mediumEvent.wastePreventionTip).toContain('Medium-PAX');

      const boutiqueEvent = calculateCateringBuffer(50, 10);
      expect(boutiqueEvent.wastePreventionTip).toContain('RSVP');
    });
  });

  describe('Zero-Sum Budget Rebalance Logic', () => {
    it('maintains total allocated amount equal to totalBudget (zero-sum invariant)', () => {
      const rebalanced = rebalanceBudget(sampleCategories, totalBudget, 'rebalance');
      const { totalAllocated, unallocated } = calculateBudgetTotals(rebalanced, totalBudget);

      expect(totalAllocated).toBe(totalBudget);
      expect(unallocated).toBe(0);
    });

    it('correctly calculates 15% budget slash in slash15 mode', () => {
      const targetSlashBudget = Math.round(totalBudget * 0.85); // 21,25,000
      const rebalanced = rebalanceBudget(sampleCategories, totalBudget, 'slash15');
      const totalAllocated = rebalanced.reduce((s, c) => s + c.allocatedAmount, 0);

      expect(totalAllocated).toBe(targetSlashBudget);
      // Unlocked categories should update aiSavingHack
      const unlockedItem = rebalanced.find(c => !c.locked);
      expect(unlockedItem?.aiSavingHack).toContain('AI 15% Reduction Applied');
    });

    it('percentages sum to approximately 100%', () => {
      const rebalanced = rebalanceBudget(sampleCategories, totalBudget, 'rebalance');
      const percentageSum = rebalanced.reduce((s, c) => s + c.percentage, 0);

      expect(percentageSum).toBeGreaterThanOrEqual(98);
      expect(percentageSum).toBeLessThanOrEqual(102);
    });
  });

  describe('Locked Category Preservation', () => {
    it('strictly preserves the allocated amount and locked state of locked categories', () => {
      const lockedBefore = sampleCategories.find(c => c.locked)!;
      const rebalanced = rebalanceBudget(sampleCategories, totalBudget, 'rebalance');
      const lockedAfter = rebalanced.find(c => c.id === lockedBefore.id)!;

      expect(lockedAfter.locked).toBe(true);
      expect(lockedAfter.allocatedAmount).toBe(lockedBefore.allocatedAmount);
      expect(lockedAfter.allocatedAmount).toBe(800000);
    });

    it('preserves multiple locked categories simultaneously', () => {
      const multiLocked: BudgetCategory[] = sampleCategories.map((c, i) =>
        i < 2 ? { ...c, locked: true } : { ...c, locked: false }
      );

      const rebalanced = rebalanceBudget(multiLocked, totalBudget, 'rebalance');
      const firstLocked = rebalanced.find(c => c.id === 'cat-venue')!;
      const secondLocked = rebalanced.find(c => c.id === 'cat-catering')!;

      expect(firstLocked.allocatedAmount).toBe(800000);
      expect(secondLocked.allocatedAmount).toBe(750000);

      const totalAllocated = rebalanced.reduce((s, c) => s + c.allocatedAmount, 0);
      expect(totalAllocated).toBe(totalBudget);
    });

    it('handles edge case where all categories are locked gracefully', () => {
      const allLocked = sampleCategories.map(c => ({ ...c, locked: true }));
      const rebalanced = rebalanceBudget(allLocked, totalBudget, 'rebalance');

      allLocked.forEach(orig => {
        const found = rebalanced.find(c => c.id === orig.id)!;
        expect(found.allocatedAmount).toBe(orig.allocatedAmount);
        expect(found.locked).toBe(true);
      });
    });
  });
});
