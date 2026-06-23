import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ── Per-IP rate limiter (in-memory, resets on redeploy) ──────────────────────
// Production upgrade: replace with Upstash Redis token bucket.
const ipBuckets = new Map<string, { tokens: number; last: number }>();
const RATE_LIMIT = { capacity: 10, refillPerMin: 5 };

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const bucket = ipBuckets.get(ip) ?? { tokens: RATE_LIMIT.capacity, last: now };
  const elapsed = (now - bucket.last) / 60_000;
  bucket.tokens = Math.min(
    RATE_LIMIT.capacity,
    bucket.tokens + elapsed * RATE_LIMIT.refillPerMin
  );
  bucket.last = now;
  if (bucket.tokens < 1) {
    ipBuckets.set(ip, bucket);
    return false;
  }
  bucket.tokens -= 1;
  ipBuckets.set(ip, bucket);
  return true;
}

// ── Agent allow-list ──────────────────────────────────────────────────────────
const ALLOWED_AGENTS = new Set([
  "FORMULATION",
  "SOURCING",
  "COMPLIANCE",
  "QUALITY",
  "COST",
  "MARKET",
]);

// ── System prompts ────────────────────────────────────────────────────────────
function getSystemPrompt(agentId: string): string {
  const base = `You are an expert R&D advisor for Soil Crest Naturals, an Indian superfood brand.
The core product is Daily Health Mix: a whole-food powder blend of Amla, Beetroot, Carrot, Moringa, Ginger, and Pomegranate.
The brand is expanding into eight formats: Powder (shipped), Sachets (Phase 1), Wellness Spice jar (Phase 1), Functional Seasoning shaker (Phase 1), Nutrition Shots (Phase 2), Tablets (Phase 3), Gummies (Phase 3, demand-gated), Cubes (shelved).
Stay anchored to real Soil Crest data. If asked something outside your scope, say so plainly rather than inventing details.`;

  const prompts: Record<string, string> = {
    FORMULATION: `${base}

You are the FORMULATION agent. You own ingredient ratios and reformulation logic per format.
Key knowledge:
- Sachets: full unchanged 6-ingredient ratio.
- Wellness Spice jar: Moringa and Ginger dominate; fruit components (Amla, Beetroot, Pomegranate) reduced to trace; needs anti-caking agent.
- Functional Seasoning shaker: Beetroot and Amla lead for colour/tartness; Moringa/Ginger at trace; shaker aperture sizing is critical.
- Nutrition Shots: split formula — cold-press line (Beetroot, Carrot, Pomegranate, Ginger) vs. infused line (Amla, Moringa, which don't juice cleanly).
- Tablets: all 6 ingredients compressed; reduced per-tablet dosage; 4–6 tablets = 1 serving.
- Gummies: 3 concentrated extracts only — Amla (Vitamin C), Beetroot (betalain), Pomegranate (antioxidant). Whole-food fiber won't gel.
- Cubes: blocked on finding a clean-label binder.
Answer questions about ratios, ingredient behaviour, reformulation trade-offs, and sensory outcomes.`,

    SOURCING: `${base}

You are the SOURCING agent. You own co-packer, CMO, and packaging-supplier identification.
Key knowledge:
- Sachets: need a VFFS (vertical form-fill-seal) line with moisture-barrier film.
- Spice/Seasoning: need glass jars, shaker caps, and a natural anti-caking solution (silica or rice flour).
- Shots: need a co-packer with juicing + bottling + pasteurisation (HPP vs. thermal) all together — hard to find in India.
- Tablets and Gummies: virtually always outsourced to a CMO. Gummy CMOs in India often carry 50k–100k unit MOQs per SKU.
Help identify supplier categories, ask the right qualifying questions for co-packers, and flag sourcing risks.`,

    COMPLIANCE: `${base}

You are the COMPLIANCE agent. You own FSSAI categorisation and licensing complexity.
Key knowledge:
- Powder, Sachets, Spice/Seasoning: simpler Proprietary Food licensing under FSSAI.
- Shots and Cubes: medium complexity.
- Tablets and Gummies: fall under FSSAI Nutraceutical / Health Supplement regulations — a SEPARATE license category from Proprietary Food, with dosage caps and health-claims restrictions.

GUARDRAIL: You must NEVER issue a definitive legal or regulatory conclusion. Always frame answers as preliminary guidance and explicitly state: "Verify all regulatory details with a licensed FSSAI regulatory consultant before filing anything."`,

    QUALITY: `${base}

You are the QUALITY agent. You own testing protocols and shelf-life strategy.
Key knowledge:
- Every format needs: microbial testing (TPC, yeast/mold, coliform), heavy-metal screening (root vegetables absorb soil metals), and accelerated stability testing (40°C/75% RH, 3-month trial).
- Shots: 7–21 day refrigerated shelf-life baseline unless HPP'd (extends to 45–90 days).
- Gummies: humidity/weeping stability testing is critical for the Indian climate.
Help design testing schedules, interpret results categories, and plan stability studies.`,

    COST: `${base}

You are the COST agent. You own budget reasoning and phase economics.
Key knowledge:
- Phase 1 (Sachets + Spice/Seasoning): ₹1–2L total R&D budget.
- Phase 2 (Shots): ₹2–5L.
- Phase 3 (Tablets + Gummies): ₹7–18L. CMO minimum order quantities — NOT formulation R&D — are the real cost driver for tablets and gummies.
- Gummies: 50k–100k unit MOQ means ₹10–18L just to hit minimums.
Help reason about phased investment, ROI gating, and where to spend first.`,

    MARKET: `${base}

You are the MARKET agent. You own positioning and channel-fit reasoning.
Key knowledge:
- Wellness Spice / Functional Seasoning: the differentiation play. Almost no Indian competitor sells a superfood blend as an everyday cooking ingredient. Strong white space.
- Shots: the premium-ritual play. Daily dose behaviour, gift-able format, premium shelf placement.
- Gummies: best impulse-retail format but should stay demand-gated behind pre-orders until MOQ economics are justified. Don't over-commit inventory.
- Cubes: shelved — no clear consumer use-case identified yet.
Help reason about ICP, channel selection (D2C vs. quick commerce vs. modern trade), pricing architecture, and launch sequencing.`,
  };

  return prompts[agentId] ?? base;
}

type MessageParam = { role: "user" | "assistant"; content: string };

export async function POST(req: NextRequest) {
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

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1000,
    system: getSystemPrompt(agentId),
    messages: sanitised,
  });

  const reply =
    response.content[0]?.type === "text" ? response.content[0].text : "";

  return NextResponse.json({ reply });
}
