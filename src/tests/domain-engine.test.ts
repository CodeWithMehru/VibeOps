import { describe, it, expect } from 'vitest';
import {
  rebalanceBudgetCategories,
  calculateCateringMatrix,
  computeVendorProcurementMetrics,
  interpolateNegotiationScript,
  calculateTimelineReadiness,
  computeCrisisShockDelta,
  calculateGuestCohortSplit,
  generatePersonalizedInvite,
  applyQuickCommandMutation,
} from '@/lib/domain-engine';
import { WEDDING_PRESET } from '@/lib/presets';
import { BudgetCategory, VendorItem, TimelineItem, EventSummary } from '@/lib/types';

describe('VibeOps Pure Domain Engine Tests', () => {
  const sampleCategories: BudgetCategory[] = [
    {
      id: 'cat-venue',
      category: 'Venue & Production',
      allocatedAmount: 1000000,
      percentage: 40,
      priority: 'High',
      locked: true,
      lineItems: ['Lawn', 'Stage'],
      aiSavingHack: 'Book off-peak weekdays for 15% discount',
    },
    {
      id: 'cat-catering',
      category: 'Catering & Beverages',
      allocatedAmount: 750000,
      percentage: 30,
      priority: 'High',
      locked: false,
      lineItems: ['Buffet', 'Drinks'],
      aiSavingHack: 'Opt for seasonal live counters',
    },
    {
      id: 'cat-decor',
      category: 'Decor & Floral',
      allocatedAmount: 500000,
      percentage: 20,
      priority: 'Medium',
      locked: false,
      lineItems: ['Flowers', 'Lighting'],
      aiSavingHack: 'Source regional foliage and architectural drapery',
    },
    {
      id: 'cat-photo',
      category: 'Photo & Video',
      allocatedAmount: 250000,
      percentage: 10,
      priority: 'Medium',
      locked: false,
      lineItems: ['Photography'],
      aiSavingHack: 'Single production crew for candid & drone film',
    },
  ];

  // ─── 1. Budget Rebalancing ────────────────────────────────────────────────
  describe('rebalanceBudgetCategories', () => {
    it('strictly preserves locked category allocations', () => {
      const targetTotal = 3000000;
      const rebalanced = rebalanceBudgetCategories(sampleCategories, targetTotal, 'rebalance');

      const lockedVenue = rebalanced.find(c => c.id === 'cat-venue');
      expect(lockedVenue?.allocatedAmount).toBe(1000000);
      expect(lockedVenue?.locked).toBe(true);

      const totalAllocated = rebalanced.reduce((sum, c) => sum + c.allocatedAmount, 0);
      expect(totalAllocated).toBe(targetTotal);
    });

    it('slashes total budget by exactly 15% in slash15 mode', () => {
      const originalTotal = 2500000;
      const targetAfterSlash = Math.round(originalTotal * 0.85); // 2125000
      const slashed = rebalanceBudgetCategories(sampleCategories, originalTotal, 'slash15');

      const totalAllocated = slashed.reduce((sum, c) => sum + c.allocatedAmount, 0);
      expect(totalAllocated).toBe(targetAfterSlash);

      // Locked venue amount should remain intact
      const lockedVenue = slashed.find(c => c.id === 'cat-venue');
      expect(lockedVenue?.allocatedAmount).toBe(1000000);
    });

    it('handles empty categories gracefully', () => {
      expect(rebalanceBudgetCategories([], 2500000)).toEqual([]);
    });
  });

  // ─── 2. Catering Matrix ───────────────────────────────────────────────────
  describe('calculateCateringMatrix', () => {
    it('accurately computes recommended plates, buffer percentage, and per plate cost', () => {
      const matrix = calculateCateringMatrix(300, 15, 2000);

      // 300 + ceil(300 * 0.15) = 300 + 45 = 345
      expect(matrix.recommendedPlates).toBe(345);
      expect(matrix.bufferPercentage).toBe(15);
      expect(matrix.perPlateCostEstimate).toBe(2000);
      expect(matrix.wastePreventionTip).toBeTruthy();
    });

    it('enforces bounds on buffer percentage and guest count', () => {
      const matrixZero = calculateCateringMatrix(0, 10, 1500);
      expect(matrixZero.recommendedPlates).toBe(0);
      expect(matrixZero.bufferPercentage).toBe(10);
    });
  });

  // ─── 3. Vendor Procurement Metrics ────────────────────────────────────────
  describe('computeVendorProcurementMetrics', () => {
    const testVendors: VendorItem[] = [
      {
        id: 'v1',
        vendorType: 'Catering',
        estimatedCost: 500000,
        negotiatedCost: 450000,
        bookingDeadline: '2 Weeks Before',
        status: 'booked',
        verificationChecklist: ['Licence verified', 'Tasting completed'],
        checkedItems: [true, true],
        redFlagWarning: 'None',
        scripts: { hinglishWhatsApp: '', formalEmail: '' },
      },
      {
        id: 'v2',
        vendorType: 'Decor',
        estimatedCost: 300000,
        negotiatedCost: 280000,
        bookingDeadline: '3 Weeks Before',
        status: 'negotiating',
        verificationChecklist: ['3D renders', 'Fire safety cert'],
        checkedItems: [true, false],
        redFlagWarning: 'Demands advance cash',
        scripts: { hinglishWhatsApp: '', formalEmail: '' },
      },
    ];

    it('calculates total spend, negotiated savings, and booked count', () => {
      const metrics = computeVendorProcurementMetrics(testVendors);

      expect(metrics.totalEstimated).toBe(800000);
      expect(metrics.totalNegotiated).toBe(730000);
      expect(metrics.totalSavings).toBe(70000);
      expect(metrics.bookedCount).toBe(1);
    });
  });

  // ─── 4. Negotiation Script Interpolator ───────────────────────────────────
  describe('interpolateNegotiationScript', () => {
    it('interpolates context variables into script template', () => {
      const template = 'Hi [VendorName], looking to book for [Date] in [City] for [GuestCount] pax with budget of [TargetBudget].';
      const result = interpolateNegotiationScript(template, {
        VendorName: 'Sanjay Decorators',
        Date: '24th Dec 2026',
        City: 'Jaipur',
        GuestCount: 350,
        TargetBudget: '₹4,50,000',
      });

      expect(result).toBe('Hi Sanjay Decorators, looking to book for 24th Dec 2026 in Jaipur for 350 pax with budget of ₹4,50,000.');
    });

    it('returns empty string on null or missing template', () => {
      expect(interpolateNegotiationScript('', {})).toBe('');
    });
  });

  // ─── 5. Timeline Readiness ────────────────────────────────────────────────
  describe('calculateTimelineReadiness', () => {
    const testTimeline: TimelineItem[] = [
      {
        id: 't1',
        phase: 'T-90 Days',
        timeSlot: '09:00 AM',
        title: 'Confirm Venue',
        owner: 'Venue Team',
        criticality: 'Critical',
        status: 'completed',
        dependencyNote: 'None',
      },
      {
        id: 't2',
        phase: 'T-60 Days',
        timeSlot: '11:00 AM',
        title: 'Hire Photographer',
        owner: 'Media Team',
        criticality: 'High',
        status: 'in-progress',
        dependencyNote: 'Portfolio reviewed',
      },
      {
        id: 't3',
        phase: 'Event Day',
        timeSlot: '04:00 PM',
        title: 'Sound Check',
        owner: 'AV Lead',
        criticality: 'Critical',
        status: 'pending',
        dependencyNote: 'Console power verification',
      },
    ];

    it('calculates completion rate, critical path pending, and milestone counts', () => {
      const readiness = calculateTimelineReadiness(testTimeline);

      expect(readiness.totalCount).toBe(3);
      expect(readiness.completedCount).toBe(1);
      expect(readiness.readinessPercentage).toBe(33);
      expect(readiness.criticalPendingCount).toBe(1); // t3 is Critical and pending
    });
  });

  // ─── 6. Crisis Shock Delta ────────────────────────────────────────────────
  describe('computeCrisisShockDelta', () => {
    it('calculates correct shock percentages and recommended emergency reserves', () => {
      const shockCritical = computeCrisisShockDelta(2000000, 'CRITICAL');
      expect(shockCritical.percentage).toBe(5.0);
      expect(shockCritical.deltaAmount).toBe(100000); // 5% of 2M
      expect(shockCritical.recommendedSource).toBeTruthy();

      const shockModerate = computeCrisisShockDelta(2000000, 'MODERATE');
      expect(shockModerate.percentage).toBe(2.0);
      expect(shockModerate.deltaAmount).toBe(40000); // 2% of 2M
    });
  });

  // ─── 7. Guest Cohort Split ────────────────────────────────────────────────
  describe('calculateGuestCohortSplit', () => {
    it('computes VIP, Core, and Buffer guest tiers totaling the original headcount', () => {
      const split = calculateGuestCohortSplit(300);

      expect(split.vipCount + split.coreCount + split.bufferCount).toBe(300);
      expect(split.vipCount).toBe(60); // 20%
      expect(split.coreCount).toBe(180); // 60%
      expect(split.bufferCount).toBe(60); // 20%
    });

    it('calculates accurate dietary distribution summing to total guest count', () => {
      const split = calculateGuestCohortSplit(250);
      const dietarySum = split.dietaryStandardVeg + split.dietaryNonVegOrSpecial + split.dietaryKidsOrAllergySafe;
      expect(dietarySum).toBe(250);
    });
  });

  // ─── 8. Personalized Invite Generator ─────────────────────────────────────
  describe('generatePersonalizedInvite', () => {
    const summary: EventSummary = {
      title: 'DevNexus Global Hackathon',
      category: 'Community Event',
      tagline: 'Code the future with AI',
      city: 'Bangalore',
      guestCount: 500,
      totalBudget: 1500000,
      currency: 'INR',
      vibePalette: ['Cyberpunk Neon', 'Minimalist Tech'],
      cateringMatrix: {
        recommendedPlates: 550,
        bufferPercentage: 10,
        perPlateCostEstimate: 1200,
        wastePreventionTip: 'Phase service counters',
      },
    };

    it('generates WhatsApp formatted invite with emojis and bold tags', () => {
      const invite = generatePersonalizedInvite(summary, 'whatsapp');
      expect(invite).toContain('*DevNexus Global Hackathon*');
      expect(invite).toContain('Bangalore');
      expect(invite).toContain('RSVP');
    });

    it('generates formal VIP invitation suitable for guests of honor', () => {
      const formal = generatePersonalizedInvite(summary, 'formal');
      expect(formal).toContain('CORDIAL INVITATION');
      expect(formal).toContain('DEVNEXUS GLOBAL HACKATHON');
      expect(formal).toContain('Dress Code');
    });

    it('generates community registration pitch with event details', () => {
      const pitch = generatePersonalizedInvite(summary, 'community');
      expect(pitch).toContain('DevNexus Global Hackathon');
      expect(pitch).toContain('Bangalore');
    });
  });

  // ─── 9. Deterministic AI Quick Command Mutation ───────────────────────────
  describe('applyQuickCommandMutation', () => {
    const baseBlueprint = WEDDING_PRESET;

    it('reduces total budget when instructed via natural language', () => {
      const command = 'Cut total budget by 10%';
      const result = applyQuickCommandMutation(baseBlueprint, command);

      expect(result.appliedSummary).toContain('Slashed total budget by 10%');
      const expectedTotal = Math.round(baseBlueprint.eventSummary.totalBudget * 0.9);
      expect(result.updatedBlueprint.eventSummary.totalBudget).toBe(expectedTotal);
    });

    it('adds a new vendor item when requested in command', () => {
      const command = 'Add Drone Photography Vendor';
      const result = applyQuickCommandMutation(baseBlueprint, command);

      expect(result.appliedSummary).toContain('Cinematic FPV Drone');
      const vendorNames = result.updatedBlueprint.vendorChecklist.map(v => v.vendorType);
      expect(vendorNames.some(name => name.toLowerCase().includes('drone'))).toBe(true);
    });

    it('shifts timeline milestones forward by minutes', () => {
      const command = 'Shift morning timeline milestones by +30 minutes';
      const result = applyQuickCommandMutation(baseBlueprint, command);

      expect(result.appliedSummary).toContain('Shifted Event Day timeline milestones');
    });

    it('increases VIP guest buffer when instructed', () => {
      const initialGuests = baseBlueprint.eventSummary.guestCount;
      const command = 'Add VIP Guest Buffer +25 PAX';
      const result = applyQuickCommandMutation(baseBlueprint, command);

      expect(result.updatedBlueprint.eventSummary.guestCount).toBe(initialGuests + 25);
      expect(result.appliedSummary).toContain('Increased event headcount by +25 PAX');
    });
  });
});
