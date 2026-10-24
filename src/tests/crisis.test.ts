import { describe, it, expect } from 'vitest';
import {
  parseMinuteByMinuteProtocol,
  calculateBudgetDeltaReallocation,
  generateFallbackCrisisResponse,
} from '@/lib/crisis-utils';

describe('Crisis War-Room & Chaos Simulation Logic', () => {
  const totalBudget = 2500000;

  describe('Minute-by-Minute Protocol Parser', () => {
    it('accurately parses standard T+XXm prefixes into minute offsets and clean action text', () => {
      const rawActions = [
        'T+00m: Halt non-essential stage operations immediately and secure audio-visual power feeds.',
        'T+05m: Convene with venue general manager and on-site vendor leads.',
        'T+10m: Activate secondary covered banquet space and redirect guest flow.',
        'T+20m: Deploy roving hospitality team offering hot welcome drinks.',
        'T+30m: Brief emcee with revised timeline sequence and announce slight schedule adjustment.',
      ];

      const parsed = parseMinuteByMinuteProtocol(rawActions);

      expect(parsed).toHaveLength(5);
      expect(parsed[0].minuteOffset).toBe(0);
      expect(parsed[0].timeSlot).toBe('T+00m');
      expect(parsed[0].actionText).toBe('Halt non-essential stage operations immediately and secure audio-visual power feeds.');

      expect(parsed[1].minuteOffset).toBe(5);
      expect(parsed[1].timeSlot).toBe('T+05m');

      expect(parsed[3].minuteOffset).toBe(20);
      expect(parsed[3].timeSlot).toBe('T+20m');

      expect(parsed[4].minuteOffset).toBe(30);
      expect(parsed[4].timeSlot).toBe('T+30m');
    });

    it('gracefully parses alternative time formats like T+5min or unformatted strings', () => {
      const actions = [
        'T+5min: Move equipment to covered pavilion',
        'Direct guests to foyer and distribute warm chai',
      ];

      const parsed = parseMinuteByMinuteProtocol(actions);

      expect(parsed[0].minuteOffset).toBe(5);
      expect(parsed[0].timeSlot).toBe('T+05m');
      expect(parsed[0].actionText).toBe('Move equipment to covered pavilion');

      // Default index-based step offset for unformatted lines
      expect(parsed[1].minuteOffset).toBe(5);
      expect(parsed[1].timeSlot).toBe('T+05m');
      expect(parsed[1].actionText).toBe('Direct guests to foyer and distribute warm chai');
    });

    it('returns empty array when provided empty or invalid input', () => {
      expect(parseMinuteByMinuteProtocol([])).toEqual([]);
      // @ts-expect-error Testing runtime resilience
      expect(parseMinuteByMinuteProtocol(null)).toEqual([]);
    });
  });

  describe('Budget Shock Absorption Delta Reallocation Logic', () => {
    it('calculates 5% reallocation for CRITICAL severity incidents', () => {
      const result = calculateBudgetDeltaReallocation(totalBudget, 'CRITICAL');

      expect(result.percentage).toBe(5.0);
      expect(result.deltaAmount).toBe(125000); // 25,00,000 * 5% = 1,25,000
      expect(result.recommendedSource).toContain('Emergency Reserve');
    });

    it('calculates 3.5% reallocation for HIGH severity incidents', () => {
      const result = calculateBudgetDeltaReallocation(totalBudget, 'HIGH');

      expect(result.percentage).toBe(3.5);
      expect(result.deltaAmount).toBe(87500); // 25,00,000 * 3.5% = 87,500
      expect(result.recommendedSource).toContain('Contingency Reserve');
    });

    it('calculates 2.0% reallocation for MODERATE severity incidents', () => {
      const result = calculateBudgetDeltaReallocation(totalBudget, 'MODERATE');

      expect(result.percentage).toBe(2.0);
      expect(result.deltaAmount).toBe(50000); // 25,00,000 * 2.0% = 50,000
    });

    it('supports custom percentage overrides when specified', () => {
      const result = calculateBudgetDeltaReallocation(totalBudget, 'CRITICAL', 7.5);

      expect(result.percentage).toBe(7.5);
      expect(result.deltaAmount).toBe(187500);
    });
  });

  describe('Crisis Injection State Handlers & Fallback Protocol', () => {
    it('injects critical severity for high-risk environmental triggers (rain, power, flood)', () => {
      const rainCrisis = generateFallbackCrisisResponse('Torrential Rain & Outdoor Lawn Flooding', totalBudget);
      expect(rainCrisis.severity).toBe('CRITICAL');
      expect(rainCrisis.immediateActions.length).toBeGreaterThanOrEqual(4);
      expect(rainCrisis.budgetImpactDelta).toBeGreaterThan(0);
      expect(rainCrisis.emergencyAnnouncementScript).toBeTruthy();

      const powerCrisis = generateFallbackCrisisResponse('Main Transformer Trip & Sound System Dead', totalBudget);
      expect(powerCrisis.severity).toBe('CRITICAL');
    });

    it('injects high severity for vendor or performer delays', () => {
      const performerCrisis = generateFallbackCrisisResponse('Headline Performer Misses Connection Flight', totalBudget);
      expect(performerCrisis.severity).toBe('HIGH');
      expect(performerCrisis.timelineAdjustments.length).toBeGreaterThan(0);
    });

    it('generates complete timeline mitigation adjustments and announcements', () => {
      const response = generateFallbackCrisisResponse('Catering equipment failure', totalBudget);

      expect(response.timelineAdjustments).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            originalTask: expect.any(String),
            newPlan: expect.any(String),
          }),
        ])
      );

      expect(response.emergencyAnnouncementScript).toContain('Grand Ballroom');
    });
  });
});
