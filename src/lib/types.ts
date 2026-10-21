// ─── VibeOps Core Type Definitions ───────────────────────────────────────────

export type EventCategory = 'Wedding' | 'Birthday' | 'Community Event';

export type BudgetPriority = 'High' | 'Medium' | 'Low';

export type TimelineCriticality = 'Critical' | 'High' | 'Normal';

export type TimelineStatus = 'pending' | 'in-progress' | 'completed';

export type VendorStatus = 'shortlisting' | 'negotiating' | 'booked' | 'paid';

export type CrisisSeverity = 'CRITICAL' | 'HIGH' | 'MODERATE';

// ─── Catering Matrix ─────────────────────────────────────────────────────────

export interface CateringMatrix {
  recommendedPlates: number;
  bufferPercentage: number;
  perPlateCostEstimate: number;
  wastePreventionTip: string;
}

// ─── Event Summary ───────────────────────────────────────────────────────────

export interface EventSummary {
  title: string;
  category: EventCategory;
  tagline: string;
  city: string;
  guestCount: number;
  totalBudget: number;
  currency: string;
  vibePalette: string[];
  cateringMatrix: CateringMatrix;
}

// ─── Budget Category ─────────────────────────────────────────────────────────

export interface BudgetCategory {
  id: string;
  category: string;
  allocatedAmount: number;
  percentage: number;
  priority: BudgetPriority;
  locked: boolean;
  lineItems: string[];
  aiSavingHack: string;
}

// ─── Timeline Item ───────────────────────────────────────────────────────────

export interface TimelineItem {
  id: string;
  phase: string;
  timeSlot: string;
  title: string;
  owner: string;
  criticality: TimelineCriticality;
  status: TimelineStatus;
  dependencyNote: string;
}

// ─── Vendor Scripts ──────────────────────────────────────────────────────────

export interface VendorScripts {
  hinglishWhatsApp: string;
  formalEmail: string;
}

// ─── Vendor Item ─────────────────────────────────────────────────────────────

export interface VendorItem {
  id: string;
  vendorType: string;
  estimatedCost: number;
  negotiatedCost?: number;
  bookingDeadline: string;
  status: VendorStatus;
  verificationChecklist: string[];
  checkedItems?: boolean[];
  redFlagWarning: string;
  scripts: VendorScripts;
}

// ─── Personalized Idea ───────────────────────────────────────────────────────

export interface PersonalizedIdea {
  id: string;
  title: string;
  category: string;
  estimatedCost: number;
  impactScore: string;
  executionBlueprint: string;
  shortlisted?: boolean;
}

// ─── Full Event Blueprint ────────────────────────────────────────────────────

export interface EventBlueprint {
  eventSummary: EventSummary;
  budgetBreakdown: BudgetCategory[];
  timeline: TimelineItem[];
  vendorChecklist: VendorItem[];
  personalizedIdeas: PersonalizedIdea[];
}

// ─── Crisis Response ─────────────────────────────────────────────────────────

export interface TimelineAdjustment {
  originalTask: string;
  newPlan: string;
}

export interface CrisisResponse {
  crisisTitle: string;
  severity: CrisisSeverity;
  immediateActions: string[];
  budgetImpactDelta: number;
  reallocatedFrom: string;
  timelineAdjustments: TimelineAdjustment[];
  emergencyAnnouncementScript: string;
}

// ─── Groq Response Wrapper ──────────────────────────────────────────────────

export interface GroqResult<T> {
  data: T;
  modelUsed: string;
  latencyMs: number;
}

// ─── Event Wizard Input ──────────────────────────────────────────────────────

export interface EventWizardInput {
  eventType: EventCategory;
  title: string;
  city: string;
  guestCount: number;
  totalBudget: number;
  currency: string;
  eventDate: string;
  vibeTags: string[];
  dietaryNotes: string;
}

// ─── App State ───────────────────────────────────────────────────────────────

export interface AppState {
  blueprint: EventBlueprint | null;
  activeTab: number;
  isLoading: boolean;
  loadingMessage: string;
  modelUsed: string;
  latencyMs: number;
  crisisResponse: CrisisResponse | null;
  wizardOpen: boolean;
}
