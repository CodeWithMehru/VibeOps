/**
 * ─── VibeOps Pure Domain Engine ──────────────────────────────────────────────
 * High-performance, deterministic event production logic and mathematical models.
 * Zero external dependencies. Strictly typed and fully documented.
 */

import {
  BudgetCategory,
  CateringMatrix,
  CrisisResponse,
  CrisisSeverity,
  EventBlueprint,
  EventSummary,
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

// ─── 6. Guest Cohort & Dietary Matrix Split ─────────────────────────────────

export interface GuestCohortSplit {
  vipCount: number;
  coreCount: number;
  bufferCount: number;
  dietaryStandardVeg: number;
  dietaryNonVegOrSpecial: number;
  dietaryKidsOrAllergySafe: number;
}

/**
 * Divides total guest headcount into structured tiers and dietary allocations.
 *
 * @param guestCount - Total expected attendees (PAX)
 * @returns Guest cohort and dietary distribution breakdown
 *
 * @example
 * const cohorts = calculateGuestCohortSplit(350);
 */
export function calculateGuestCohortSplit(guestCount: number): GuestCohortSplit {
  const safeCount = Math.max(0, Math.round(guestCount));

  // Tiers: VIP/Speakers/Family (20%), Core (60%), Buffer (20%)
  const vipCount = Math.round(safeCount * 0.20);
  const bufferCount = Math.round(safeCount * 0.20);
  const coreCount = Math.max(0, safeCount - vipCount - bufferCount);

  // Dietary Split: Standard/Veg (60%), Non-Veg/Regional (30%), Kids/Allergy-Safe (10%)
  const dietaryStandardVeg = Math.round(safeCount * 0.60);
  const dietaryNonVegOrSpecial = Math.round(safeCount * 0.30);
  const dietaryKidsOrAllergySafe = Math.max(0, safeCount - dietaryStandardVeg - dietaryNonVegOrSpecial);

  return {
    vipCount,
    coreCount,
    bufferCount,
    dietaryStandardVeg,
    dietaryNonVegOrSpecial,
    dietaryKidsOrAllergySafe,
  };
}

// ─── 7. Personalized Smart Invite & RSVP Generator ──────────────────────────

/**
 * Generates tailored copy for WhatsApp, formal VIP invitations, or community announcements.
 *
 * @param eventSummary - The event context summary
 * @param inviteType - 'whatsapp' | 'formal' | 'community'
 * @returns Ready-to-copy invitation message
 */
export function generatePersonalizedInvite(
  eventSummary: EventSummary,
  inviteType: 'whatsapp' | 'formal' | 'community'
): string {
  const { title, category, city, guestCount } = eventSummary;

  switch (inviteType) {
    case 'whatsapp':
      return `🎉 You're Warmly Invited! ✨\n\nJoin us for *${title}* in the heart of ${city}!\n\nWe have planned an unforgettable celebration tailored for ${guestCount} cherished guests. Expect soulful vibes, incredible dining, and memorable moments.\n\n📍 Location: ${city}\n📅 Date: Scheduled Event Day\n\nPlease confirm your RSVP by replying to this message so we can reserve your personalized hospitality badge and dietary preferences! 🙏`;

    case 'formal':
      return `CORDIAL INVITATION\n\nWe have the distinct honor of requesting your esteemed presence at the:\n\n${title.toUpperCase()}\n[Category: ${category} | Host City: ${city}]\n\nA curated banquet and bespoke reception have been arranged for our honored guests and patrons.\n\nFormal Dress Code: Festive / Elegant\nRSVP: Kindly register your dietary preferences and party size 72 hours prior.\n\nWarmest regards,\nThe Host Committee & Production Team`;

    case 'community':
      return `🚀 Calling all innovators, creators & community builders!\n\nRegistrations are now LIVE for *${title}* in ${city}!\n\n🔹 Capacity: Strictly capped at ${guestCount} attendees\n🔹 Highlights: Keynote sessions, interactive workshops, and high-energy networking\n🔹 Refreshments: Full catering & beverage passes included\n\nSecure your pass today before community capacity is reached!`;
  }
}

// ─── 8. Deterministic Natural-Language Command Mutator ───────────────────────

export interface CommandMutationResult {
  updatedBlueprint: EventBlueprint;
  appliedSummary: string;
}

/**
 * Deterministically applies operational natural-language commands to the event blueprint.
 * Functions 100% offline without requiring external API calls.
 *
 * @param blueprint - The active event blueprint
 * @param commandText - Natural language instruction from the command bar
 * @returns Updated blueprint and an audit summary of the mutation performed
 *
 * @example
 * applyQuickCommandMutation(blueprint, "Cut Total Spend by 10%")
 */
export function applyQuickCommandMutation(
  blueprint: EventBlueprint,
  commandText: string
): CommandMutationResult {
  if (!commandText || !commandText.trim()) {
    return { updatedBlueprint: blueprint, appliedSummary: 'No command specified.' };
  }

  const text = commandText.toLowerCase().trim();
  const currentBlueprint = JSON.parse(JSON.stringify(blueprint)) as EventBlueprint;

  // Case 1: Cut / Slash Total Spend by percentage
  const cutMatch = text.match(/(?:cut|reduce|slash|drop)\s*(?:total)?\s*(?:spend|budget)?\s*by\s*(\d+)%/i);
  if (cutMatch || text.includes('cut total spend by 10%')) {
    const percent = cutMatch ? parseInt(cutMatch[1], 10) : 10;
    const factor = (100 - percent) / 100;
    const newTotal = Math.round(currentBlueprint.eventSummary.totalBudget * factor);
    currentBlueprint.eventSummary.totalBudget = newTotal;
    currentBlueprint.budgetBreakdown = rebalanceBudgetCategories(
      currentBlueprint.budgetBreakdown,
      newTotal,
      'rebalance'
    );
    return {
      updatedBlueprint: currentBlueprint,
      appliedSummary: `Applied: Slashed total budget by ${percent}% to ${currentBlueprint.eventSummary.currency} ${newTotal.toLocaleString()} and rebalanced categories.`,
    };
  }

  // Case 2: Add Drone Photography Vendor
  if (text.includes('drone') || text.includes('photo') || text.includes('photographer')) {
    const existing = currentBlueprint.vendorChecklist.find(v => v.id === 'v-drone-custom');
    if (!existing) {
      const droneVendor: VendorItem = {
        id: 'v-drone-custom',
        vendorType: 'Cinematic FPV Drone & 4K Videography',
        estimatedCost: Math.round(currentBlueprint.eventSummary.totalBudget * 0.03) || 45000,
        negotiatedCost: Math.round(currentBlueprint.eventSummary.totalBudget * 0.025) || 38000,
        bookingDeadline: '3 Weeks Before',
        status: 'shortlisting',
        verificationChecklist: [
          'DGCA certified drone pilot license verified',
          'Dual 4K camera bodies with redundant SD card recording',
          '48-hour social media highlight reel delivery SLA',
          'Third-party equipment liability insurance confirmed',
        ],
        checkedItems: [false, false, false, false],
        redFlagWarning: 'Demands full advance without offering certified raw footage backups.',
        scripts: {
          hinglishWhatsApp: `Hi Drone Team, hum ${currentBlueprint.eventSummary.city} mein ${currentBlueprint.eventSummary.guestCount} PAX ka ${currentBlueprint.eventSummary.category} shoot karna chahte hain. Best FPV & 4K package rate share karein please.`,
          formalEmail: `Dear Drone Production Team,\n\nWe are soliciting competitive quotations for high-resolution aerial cinematography for our upcoming event in ${currentBlueprint.eventSummary.city}.\n\nBest regards,\nProduction Team`,
        },
      };
      currentBlueprint.vendorChecklist = [droneVendor, ...currentBlueprint.vendorChecklist];
      return {
        updatedBlueprint: currentBlueprint,
        appliedSummary: `Applied: Added "Cinematic FPV Drone & 4K Videography" to Vendor War-Room with custom checklist and Hinglish scripts.`,
      };
    }
  }

  // Case 3: Add VIP Guest Buffer PAX
  const paxMatch = text.match(/(?:add|increase|extra)\s*(?:vip)?\s*(?:guest)?\s*(?:buffer)?\s*\+?(\d+)\s*(?:pax|guests)?/i);
  if (paxMatch || text.includes('add vip guest buffer +25 pax')) {
    const extraPax = paxMatch ? parseInt(paxMatch[1], 10) : 25;
    const newGuestCount = currentBlueprint.eventSummary.guestCount + extraPax;
    currentBlueprint.eventSummary.guestCount = newGuestCount;
    currentBlueprint.eventSummary.cateringMatrix = calculateCateringMatrix(
      newGuestCount,
      currentBlueprint.eventSummary.cateringMatrix.bufferPercentage,
      currentBlueprint.eventSummary.cateringMatrix.perPlateCostEstimate
    );
    return {
      updatedBlueprint: currentBlueprint,
      appliedSummary: `Applied: Increased event headcount by +${extraPax} PAX (New total: ${newGuestCount} PAX) and recalculated catering plate buffer.`,
    };
  }

  // Case 4: Shift timeline milestones
  const shiftMatch = text.match(/shift\s*(?:all)?\s*(?:morning)?\s*timeline\s*(?:milestones)?\s*(?:by)?\s*\+?(\d+)\s*min/i);
  if (shiftMatch || text.includes('shift all morning timeline milestones')) {
    const shiftMinutes = shiftMatch ? parseInt(shiftMatch[1], 10) : 30;
    currentBlueprint.timeline = currentBlueprint.timeline.map(item => {
      if (item.phase.toLowerCase().includes('morning') || item.phase.toLowerCase().includes('event day')) {
        return {
          ...item,
          timeSlot: `${item.timeSlot} (+${shiftMinutes}m buffer)`,
          dependencyNote: `${item.dependencyNote || ''} (Schedule shifted +${shiftMinutes}m for guest arrival buffer)`.trim(),
        };
      }
      return item;
    });
    return {
      updatedBlueprint: currentBlueprint,
      appliedSummary: `Applied: Shifted Event Day timeline milestones by +${shiftMinutes} minutes with arrival buffers.`,
    };
  }

  // Default fallback: Tag mutation into personalized ideas
  const customIdea = {
    id: `idea-custom-cmd-${Date.now()}`,
    title: `Custom Operational Directive: ${commandText.slice(0, 40)}`,
    category: 'Operational Command',
    estimatedCost: 5000,
    impactScore: '9.1/10',
    executionBlueprint: `Step 1: Execute planner directive: "${commandText}". Step 2: Brief affected department heads. Step 3: Monitor budget and timeline adjustments.`,
    shortlisted: true,
  };
  currentBlueprint.personalizedIdeas = [customIdea, ...currentBlueprint.personalizedIdeas];

  return {
    updatedBlueprint: currentBlueprint,
    appliedSummary: `Applied: Injected operational directive "${commandText}" into Event Vibe Lab.`,
  };
}
