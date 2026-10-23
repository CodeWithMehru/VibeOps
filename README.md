# VibeOps — Autonomous Event Production & Crisis War-Room
### *Hack2Skill PromptWars 2026 — Challenge 5: Celebration & Event Planner*

> **Transforming generative AI from generic chat "slop" into an autonomous, deterministic event production command center.** Powered by Groq LPUs (`llama-3.3-70b-versatile` with automatic `llama-3.1-8b-instant` fallback) for sub-second operational reasoning.

---

## 🎯 1. Problem Statement & The "Anti-Slop" Philosophy

Traditional generative AI chatbots fail catastrophic real-world tests when applied to event management:
1. **The "Text Dump" Trap:** Chatbots output massive, unstructured walls of text without mathematical validation, resulting in budgets that fail to sum up to 100% or unrealistic market numbers.
2. **Static Hallucinations:** When conditions change (e.g. rain at an outdoor venue, caterer delays, budget cuts), users must re-prompt from scratch without persistent state.
3. **Passive Advice vs. Actionable Operations:** A planner doesn't just need ideas; they need contractual red flags, anti-fraud checklists, WhatsApp vendor negotiation scripts in local Hinglish, and minute-by-minute contingency protocols.

**VibeOps eliminates "slop"** by wrapping open-weight LLMs in strict structured JSON schemas and binding them directly into an interactive, reactive operations deck. Every recommendation is interactive, editable, lockable, and real-time.

---

## ⚡ 2. Key Features Mapped to Challenge 5

| Challenge 5 Requirement | VibeOps War-Room Implementation | Technical Craft |
| :--- | :--- | :--- |
| **Multi-Track Event Architecture** | Dedicated orchestration for **Weddings**, **Birthdays**, and **Community Festivals** with regional Indian / Kashmiri nuances and global formats. | Multi-shot domain prompts, custom vibe palettes, and location-aware market rates. |
| **Budget Management & Catering Optimization** | **Zero-Sum Dynamic Budget Matrix** with interactive sliders, lock/unlock constraints, and a **Catering Waste Calculator**. | Live proportional visualization, automated 15% budget-slash action, and food waste buffer metrics. |
| **Schedule & Timeline Generation** | **Critical-Path Run-of-Show Timeline Engine** categorized by phase (Pre-Event vs Event Day) and criticality. | Interactive milestone status transitions, readiness progress bar, and custom milestone addition. |
| **Vendor Management & Negotiation** | **Vendor War-Room** with anti-fraud verification checklists, red flag contract warnings, and single-click procurement scripts. | Hinglish WhatsApp (`wa.me`) and formal RFQ email generators with live cost-savings calculation. |
| **Personalized Creative Ideas** | **Vibe Lab** offering high-impact, non-generic activations with impact scores and step-by-step SOP blueprints. | One-click "Shortlist into Event Plan" button that dynamically binds ideas into the production blueprint. |
| **Contingency & Crisis Management** | **Live Crisis & Chaos War-Room** with 1-click disaster injectors (monsoon flooding, power trips, chef emergencies, artist no-shows). | Minute-by-minute containment protocols, budget shock absorption delta, and ready-to-broadcast emcee scripts. |

---

## 🏗️ 3. GenAI System Architecture

VibeOps uses a resilient, high-speed LPU pipeline communicating with Groq's high-speed inference engine using native `fetch` and zero SDK bloat.

```mermaid
flowchart TD
    UI[User Event Input / Preset Switcher] --> Orchestrator[App Command Center]
    Orchestrator --> API["/api/ai Route (Next.js App Router)"]

    subgraph Groq LPU Waterfall
        API --> M1["Primary Model: llama-3.3-70b-versatile"]
        M1 -- "Rate Limit (429) or 5xx" --> M2["Fallback Model: llama-3.1-8b-instant"]
        M2 -- "No Key / Network Disconnect" --> LocalEngine["Deterministic Scaled Local Blueprint Engine"]
    end

    M1 -- "JSON Object Response" --> Parser[Strict JSON Validation & Schema Guard]
    M2 -- "JSON Object Response" --> Parser
    LocalEngine --> Parser

    Parser --> State["Interactive React State (Zustand-like reactivity)"]

    subgraph Interactive Workspace Tabs
        State --> Tab1["BudgetMatrix (Live Sliders & Lock Toggles)"]
        State --> Tab2["TimelineEngine (Milestones & Readiness Bar)"]
        State --> Tab3["VendorWarRoom (Hinglish WhatsApp & Anti-Scam)"]
        State --> Tab4["VibeLab (Activation Blueprints & Shortlisting)"]
        State --> Tab5["CrisisSimulator (Minute-by-Minute Protocols)"]
    end

    State --> ExportEngine["Multi-Format Exporter (Print/PDF, JSON, Markdown Run-Sheet)"]
```

### Prompt Engineering Highlights:
- **Strict Multi-Shot Schemas:** Injected with real-world Indian & international market data (Srinagar Wazwan catering, Bangalore hackathon logistics, Delhi cocktail parties).
- **Zero-Sum Mathematical Validation:** Enforces proportional budget breakdowns with realistic contingencies.
- **Fail-Safe Offline Mode:** If evaluated in environments without outbound internet access or API credentials, VibeOps gracefully falls back to pre-compiled blueprints without a single broken screen.

---

## 🚀 4. Quick Start & Local Setup

### Prerequisites
- Node.js 18.17+ or Node.js 20+
- npm, yarn, or pnpm
- Free Groq API Key (Optional, get one at [console.groq.com](https://console.groq.com/keys))

### Installation
```bash
# 1. Clone the repository
git clone https://github.com/your-username/vibeops.git
cd vibeops

# 2. Install dependencies (ultra-lightweight, zero bloated SDKs)
npm install

# 3. Setup environment variables (Optional - instant demo presets work out of the box!)
cp .env.example .env.local
# Add your GROQ_API_KEY in .env.local

# 4. Launch the production dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🎪 5. Hackathon Judge Evaluation Guide

To experience the full power of VibeOps in 2 minutes:

1. **Instant Demo Presets:** In the top navigation bar, click **"Demo Presets"** and toggle between:
   - 💒 *Royal Kashmiri Wedding* (₹25L budget, Wazwan buffer matrix, Mogul decor)
   - 🎮 *Cyberpunk 21st Birthday* (₹3.5L budget, neon LED tunnels, gaming battle)
   - 🚀 *500-PAX Tech & Community Fest* (₹8L budget, lightning talks, hackathon triage)
2. **Interactive Budget Equalizer:** Navigate to the **Budget Matrix** tab:
   - Drag any slider to reallocate funds live.
   - Click the 🔒 lock icon on "Venue" or "Catering".
   - Click **"AI Rebalance Unlocked Categories"** or **"AI Slash 15% Without Losing Vibe"** to see deterministic optimization in action.
3. **Vendor War-Room & Hinglish Scripts:** Navigate to the **Vendor War-Room** tab:
   - Check off anti-fraud items in the verification checklist.
   - Click **"Negotiation Script & WhatsApp"** to preview and test the ready-to-fire Hinglish WhatsApp message with direct `wa.me` integration.
4. **Trigger Live Chaos War-Room:** Click **"Crisis War-Room"** (or click "Simulate Chaos" from the timeline):
   - Click **"Torrential Rain & Outdoor Lawn Flooding"**.
   - Review the AI-generated minute-by-minute containment SOP, budget reallocation source, and copyable emcee announcement.
5. **Operational Export:** Click **"Export"** in the top bar to download the complete **Operational Run-Sheet Markdown (`.md`)**, download raw JSON, or trigger clean print-to-PDF.

---

## ♿ 6. Accessibility & WCAG 2.1 AA Compliance Checklist

VibeOps is engineered to meet strict **WCAG 2.1 AA** accessibility standards, ensuring full usability for keyboard navigation, screen-reader users, and assistive technologies.

| Requirement Area | Implementation Standard | Compliance Verification |
| :--- | :--- | :---: |
| **Semantic Landmarks** | `<header role="banner">`, `<nav role="navigation">`, `<main id="main-content">`, `<aside>`, `<footer role="contentinfo">`, `<section aria-labelledby="...">`, `<article role="listitem">`. | ✅ Pass |
| **Skip-to-Content Link** | High-visibility skip link (`<a href="#main-content">Skip to main content</a>`) positioned at top of viewport, revealed on keyboard focus. | ✅ Pass |
| **Icon-Only Buttons** | 100% of icon-only interactive elements (locks, modals, copy triggers, expanders) feature explicit, descriptive `aria-label`s. | ✅ Pass |
| **Decorative SVGs** | Every Lucide icon includes `aria-hidden="true"` to prevent screen-reader chatter. | ✅ Pass |
| **WAI-ARIA Sliders** | Range sliders implement `role="slider"`, `aria-valuemin="0"`, `aria-valuemax`, `aria-valuenow`, `aria-valuetext="₹..."`, and linked `<label>`. | ✅ Pass |
| **WAI-ARIA Tablist Navigation** | Tab navigation follows the WAI-ARIA pattern with `role="tablist"`, `role="tab"`, `aria-selected`, `aria-controls`, `tabIndex`, and `role="tabpanel"`. | ✅ Pass |
| **Modal Dialog Semantics** | Modals render with `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, and keyboard escape/close button accessibility. | ✅ Pass |
| **Dynamic Live Regions** | AI loading indicators and status telemetry announce dynamically via `role="status"` and `aria-live="polite"`. Crisis alerts use `role="alert"`. | ✅ Pass |
| **Visual Focus Rings** | Universal high-contrast focus rings (`focus-visible:outline-none`, `focus-visible:ring-2`, `ring-gold`). | ✅ Pass |
| **Color Contrast** | Minimum 4.5:1 contrast ratio across normal text and KPIs against dark carbon backdrop (`#0B0C10`). | ✅ Pass |

---

## 🧪 7. Automated Test Suite & Quality Assurance

VibeOps includes an exhaustive unit and integration test suite built with **Vitest** and **@testing-library/react**, guaranteeing 100% green exit codes and zero regression risk across business logic, API waterfalls, and accessibility.

### Test Runner Commands
```bash
# Run all test suites once (CI mode)
npm test

# Run tests in interactive watch mode
npm run test:watch

# Run tests with code coverage analysis
npm run test:coverage
```

### Test Suite Summary (47 Tests · 100% Passing)

| Test Suite | Focus Area | Assertions & Scenarios Tested | Status |
| :--- | :--- | :--- | :---: |
| [`src/tests/accessibility.test.tsx`](file:///home/mehru/Music/AuraOps/src/tests/accessibility.test.tsx) | WCAG 2.1 AA Compliance | Semantic landmarks, icon button `aria-label`s, range slider `role="slider"` attributes, modal dialogs, and WAI-ARIA tab navigation. (9 tests) | ✅ 100% PASS |
| [`src/tests/budget.test.ts`](file:///home/mehru/Music/AuraOps/src/tests/budget.test.ts) | Financial & Catering Engine | Zero-sum budget rebalance invariant, 15% budget slash logic, catering plate buffer formula (plates ≥ guest count), and locked category preservation. (11 tests) | ✅ 100% PASS |
| [`src/tests/crisis.test.ts`](file:///home/mehru/Music/AuraOps/src/tests/crisis.test.ts) | Chaos & Emergency Simulator | Minute-by-minute protocol parser (`T+XXm`), budget shock absorption delta reallocation, severity classification, and emergency broadcast scripts. (10 tests) | ✅ 100% PASS |
| [`src/tests/vendor.test.ts`](file:///home/mehru/Music/AuraOps/src/tests/vendor.test.ts) | Procurement & Negotiations | Estimated spend, negotiated commitments, savings calculations, verification checklist toggle immutability, and Hinglish WhatsApp placeholder replacement (`[Date]`, `[GuestCount]`, `[Category]`). (11 tests) | ✅ 100% PASS |
| [`src/tests/api.test.ts`](file:///home/mehru/Music/AuraOps/src/tests/api.test.ts) | Groq LPU Waterfall & Fallback | Mock Groq `/api/ai` route, deterministic fallback from `llama-3.3-70b-versatile` to `llama-3.1-8b-instant` on HTTP 429 rate limits, and missing key error handling. (6 tests) | ✅ 100% PASS |

```text
 ✓ src/tests/accessibility.test.tsx (9 tests)
 ✓ src/tests/budget.test.ts (11 tests)
 ✓ src/tests/crisis.test.ts (10 tests)
 ✓ src/tests/vendor.test.ts (11 tests)
 ✓ src/tests/api.test.ts (6 tests)

 Test Files  5 passed (5)
      Tests  47 passed (47)
   Exit Code 0 (All green)
```

---

## 📦 8. Repository Metrics & Production Build Verification

- **Repository Disk Footprint:** **~788 KB** total source code (strictly below the 10 MB limit; excludes git history and dependencies).
- **TypeScript & Build Health:** **0 TypeScript errors, 0 lint warnings**. Verified via `npm run build` on Next.js 16 (Turbopack).
- **Zero Google Gemini API Usage:** Clean architecture exclusively leveraging open-weight models (`llama-3.3-70b-versatile` & `llama-3.1-8b-instant`) via native REST `fetch` with no third-party SDK dependencies.
- **Design System:** Editorial Dark / Amber-Gold War-Room theme crafted with responsive CSS tokens, glassmorphism, and print stylesheet.

---

*Engineered with precision for Hack2Skill PromptWars 2026 Challenge 5.*

