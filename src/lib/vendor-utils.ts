import { VendorItem, VendorStatus } from './types';

export interface VendorFinancials {
  totalEstimated: number;
  totalNegotiated: number;
  totalSavings: number;
  bookedCount: number;
}

/**
 * Computes vendor financial metrics: estimated spend, negotiated target, and unlocked savings.
 */
export function calculateVendorFinancials(vendors: VendorItem[]): VendorFinancials {
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
 * Toggles a verification checklist item for a specific vendor.
 */
export function toggleVendorChecklist(
  vendors: VendorItem[],
  vendorId: string,
  itemIndex: number
): VendorItem[] {
  if (!vendors || !Array.isArray(vendors)) return [];

  return vendors.map(vendor => {
    if (vendor.id !== vendorId) return vendor;

    const checklistLength = vendor.verificationChecklist ? vendor.verificationChecklist.length : 4;
    const currentChecked = vendor.checkedItems
      ? [...vendor.checkedItems]
      : new Array(checklistLength).fill(false);

    // Expand array if needed
    while (currentChecked.length < checklistLength) {
      currentChecked.push(false);
    }

    currentChecked[itemIndex] = !currentChecked[itemIndex];

    return {
      ...vendor,
      checkedItems: currentChecked,
    };
  });
}

/**
 * Replaces dynamic placeholders in vendor negotiation scripts.
 * Supports: [Date], [GuestCount], [Category], [City], [Budget], [VendorType].
 */
export function replaceScriptPlaceholders(
  template: string,
  replacements: Record<string, string | number>
): string {
  if (!template) return '';

  let output = template;

  for (const [key, value] of Object.entries(replacements)) {
    const regex = new RegExp(`\\[${key}\\]`, 'gi');
    output = output.replace(regex, String(value));
  }

  return output;
}

/**
 * Formats a vendor negotiation Hinglish message with event-specific parameters.
 */
export function generateHinglishScript(
  vendorType: string,
  context: {
    date: string;
    guestCount: number;
    category: string;
    city: string;
    targetRate?: number;
    currency?: string;
  }
): string {
  const sym = context.currency === 'USD' ? '$' : '₹';
  const rateClause = context.targetRate
    ? ` Hamara budget around ${sym}${context.targetRate.toLocaleString()} hai.`
    : '';

  const template = `Namaste Bhai, hum [Date] ko [City] mein [GuestCount] guests ka [Category] organize kar rahe hain. Humein [VendorType] ke liye comprehensive quotation chahiye.${rateClause} Service staff, setup aur cleanup included hona chahiye. Competitive rate doge toh token advance lock kar denge. Portfolio aur best rates share kar do please.`;

  return replaceScriptPlaceholders(template, {
    Date: context.date,
    City: context.city,
    GuestCount: context.guestCount,
    Category: context.category,
    VendorType: vendorType,
  });
}
