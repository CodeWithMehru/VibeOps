/**
 * ─── Event Production Presets Aggregator ────────────────────────────────────
 * Modularized catalog of rich pre-built demonstration blueprints.
 * Enables instant operational evaluation without requiring outbound API access.
 */

import { EventBlueprint } from './types';
import { WEDDING_PRESET } from './presets/wedding-preset';
import { BIRTHDAY_PRESET } from './presets/birthday-preset';
import { COMMUNITY_PRESET } from './presets/community-preset';

export { WEDDING_PRESET } from './presets/wedding-preset';
export { BIRTHDAY_PRESET } from './presets/birthday-preset';
export { COMMUNITY_PRESET } from './presets/community-preset';

/**
 * Key-indexed mapping of pre-compiled demo blueprints.
 */
export const PRESET_MAP: Record<string, EventBlueprint> = Object.freeze({
  wedding: WEDDING_PRESET,
  birthday: BIRTHDAY_PRESET,
  community: COMMUNITY_PRESET,
});

/**
 * Backward-compatible alias for PRESET_MAP.
 */
export const DEMO_PRESETS = PRESET_MAP;

/**
 * Display metadata for preset selectors and command triggers.
 */
export const PRESET_LABELS: ReadonlyArray<{ key: string; label: string; emoji: string }> = Object.freeze([
  { key: 'wedding', label: 'Royal Kashmiri Wedding', emoji: '💒' },
  { key: 'birthday', label: 'Cyberpunk 21st Birthday', emoji: '🎮' },
  { key: 'community', label: '500-PAX Tech & Community Fest', emoji: '🚀' },
]);
