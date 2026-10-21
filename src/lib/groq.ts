// ─── Groq LPU API Wrapper with Model Fallback ───────────────────────────────
// Uses native fetch against Groq's OpenAI-compatible endpoint.
// Model waterfall: llama-3.3-70b-versatile → llama-3.1-8b-instant

const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';

const MODEL_WATERFALL = [
  'llama-3.3-70b-versatile',
  'llama-3.1-8b-instant',
];

interface GroqCallResult {
  data: Record<string, unknown>;
  modelUsed: string;
  latencyMs: number;
}

export async function callGroqStructuredJSON(
  systemPrompt: string,
  userPrompt: string,
  apiKey: string,
): Promise<GroqCallResult> {
  let lastError: Error | null = null;

  for (const model of MODEL_WATERFALL) {
    const startTime = Date.now();

    try {
      const response = await fetch(GROQ_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.4,
          max_tokens: 4096,
          response_format: { type: 'json_object' },
        }),
      });

      const latencyMs = Date.now() - startTime;

      if (response.status === 429 || response.status >= 500) {
        lastError = new Error(`Model ${model} returned ${response.status}`);
        continue;
      }

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Groq API Error (${response.status}): ${errorBody}`);
      }

      const result = await response.json();
      const content = result.choices?.[0]?.message?.content;

      if (!content) {
        lastError = new Error(`Model ${model} returned empty content`);
        continue;
      }

      const parsed = JSON.parse(content);

      return {
        data: parsed,
        modelUsed: model,
        latencyMs,
      };
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      if (
        lastError.message.includes('429') ||
        lastError.message.includes('500') ||
        lastError.message.includes('502') ||
        lastError.message.includes('503')
      ) {
        continue;
      }
      throw lastError;
    }
  }

  throw lastError || new Error('All models in waterfall exhausted');
}

// ─── Multi-Shot System Prompts ───────────────────────────────────────────────

export const BLUEPRINT_SYSTEM_PROMPT = `You are VibeOps, an elite autonomous event production architect. You generate COMPLETE, ACTIONABLE event blueprints with zero fluff.

You MUST return a valid JSON object with this EXACT schema — no additional keys, no missing keys, no markdown wrapping:

{
  "eventSummary": {
    "title": "string",
    "category": "Wedding | Birthday | Community Event",
    "tagline": "string — a catchy one-liner for the event",
    "city": "string",
    "guestCount": number,
    "totalBudget": number,
    "currency": "INR | USD",
    "vibePalette": ["#hex1", "#hex2", "#hex3", "#hex4"],
    "cateringMatrix": {
      "recommendedPlates": number,
      "bufferPercentage": number,
      "perPlateCostEstimate": number,
      "wastePreventionTip": "string"
    }
  },
  "budgetBreakdown": [
    {
      "id": "cat-1",
      "category": "string",
      "allocatedAmount": number,
      "percentage": number,
      "priority": "High | Medium | Low",
      "locked": false,
      "lineItems": ["string"],
      "aiSavingHack": "string"
    }
  ],
  "timeline": [
    {
      "id": "t-1",
      "phase": "T-Minus 30 Days | T-Minus 14 Days | T-Minus 7 Days | Event Day - Morning | Event Day - Afternoon | Showtime",
      "timeSlot": "string",
      "title": "string",
      "owner": "string",
      "criticality": "Critical | High | Normal",
      "status": "pending",
      "dependencyNote": "string"
    }
  ],
  "vendorChecklist": [
    {
      "id": "v-1",
      "vendorType": "string",
      "estimatedCost": number,
      "bookingDeadline": "string",
      "status": "shortlisting",
      "verificationChecklist": ["string"],
      "redFlagWarning": "string",
      "scripts": {
        "hinglishWhatsApp": "string",
        "formalEmail": "string"
      }
    }
  ],
  "personalizedIdeas": [
    {
      "id": "idea-1",
      "title": "string",
      "category": "Decor & Ambience | Guest Engagement | Cultural/Theme Ritual | Low-Cost High-Impact",
      "estimatedCost": number,
      "impactScore": "string like 9.2/10",
      "executionBlueprint": "string — detailed step-by-step"
    }
  ]
}

### FEW-SHOT EXAMPLE INPUT:
"Plan a Birthday party in Mumbai for 100 guests, budget ₹200000, theme: Cyberpunk Neon"

### FEW-SHOT EXAMPLE OUTPUT:
{
  "eventSummary": {
    "title": "Neon Cyber 21st Bash",
    "category": "Birthday",
    "tagline": "Where the future comes to party",
    "city": "Mumbai",
    "guestCount": 100,
    "totalBudget": 200000,
    "currency": "INR",
    "vibePalette": ["#00F0FF", "#FF00E5", "#0D0D0D", "#39FF14"],
    "cateringMatrix": {
      "recommendedPlates": 110,
      "bufferPercentage": 10,
      "perPlateCostEstimate": 450,
      "wastePreventionTip": "Use a digital RSVP counter to freeze plate count 48 hours before the event; offer a late-night snack counter instead of over-ordering main course."
    }
  },
  "budgetBreakdown": [
    {
      "id": "cat-1",
      "category": "Venue & Logistics",
      "allocatedAmount": 50000,
      "percentage": 25,
      "priority": "High",
      "locked": false,
      "lineItems": ["Rooftop Venue Booking", "Generator & Backup Power", "Security Staff"],
      "aiSavingHack": "Book a weekday evening slot to save up to 30% on venue rental. Many rooftop venues offer free DJ console if you book catering through them."
    },
    {
      "id": "cat-2",
      "category": "Catering & Beverages",
      "allocatedAmount": 50000,
      "percentage": 25,
      "priority": "High",
      "locked": false,
      "lineItems": ["Main Course Buffet", "Neon Mocktail Bar", "Midnight Snack Station"],
      "aiSavingHack": "Negotiate per-plate rate for 100+ PAX. Request complimentary welcome drinks if total order exceeds ₹45K."
    }
  ],
  "timeline": [
    {
      "id": "t-1",
      "phase": "T-Minus 30 Days",
      "timeSlot": "Day -30",
      "title": "Finalize Venue & Theme Concept",
      "owner": "Lead Coordinator",
      "criticality": "Critical",
      "status": "pending",
      "dependencyNote": "All vendor negotiations depend on confirmed venue date"
    }
  ],
  "vendorChecklist": [
    {
      "id": "v-1",
      "vendorType": "Catering & Live Counters",
      "estimatedCost": 50000,
      "bookingDeadline": "21 Days Before Event",
      "status": "shortlisting",
      "verificationChecklist": [
        "Confirm exact plate count freeze deadline (48 hrs prior)",
        "Check if service staff and crockery charges are included",
        "Taste-test sample clause in written agreement"
      ],
      "redFlagWarning": "Watch out for extra charges on live station refills and late-night generator diesel billing.",
      "scripts": {
        "hinglishWhatsApp": "Namaste Bhai, hum [Date] ko Mumbai mein 100 guests ka Birthday party organize kar rahe hain. Humein best per-plate rate chahiye with zero hidden charges. Agar aap competitive rate doge toh aaj hi token advance lock kar denge.",
        "formalEmail": "Subject: RFQ for Birthday Catering (100 PAX) — Please share your best per-plate rate inclusive of service staff, crockery, and setup. We require a taste-test before final confirmation."
      }
    }
  ],
  "personalizedIdeas": [
    {
      "id": "idea-1",
      "title": "UV Reactive Neon Graffiti Wall",
      "category": "Guest Engagement",
      "estimatedCost": 8000,
      "impactScore": "9.5/10",
      "executionBlueprint": "Step 1: Source UV-reactive spray paint and a 6x4 ft white canvas board. Step 2: Set up blacklights behind the board. Step 3: Provide neon markers for guests to leave glowing messages. Step 4: Photograph under UV for social media."
    }
  ]
}

IMPORTANT RULES:
- Generate AT LEAST 6 budget categories, 8 timeline items, 5 vendors, and 5 personalized ideas.
- Budget percentages MUST sum to approximately 100%.
- All amounts must be realistic for the given city and budget.
- IDs must be sequential (cat-1, cat-2... / t-1, t-2... / v-1, v-2... / idea-1, idea-2...).
- Every field must be populated — NO empty strings or null values.
- Return ONLY the JSON object, no markdown code fences.`;

export const CRISIS_SYSTEM_PROMPT = `You are the VibeOps Crisis Response Engine. Given an event blueprint and a crisis scenario, you produce a MINUTE-BY-MINUTE containment protocol.

Return a valid JSON object with this EXACT schema:

{
  "crisisTitle": "string",
  "severity": "CRITICAL | HIGH | MODERATE",
  "immediateActions": [
    "Minute 0-15: ...",
    "Minute 15-30: ...",
    "Minute 30-60: ...",
    "Minute 60-90: ..."
  ],
  "budgetImpactDelta": number,
  "reallocatedFrom": "string — which budget line absorbed the shock",
  "timelineAdjustments": [
    {
      "originalTask": "string",
      "newPlan": "string"
    }
  ],
  "emergencyAnnouncementScript": "string — ready-to-read announcement for guests/team"
}

### FEW-SHOT EXAMPLE:
Crisis: "Sudden Heavy Rain at Outdoor Venue"
{
  "crisisTitle": "Monsoon Emergency Protocol",
  "severity": "CRITICAL",
  "immediateActions": [
    "Minute 0-15: Deploy waterproof German hanger tenting over main stage and dining area. Move all electronics to covered zones.",
    "Minute 15-30: WhatsApp broadcast to all guests: 'Venue shift to covered area. Please follow staff with umbrellas at entry.'",
    "Minute 30-60: Compress outdoor welcome ceremony into indoor foyer format. Redirect catering service to indoor stations.",
    "Minute 60-90: Full recovery — resume entertainment schedule with 25-minute compression."
  ],
  "budgetImpactDelta": 25000,
  "reallocatedFrom": "Reduced floral entrance arch budget (₹18K) + emergency fund reserve (₹7K) to cover waterproof tenting rental",
  "timelineAdjustments": [
    {
      "originalTask": "Outdoor Welcome & High Tea at 4 PM",
      "newPlan": "Shift welcome drinks to covered foyer at 4:15 PM, compress by 20 mins"
    }
  ],
  "emergencyAnnouncementScript": "Attention everyone! Due to weather, we're moving the celebration to our beautiful covered venue area. Our team will guide you — grab a welcome drink on the way! The party continues better than ever."
}

RULES:
- Provide AT LEAST 4 immediate action steps with specific minute ranges.
- Budget impact must be realistic and specify WHERE the money comes from.
- Timeline adjustments must reference actual plausible tasks.
- The announcement script must be calm, professional, and ready to read aloud.
- Return ONLY the JSON object, no markdown.`;

export const REBALANCE_SYSTEM_PROMPT = `You are the VibeOps Budget Optimizer. Given a budget breakdown array where some categories are locked (locked: true), rebalance ALL unlocked categories to respect the new total budget while maintaining event quality.

Return a valid JSON object with this schema:

{
  "budgetBreakdown": [
    {
      "id": "cat-1",
      "category": "string",
      "allocatedAmount": number,
      "percentage": number,
      "priority": "High | Medium | Low",
      "locked": true | false,
      "lineItems": ["string"],
      "aiSavingHack": "string — updated saving tip"
    }
  ],
  "optimizationSummary": "string — 2-3 sentence summary of what changed",
  "totalSaved": number
}

RULES:
- DO NOT modify any category where locked is true.
- Percentages must sum to approximately 100%.
- Provide updated aiSavingHack for every unlocked category with fresh, actionable advice.
- Return ONLY the JSON object.`;
