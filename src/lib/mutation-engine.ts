/**
 * ─── VibeOps Natural-Language Mutation & Guest Cohort Engine ─────────────────
 * Handles deterministic state mutations, natural-language directive parsing,
 * guest cohort segmentation, and dynamic multi-channel invite generation.
 */

import {
  BudgetCategory,
  EventBlueprint,
  EventSummary,
  EventWizardInput,
  VendorItem,
} from './types';
import {
  rebalanceBudgetCategories,
  calculateCateringMatrix,
} from './domain-engine';
import { PRESET_MAP, WEDDING_PRESET } from './presets';

// ─── 1. Guest Cohort & Dietary Matrix Split ─────────────────────────────────

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

// ─── 2. Personalized Smart Invite & RSVP Generator ──────────────────────────

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

// ─── 3. Deterministic Natural-Language Command Mutator ───────────────────────

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

/**
 * Dynamically generates a scaled event blueprint matching user input parameters.
 * Used as an autonomous, high-fidelity fallback generator.
 *
 * @param input - Wizard configuration inputs
 * @returns Fully populated EventBlueprint
 */
export function createScaledBlueprint(input: EventWizardInput): EventBlueprint {
  const matchedPresetKey =
    input.eventType === 'Birthday'
      ? 'birthday'
      : input.eventType === 'Community Event'
        ? 'community'
        : 'wedding';
  const basePreset = PRESET_MAP[matchedPresetKey] || WEDDING_PRESET;

  const scaleFactor = input.totalBudget / (basePreset.eventSummary.totalBudget || 1);
  const scaledCategories: BudgetCategory[] = basePreset.budgetBreakdown.map(cat => ({
    ...cat,
    allocatedAmount: Math.round(cat.allocatedAmount * scaleFactor),
  }));

  return {
    eventSummary: {
      title: input.title || `${input.city} ${input.eventType} Production`,
      category: input.eventType,
      tagline: `Engineered for ${input.guestCount} guests in ${input.city}`,
      city: input.city,
      guestCount: input.guestCount,
      totalBudget: input.totalBudget,
      currency: input.currency,
      vibePalette:
        input.vibeTags.length > 0
          ? ['#F59E0B', '#10B981', '#38BDF8', '#8B5CF6']
          : basePreset.eventSummary.vibePalette,
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
}

