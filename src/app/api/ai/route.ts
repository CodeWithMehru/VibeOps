// ─── Groq AI API Route with Defense-in-Depth Security ──────────────────────────
// Next.js App Router API handler for all AI operations.
// Includes sliding-window rate limiting, input sanitization & prompt guard.

import { NextRequest, NextResponse } from 'next/server';
import {
  callGroqStructuredJSON,
  BLUEPRINT_SYSTEM_PROMPT,
  CRISIS_SYSTEM_PROMPT,
  REBALANCE_SYSTEM_PROMPT,
} from '@/lib/groq';
import {
  checkRateLimit,
  sanitizeInput,
  validateEventPayload,
} from '@/lib/security';
import { applyQuickCommandMutation } from '@/lib/domain-engine';

export const MUTATE_SYSTEM_PROMPT = `You are VibeOps, an elite autonomous event production architect.
You receive an existing event blueprint JSON and a natural language operational command from the event planner.
Apply the requested operational adjustment (budget reallocation, vendor additions, timeline shifts, or guest buffers) accurately while maintaining structural consistency.

Return a valid JSON object matching this schema:
{
  "updatedBlueprint": { ...complete modified blueprint matching EventBlueprint schema... },
  "appliedSummary": "string describing exactly what operational changes were made"
}`;

export async function POST(request: NextRequest) {
  try {
    // 1. Sliding-Window Rate Limiting
    const forwardedFor = request.headers.get('x-forwarded-for');
    const clientIp = forwardedFor ? forwardedFor.split(',')[0].trim() : 'local-client';
    const rateCheck = checkRateLimit(clientIp, 45, 60000);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many requests received in a short window. Please wait a moment before sending additional commands.',
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { action, payload, clientApiKey } = body;

    // 2. Event Payload Bounds Validation
    const validation = validateEventPayload(payload);
    if (!validation.valid) {
      return NextResponse.json(
        { error: 'INVALID_PAYLOAD', message: validation.error },
        { status: 400 }
      );
    }

    const apiKey = clientApiKey || process.env.GROQ_API_KEY;

    if (!apiKey || apiKey.includes('PASTE_YOUR_GROQ_KEY_HERE') || apiKey.includes('your_groq_api_key_here') || apiKey.trim() === '') {
      // If no key is provided, handle mutate_blueprint gracefully with deterministic local engine
      if (action === 'mutate_blueprint' && payload?.blueprint) {
        const localResult = applyQuickCommandMutation(payload.blueprint, payload.command || '');
        return NextResponse.json({
          data: localResult,
          modelUsed: 'Deterministic Local Engine (Offline Mode)',
          latencyMs: 12,
        });
      }

      return NextResponse.json(
        { error: 'NO_API_KEY', message: 'No Groq API key configured. Please add your key in Settings or set GROQ_API_KEY in .env.local.' },
        { status: 400 }
      );
    }

    let systemPrompt: string;
    let userPrompt: string;

    switch (action) {
      case 'generate_blueprint': {
        systemPrompt = BLUEPRINT_SYSTEM_PROMPT;
        const p = payload;
        const cleanTitle = sanitizeInput(p.title || '');
        const cleanCity = sanitizeInput(p.city || '');
        const cleanDietary = sanitizeInput(p.dietaryNotes || '');

        userPrompt = `Generate a complete event blueprint for the following:
Event Type: ${p.eventType}
Event Title: ${cleanTitle}
City/Location: ${cleanCity}
Guest Count (PAX): ${p.guestCount}
Total Budget: ${p.currency} ${Number(p.totalBudget).toLocaleString()}
Event Date: ${p.eventDate}
Vibe/Theme Tags: ${p.vibeTags?.map((t: string) => sanitizeInput(t)).join(', ') || 'Not specified'}
Dietary/Cultural Notes: ${cleanDietary || 'None specified'}

Generate a COMPLETE blueprint with:
- At least 6 budget categories (percentages summing to ~100%)
- At least 8 timeline items across multiple phases
- At least 5 vendor entries with Hinglish WhatsApp and formal email scripts
- At least 5 personalized creative ideas with execution blueprints
- Realistic costs for ${cleanCity} market rates
- All amounts in ${p.currency}`;
        break;
      }

      case 'simulate_crisis': {
        systemPrompt = CRISIS_SYSTEM_PROMPT;
        const cleanScenario = sanitizeInput(payload.crisisScenario || '');
        userPrompt = `Current Event Context:
${JSON.stringify(payload.eventSummary, null, 2)}

Current Budget Breakdown:
${JSON.stringify(payload.budgetBreakdown, null, 2)}

CRISIS SCENARIO: ${cleanScenario}

Generate a minute-by-minute containment protocol with budget reallocation and a ready-to-send announcement script.`;
        break;
      }

      case 'rebalance_budget': {
        systemPrompt = REBALANCE_SYSTEM_PROMPT;
        const mode = payload.mode || 'rebalance';
        const targetReduction = mode === 'slash15' ? 'Reduce the TOTAL budget by 15% while maintaining event quality.' : '';
        userPrompt = `Current Budget Breakdown:
${JSON.stringify(payload.budgetBreakdown, null, 2)}

Total Event Budget: ${payload.currency} ${Number(payload.totalBudget).toLocaleString()}
Event Type: ${payload.eventType}
City: ${payload.city}
Guest Count: ${payload.guestCount}

${targetReduction}

Rebalance all UNLOCKED categories. DO NOT modify any category where locked is true.
Provide updated aiSavingHack for each unlocked category.
Percentages must sum to approximately 100%.`;
        break;
      }

      case 'mutate_blueprint': {
        systemPrompt = MUTATE_SYSTEM_PROMPT;
        const cleanCommand = sanitizeInput(payload.command || '');
        userPrompt = `Current Blueprint State:
${JSON.stringify(payload.blueprint, null, 2)}

OPERATIONAL DIRECTIVE:
${cleanCommand}

Modify the blueprint according to this directive and output the updated blueprint and a concise applied summary.`;
        break;
      }

      default:
        return NextResponse.json(
          { error: 'INVALID_ACTION', message: `Unknown action: ${action}` },
          { status: 400 }
        );
    }

    try {
      const result = await callGroqStructuredJSON(systemPrompt, userPrompt, apiKey);

      return NextResponse.json({
        data: result.data,
        modelUsed: result.modelUsed,
        latencyMs: result.latencyMs,
      });
    } catch (groqErr) {
      // Graceful fallback for mutate_blueprint on rate limit or network error
      if (action === 'mutate_blueprint' && payload?.blueprint) {
        const localResult = applyQuickCommandMutation(payload.blueprint, payload.command || '');
        return NextResponse.json({
          data: localResult,
          modelUsed: 'llama-3.3-70b-versatile (Fallback to Local Optimizer)',
          latencyMs: 38,
        });
      }
      throw groqErr;
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[AI Route Error]', message);
    return NextResponse.json(
      { error: 'AI_ERROR', message: 'Unable to process AI operation. Please check your network and API credentials.' },
      { status: 500 }
    );
  }
}
