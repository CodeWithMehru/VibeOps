import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { callGroqStructuredJSON } from '@/lib/groq';
import { POST } from '@/app/api/ai/route';
import { NextRequest } from 'next/server';

describe('Groq AI API & LPU Waterfall Fallback', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  describe('Model Waterfall Fallback Logic (llama-3.3-70b -> llama-3.1-8b)', () => {
    it('successfully calls primary model llama-3.3-70b-versatile when no rate limit occurs', async () => {
      const mockSuccessData = { eventSummary: { title: 'Test Gala', guestCount: 100 } };

      globalThis.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          choices: [
            {
              message: {
                content: JSON.stringify(mockSuccessData),
              },
            },
          ],
        }),
      } as unknown as Response);

      const result = await callGroqStructuredJSON('sys prompt', 'user prompt', 'gsk_test_key_123');

      expect(result.modelUsed).toBe('llama-3.3-70b-versatile');
      expect(result.data).toEqual(mockSuccessData);
      expect(globalThis.fetch).toHaveBeenCalledTimes(1);

      const calledBody = JSON.parse(vi.mocked(globalThis.fetch).mock.calls[0][1]?.body as string);
      expect(calledBody.model).toBe('llama-3.3-70b-versatile');
    });

    it('falls back to llama-3.1-8b-instant when llama-3.3-70b-versatile returns 429 Rate Limit', async () => {
      const mockFallbackData = {
        crisisTitle: 'Power Outage Protocol',
        severity: 'CRITICAL',
        immediateActions: ['T+00m: Switch to DG backup'],
      };

      // Call 1: 429 Too Many Requests on llama-3.3-70b-versatile
      // Call 2: 200 OK on llama-3.1-8b-instant
      globalThis.fetch = vi
        .fn()
        .mockResolvedValueOnce({
          ok: false,
          status: 429,
          text: async () => 'Rate limit exceeded for llama-3.3-70b-versatile',
        } as unknown as Response)
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({
            choices: [
              {
                message: {
                  content: JSON.stringify(mockFallbackData),
                },
              },
            ],
          }),
        } as unknown as Response);

      const result = await callGroqStructuredJSON('sys prompt', 'user prompt', 'gsk_test_key_123');

      expect(result.modelUsed).toBe('llama-3.1-8b-instant');
      expect(result.data).toEqual(mockFallbackData);
      expect(globalThis.fetch).toHaveBeenCalledTimes(2);

      // Verify first attempt used 70b
      const firstCallBody = JSON.parse(vi.mocked(globalThis.fetch).mock.calls[0][1]?.body as string);
      expect(firstCallBody.model).toBe('llama-3.3-70b-versatile');

      // Verify fallback attempt used 8b
      const secondCallBody = JSON.parse(vi.mocked(globalThis.fetch).mock.calls[1][1]?.body as string);
      expect(secondCallBody.model).toBe('llama-3.1-8b-instant');
    });

    it('throws error when all models in waterfall return rate limits or errors', async () => {
      globalThis.fetch = vi
        .fn()
        .mockResolvedValueOnce({
          ok: false,
          status: 429,
          text: async () => 'Rate limit exceeded',
        } as unknown as Response)
        .mockResolvedValueOnce({
          ok: false,
          status: 429,
          text: async () => 'Rate limit exceeded on fallback',
        } as unknown as Response);

      await expect(
        callGroqStructuredJSON('sys prompt', 'user prompt', 'gsk_test_key_123')
      ).rejects.toThrow();
    });
  });

  describe('Next.js API Route (/api/ai) Handler', () => {
    it('returns 400 Bad Request if no API key is provided', async () => {
      const originalKey = process.env.GROQ_API_KEY;
      delete process.env.GROQ_API_KEY;

      const req = new NextRequest('http://localhost:3000/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_blueprint',
          payload: { eventType: 'Wedding' },
          clientApiKey: '',
        }),
      });

      const response = await POST(req);
      const json = await response.json();

      expect(response.status).toBe(400);
      expect(json.error).toBe('NO_API_KEY');

      if (originalKey) process.env.GROQ_API_KEY = originalKey;
    });

    it('returns 400 Bad Request for unknown actions', async () => {
      const req = new NextRequest('http://localhost:3000/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'unknown_unsupported_action',
          payload: {},
          clientApiKey: 'gsk_valid_key_for_test',
        }),
      });

      const response = await POST(req);
      const json = await response.json();

      expect(response.status).toBe(400);
      expect(json.error).toBe('INVALID_ACTION');
    });

    it('processes rebalance_budget action and routes to Groq with fallback', async () => {
      const rebalancedData = {
        budgetBreakdown: [
          { id: 'cat-1', category: 'Venue', allocatedAmount: 500000, percentage: 50, locked: false },
        ],
      };

      globalThis.fetch = vi
        .fn()
        .mockResolvedValueOnce({
          ok: false,
          status: 429,
        } as unknown as Response)
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({
            choices: [{ message: { content: JSON.stringify(rebalancedData) } }],
          }),
        } as unknown as Response);

      const req = new NextRequest('http://localhost:3000/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'rebalance_budget',
          payload: {
            budgetBreakdown: [],
            totalBudget: 1000000,
            currency: 'INR',
            eventType: 'Birthday',
            city: 'Delhi',
            guestCount: 80,
            mode: 'rebalance',
          },
          clientApiKey: 'gsk_active_test_key',
        }),
      });

      const response = await POST(req);
      const json = await response.json();

      expect(response.status).toBe(200);
      expect(json.modelUsed).toBe('llama-3.1-8b-instant');
      expect(json.data).toEqual(rebalancedData);
    });
  });
});
