import { describe, it, expect } from 'vitest';
import {
  calculateVendorFinancials,
  toggleVendorChecklist,
  replaceScriptPlaceholders,
  generateHinglishScript,
} from '@/lib/vendor-utils';
import { VendorItem } from '@/lib/types';

describe('Vendor War-Room & Negotiation Logic', () => {
  const sampleVendors: VendorItem[] = [
    {
      id: 'v-catering',
      vendorType: 'Royal Wazwan & Modern Multi-Cuisine Catering',
      estimatedCost: 750000,
      negotiatedCost: 680000, // ₹70k saved
      bookingDeadline: '3 Weeks Before',
      status: 'negotiating',
      verificationChecklist: [
        'FSSAI food safety certificate verified',
        'Tasting session completed & approved',
        'Staff uniform & grooming standard agreed',
        'Surplus food donation plan in place',
      ],
      checkedItems: [true, true, false, false],
      redFlagWarning: 'Reluctant to commit to strict refrigeration backup on warm days.',
      scripts: {
        hinglishWhatsApp: 'Hi Wazwan team, [Date] ko Srinagar mein 350 guests ka event hai. Best rate do.',
        formalEmail: 'Dear Catering Lead, please find RFP attached.',
      },
    },
    {
      id: 'v-decor',
      vendorType: 'Atmospheric Floral & Architectural Decor',
      estimatedCost: 400000,
      negotiatedCost: 350000, // ₹50k saved
      bookingDeadline: '4 Weeks Before',
      status: 'booked',
      verificationChecklist: [
        '3D stage render signed off by client',
        'Fire-retardant fabric certification',
        'On-site production supervisor assigned',
        'Load-in & teardown permit cleared',
      ],
      checkedItems: [true, false, false, false],
      redFlagWarning: 'Demands 100% upfront payment prior to truck dispatch.',
      scripts: {
        hinglishWhatsApp: 'Hi Decor team, quote chahiye.',
        formalEmail: 'Dear Decor Team, inquiry regarding lighting and stage.',
      },
    },
    {
      id: 'v-photo',
      vendorType: 'Cinematic Visual Arts & Drone Coverage',
      estimatedCost: 300000,
      // No negotiatedCost set -> defaults to estimatedCost (₹0 saved)
      bookingDeadline: '2 Months Before',
      status: 'shortlisting',
      verificationChecklist: [
        'Raw footage delivery SLA in writing',
        'Backup drone and cameras on-site',
        'Dual memory card recording confirmed',
        'Social media teaser turnaround 48 hours',
      ],
      checkedItems: [false, false, false, false],
      redFlagWarning: 'Refuses to provide raw unedited footage files.',
      scripts: {
        hinglishWhatsApp: 'Hi Photo team, portfolio share karo.',
        formalEmail: 'Dear Photo Studio, inquiry for full-day shoot.',
      },
    },
  ];

  describe('Vendor Spend & Savings Calculations', () => {
    it('calculates total estimated vendor spend accurately', () => {
      const financials = calculateVendorFinancials(sampleVendors);
      // 750,000 + 400,000 + 300,000 = 1,450,000
      expect(financials.totalEstimated).toBe(1450000);
    });

    it('calculates negotiated commitment target and unlocked savings', () => {
      const financials = calculateVendorFinancials(sampleVendors);
      // Negotiated: 680,000 + 350,000 + 300,000 = 1,330,000
      expect(financials.totalNegotiated).toBe(1330000);

      // Savings: 1,450,000 - 1,330,000 = 120,000
      expect(financials.totalSavings).toBe(120000);
    });

    it('accurately counts booked and paid vendor partners', () => {
      const financials = calculateVendorFinancials(sampleVendors);
      // Only 'v-decor' has status 'booked'
      expect(financials.bookedCount).toBe(1);
    });

    it('handles empty vendor lists gracefully', () => {
      const financials = calculateVendorFinancials([]);
      expect(financials).toEqual({
        totalEstimated: 0,
        totalNegotiated: 0,
        totalSavings: 0,
        bookedCount: 0,
      });
    });
  });

  describe('Vendor Checklist Toggle States', () => {
    it('toggles an unselected checklist item to true', () => {
      // Toggle item index 2 of 'v-catering' (currently false)
      const updated = toggleVendorChecklist(sampleVendors, 'v-catering', 2);
      const targetVendor = updated.find(v => v.id === 'v-catering')!;

      expect(targetVendor.checkedItems?.[2]).toBe(true);
      // Other items should remain untouched
      expect(targetVendor.checkedItems?.[0]).toBe(true);
      expect(targetVendor.checkedItems?.[1]).toBe(true);
      expect(targetVendor.checkedItems?.[3]).toBe(false);
    });

    it('toggles an already selected checklist item back to false', () => {
      // Toggle item index 0 of 'v-catering' (currently true)
      const updated = toggleVendorChecklist(sampleVendors, 'v-catering', 0);
      const targetVendor = updated.find(v => v.id === 'v-catering')!;

      expect(targetVendor.checkedItems?.[0]).toBe(false);
    });

    it('initializes checklist states when vendor has no checkedItems array', () => {
      const rawVendor: VendorItem = {
        ...sampleVendors[0],
        checkedItems: undefined,
      };

      const updated = toggleVendorChecklist([rawVendor], rawVendor.id, 1);
      expect(updated[0].checkedItems).toBeDefined();
      expect(updated[0].checkedItems?.[1]).toBe(true);
      expect(updated[0].checkedItems?.[0]).toBe(false);
    });

    it('does not mutate the original vendor array (pure function)', () => {
      const originalChecked = sampleVendors[0].checkedItems?.[2];
      toggleVendorChecklist(sampleVendors, 'v-catering', 2);

      expect(sampleVendors[0].checkedItems?.[2]).toBe(originalChecked);
    });
  });

  describe('Hinglish Script Generator Placeholder Replacement', () => {
    it('replaces all [Date], [GuestCount], and [Category] placeholders', () => {
      const template =
        'Namaste Bhai, hum [Date] ko 350 guests ka [Category] organize kar rahe hain. Total [GuestCount] attendees expected.';

      const replaced = replaceScriptPlaceholders(template, {
        Date: 'October 24, 2026',
        GuestCount: 350,
        Category: 'Grand Wedding Reception',
      });

      expect(replaced).toContain('October 24, 2026');
      expect(replaced).toContain('Grand Wedding Reception');
      expect(replaced).toContain('350 attendees expected');
      expect(replaced).not.toContain('[Date]');
      expect(replaced).not.toContain('[GuestCount]');
      expect(replaced).not.toContain('[Category]');
    });

    it('generates fully interpolated Hinglish negotiation message for WhatsApp', () => {
      const script = generateHinglishScript('DJ & Sound Engineering', {
        date: 'Nov 12, 2026',
        guestCount: 200,
        category: 'Birthday Bash',
        city: 'Mumbai',
        targetRate: 50000,
      });

      expect(script).toContain('Nov 12, 2026');
      expect(script).toContain('Mumbai');
      expect(script).toContain('200 guests');
      expect(script).toContain('Birthday Bash');
      expect(script).toContain('DJ & Sound Engineering');
      expect(script).toContain('50,000');
      expect(script).not.toContain('[Date]');
      expect(script).not.toContain('[GuestCount]');
      expect(script).not.toContain('[Category]');
    });

    it('handles missing template gracefully', () => {
      expect(replaceScriptPlaceholders('', { Date: '2026' })).toBe('');
    });
  });
});
