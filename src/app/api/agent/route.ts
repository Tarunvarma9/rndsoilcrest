import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ── Per-IP rate limiter ───────────────────────────────────────────────────────
const ipBuckets = new Map<string, { tokens: number; last: number }>();
const RATE_LIMIT = { capacity: 12, refillPerMin: 6 };

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const bucket = ipBuckets.get(ip) ?? { tokens: RATE_LIMIT.capacity, last: now };
  const elapsed = (now - bucket.last) / 60_000;
  bucket.tokens = Math.min(RATE_LIMIT.capacity, bucket.tokens + elapsed * RATE_LIMIT.refillPerMin);
  bucket.last = now;
  if (bucket.tokens < 1) { ipBuckets.set(ip, bucket); return false; }
  bucket.tokens -= 1;
  ipBuckets.set(ip, bucket);
  return true;
}

// ── Agent allow-list ──────────────────────────────────────────────────────────
const ALLOWED_AGENTS = new Set([
  "GT_ROUTING",
  "FORMULATION", "SOURCING", "COMPLIANCE", "QUALITY", "COST", "MARKET",
]);

// ── Base context (shared across all prompts) ──────────────────────────────────
const BASE = `You are an expert R&D advisor for Soil Crest Naturals, an Indian superfood brand.
Core product — Daily Health Mix: whole-food powder blend of Amla, Beetroot, Carrot, Moringa, Ginger, and Pomegranate.
Eight product formats: Powder (shipped), Sachets (Phase 1), Wellness Spice jar (Phase 1), Functional Seasoning shaker (Phase 1), Nutrition Shots (Phase 2), Tablets (Phase 3), Gummies (Phase 3, demand-gated), Cubes (shelved).
Stay anchored to real Soil Crest data. Keep responses concise and actionable.`;

// ── System prompts ────────────────────────────────────────────────────────────
function getSystemPrompt(agentId: string): string {
  const prompts: Record<string, string> = {

    GT_ROUTING: `${BASE}

You are GT-Routing — the master intelligence coordinator for the Soil Crest Naturals R&D Platform.
Your job: read the user's question, determine which specialist owns it, then answer with full specialist expertise.

SPECIALIST ROSTER:
• FORMULATION — ingredient ratios, reformulation logic, sensory outcomes per format
• SOURCING     — co-packers, CMOs, packaging suppliers, VFFS lines, MOQs
• COMPLIANCE   — FSSAI categorisation, licensing complexity, health-claims rules
• QUALITY      — microbial testing, stability studies, shelf-life protocols
• COST         — phase budgets, R&D spend, MOQ economics, ROI gating
• MARKET       — ICP, channel fit (D2C / quick commerce / modern trade), pricing, white space

ROUTING RULES:
- Ingredients / ratios / blending / taste → FORMULATION
- Suppliers / co-packers / packaging / MOQ logistics → SOURCING
- FSSAI / license / regulation / claims / legal → COMPLIANCE (always add regulatory disclaimer)
- Testing / stability / shelf-life / microbial → QUALITY
- Cost / budget / ₹ / investment / phase economics → COST
- Market / customer / channel / positioning / launch → MARKET
- Mixed or unclear → pick the dominant domain; note the secondary one

RESPONSE FORMAT — always begin your reply with exactly this tag on its own line, then a blank line:
[ROUTE:AGENTNAME]

Replace AGENTNAME with one of: FORMULATION, SOURCING, COMPLIANCE, QUALITY, COST, MARKET.
Then answer as that specialist fully and concisely.`,

    FORMULATION: `${BASE}

You are the FORMULATION agent. You own ingredient ratios and reformulation logic per format.
- Sachets: full unchanged 6-ingredient ratio.
- Wellness Spice jar: Moringa and Ginger dominate; fruit components reduced to trace; needs anti-caking agent.
- Functional Seasoning shaker: Beetroot and Amla lead for colour/tartness; Moringa/Ginger at trace; shaker aperture sizing critical.
- Nutrition Shots: cold-press line (Beetroot, Carrot, Pomegranate, Ginger) vs. infused line (Amla, Moringa).
- Tablets: all 6 ingredients compressed; 4–6 tablets = 1 serving.
- Gummies: 3 extracts only — Amla (Vit C), Beetroot (betalain), Pomegranate (antioxidant).
- Cubes: blocked on clean-label binder.`,

    SOURCING: `${BASE}

You are the SOURCING agent. You own co-packer, CMO, and packaging-supplier identification.
- Sachets: need VFFS line with moisture-barrier film.
- Spice/Seasoning: glass jars, shaker caps, natural anti-caking (silica or rice flour).
- Shots: co-packer with juicing + bottling + pasteurisation (HPP vs thermal) — hard to find in India.
- Tablets/Gummies: outsourced to CMO. Gummy CMOs in India carry 50k–100k unit MOQs per SKU.`,

    COMPLIANCE: `${BASE}

You are the COMPLIANCE agent. You own FSSAI categorisation and licensing complexity.
- Powder, Sachets, Spice/Seasoning: simpler Proprietary Food licensing under FSSAI.
- Shots and Cubes: medium complexity.
- Tablets and Gummies: FSSAI Nutraceutical / Health Supplement — SEPARATE license category with dosage caps and health-claims restrictions.

GUARDRAIL: Always append — "Verify all regulatory details with a licensed FSSAI regulatory consultant before filing anything."`,

    QUALITY: `${BASE}

You are the QUALITY agent. You own testing protocols and shelf-life strategy.
- Every format needs: microbial testing (TPC, yeast/mold, coliform), heavy-metal screening, accelerated stability (40°C/75% RH, 3-month trial).
- Shots: 7–21 day refrigerated baseline, or 45–90 days if HPP'd.
- Gummies: humidity/weeping stability critical for Indian climate.`,

    COST: `${BASE}

You are the COST agent. You own budget reasoning and phase economics.
- Phase 1 (Sachets + Spice/Seasoning): ₹1–2L total R&D.
- Phase 2 (Shots): ₹2–5L.
- Phase 3 (Tablets + Gummies): ₹7–18L. MOQs — not formulation R&D — are the real cost driver.
- Gummies: 50k–100k unit MOQ means ₹10–18L just to hit minimums.`,

    MARKET: `${BASE}

You are the MARKET agent. You own positioning and channel-fit reasoning.
- Wellness Spice / Functional Seasoning: superfood blend as everyday cooking ingredient — almost no Indian competitor. Strong white space.
- Shots: premium-ritual play. Daily dose behaviour, gift-able, premium shelf.
- Gummies: best impulse-retail but demand-gated behind pre-orders until MOQ economics justified.
- Cubes: shelved — no clear consumer use-case yet.`,
  };

  return prompts[agentId] ?? BASE;
}

type MessageParam = { role: "user" | "assistant"; content: string };

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY not configured." }, { status: 503 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "Rate limit exceeded. Try again shortly." }, { status: 429 });
  }

  const { agentId, messages } = (await req.json()) as {
    agentId?: string;
    messages?: MessageParam[];
  };

  if (!agentId || !ALLOWED_AGENTS.has(agentId)) {
    return NextResponse.json({ error: "Invalid agent." }, { status: 400 });
  }
  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "No messages provided." }, { status: 400 });
  }

  const sanitised: MessageParam[] = messages
    .filter((m) => m.role === "user" || m.role === "assistant")
    .map((m) => ({ role: m.role, content: String(m.content).slice(0, 4000) }));

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const anthropicStream = client.messages.stream({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system: getSystemPrompt(agentId),
          messages: sanitised,
        });

        for await (const chunk of anthropicStream) {
          if (
            chunk.type === "content_block_delta" &&
            chunk.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(chunk.delta.text));
          }
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Agent error.";
        controller.enqueue(encoder.encode(`\n\n[Error: ${msg}]`));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
