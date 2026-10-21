// ─── Groq AI API Route ───────────────────────────────────────────────────────
// Next.js App Router API handler for all AI operations.

import { NextRequest, NextResponse } from 'next/server';
import {
  callGroqStructuredJSON,
  BLUEPRINT_SYSTEM_PROMPT,
  CRISIS_SYSTEM_PROMPT,
  REBALANCE_SYSTEM_PROMPT,
} from '@/lib/groq';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, payload, clientApiKey } = body;

    const apiKey = clientApiKey || process.env.GROQ_API_KEY;

    if (!apiKey || apiKey.includes('PASTE_YOUR_GROQ_KEY_HERE') || apiKey.includes('your_groq_api_key_here') || apiKey.trim() === '') {
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
        userPrompt = `Generate a complete event blueprint for the following:
Event Type: ${p.eventType}
Event Title: ${p.title}
City/Location: ${p.city}
Guest Count (PAX): ${p.guestCount}
Total Budget: ${p.currency} ${p.totalBudget.toLocaleString()}
Event Date: ${p.eventDate}
Vibe/Theme Tags: ${p.vibeTags?.join(', ') || 'Not specified'}
Dietary/Cultural Notes: ${p.dietaryNotes || 'None specified'}

Generate a COMPLETE blueprint with:
- At least 6 budget categories (percentages summing to ~100%)
- At least 8 timeline items across multiple phases
- At least 5 vendor entries with Hinglish WhatsApp and formal email scripts
- At least 5 personalized creative ideas with execution blueprints
- Realistic costs for ${p.city} market rates
- All amounts in ${p.currency}`;
        break;
      }

      case 'simulate_crisis': {
        systemPrompt = CRISIS_SYSTEM_PROMPT;
        userPrompt = `Current Event Context:
${JSON.stringify(payload.eventSummary, null, 2)}

Current Budget Breakdown:
${JSON.stringify(payload.budgetBreakdown, null, 2)}

CRISIS SCENARIO: ${payload.crisisScenario}

Generate a minute-by-minute containment protocol with budget reallocation and a ready-to-send announcement script.`;
        break;
      }

      case 'rebalance_budget': {
        systemPrompt = REBALANCE_SYSTEM_PROMPT;
        const mode = payload.mode || 'rebalance';
        const targetReduction = mode === 'slash15' ? 'Reduce the TOTAL budget by 15% while maintaining event quality.' : '';
        userPrompt = `Current Budget Breakdown:
${JSON.stringify(payload.budgetBreakdown, null, 2)}

Total Event Budget: ${payload.currency} ${payload.totalBudget.toLocaleString()}
Event Type: ${payload.eventType}
City: ${payload.city}
Guest Count: ${payload.guestCount}

${targetReduction}

Rebalance all UNLOCKED categories. DO NOT modify any category where locked is true.
Provide updated aiSavingHack for each unlocked category.
Percentages must sum to approximately 100%.`;
        break;
      }

      default:
        return NextResponse.json(
          { error: 'INVALID_ACTION', message: `Unknown action: ${action}` },
          { status: 400 }
        );
    }

    const result = await callGroqStructuredJSON(systemPrompt, userPrompt, apiKey);

    return NextResponse.json({
      data: result.data,
      modelUsed: result.modelUsed,
      latencyMs: result.latencyMs,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[AI Route Error]', message);
    return NextResponse.json(
      { error: 'AI_ERROR', message },
      { status: 500 }
    );
  }
}
