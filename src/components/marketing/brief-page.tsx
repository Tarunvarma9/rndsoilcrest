"use client";

import { useState } from "react";
import { FORMATS } from "@/lib/formats";

const MONO  = "var(--font-jetbrains-mono)";
const SERIF = "var(--font-fraunces)";
const SANS  = "Inter, sans-serif";

// Indigo accent — business / investor tone
const IN    = "#6366F1";
const IN_B  = "rgba(99,102,241,0.08)";
const IN_BR = "rgba(99,102,241,0.2)";
const G     = "#22C55E";
const AM    = "#F59E0B";
const RD    = "#F87171";

const STATUS_COLOR: Record<string, string> = {
  Shipped: G, Now: "#22D3EE",
  "3–6 months": AM, "6–9 months": "#A78BFA",
  "Demand-gated": "#D946EF", "On hold": "#6B7280",
};

// ── Sub-components ─────────────────────────────────────────────────────────────
function SectionLabel({ n, text }: { n: string; text: string }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <span style={{ fontFamily: MONO, fontSize: "11px", color: IN, opacity: 0.45 }}>{n}</span>
      <div style={{ flex: 1, height: 1, background: IN_BR }} />
      <span className="text-xs tracking-[0.25em] uppercase" style={{ fontFamily: MONO, color: IN, opacity: 0.55 }}>
        {text}
      </span>
    </div>
  );
}

function Card({ children, highlight = false }: { children: React.ReactNode; highlight?: boolean }) {
  return (
    <div
      className="rounded-lg p-5"
      style={{
        background: highlight ? "rgba(99,102,241,0.13)" : IN_B,
        border: `1px solid ${highlight ? IN : IN_BR}`,
      }}
    >
      {children}
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────
export function BriefPage() {
  const [openFormat, setOpenFormat] = useState<number | null>(null);

  async function handleExit() {
    await fetch("/api/logout", { method: "POST" });
    window.location.href = "/";
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--void)", color: "var(--bone)" }}>

      {/* ── Nav ── */}
      <header
        className="sticky top-0 z-30 flex items-center justify-between px-6 py-3 backdrop-blur-md"
        style={{ borderBottom: `1px solid ${IN_BR}`, background: "rgba(2,0,20,0.90)" }}
      >
        <div className="flex items-center gap-3">
          <span className="text-xs tracking-[0.35em] uppercase" style={{ fontFamily: MONO, color: IN }}>
            Soil Crest Naturals
          </span>
          <span style={{ color: IN, opacity: 0.25 }}>·</span>
          <span className="text-xs opacity-30 tracking-widest uppercase hidden sm:block" style={{ fontFamily: MONO, color: "var(--bone)" }}>
            Business Plan
          </span>
        </div>
        <button
          onClick={handleExit}
          className="text-xs px-3 py-1.5 rounded transition-all opacity-35 hover:opacity-80"
          style={{ background: IN_B, border: `1px solid ${IN_BR}`, color: IN, fontFamily: MONO }}
        >
          ⎋ Exit
        </button>
      </header>

      {/* ── Cover ── */}
      <div className="px-6 py-16 sm:py-24 max-w-3xl mx-auto w-full">
        <p className="text-xs tracking-[0.4em] uppercase mb-5" style={{ fontFamily: MONO, color: IN, opacity: 0.45 }}>
          Confidential · For Discussion Only · 2025
        </p>
        <h1
          style={{
            fontFamily: SERIF,
            fontSize: "clamp(2.4rem,6vw,4.2rem)",
            color: "var(--bone)",
            lineHeight: 1.1,
            fontStyle: "italic",
          }}
        >
          Soil Crest Naturals
        </h1>
        <p
          className="mt-3 text-lg"
          style={{ fontFamily: SERIF, color: IN, fontStyle: "italic" }}
        >
          Brief Business Plan
        </p>
        <p
          className="mt-5 text-sm max-w-xl"
          style={{ fontFamily: SANS, color: "var(--bone-muted)", opacity: 0.65, lineHeight: 1.9 }}
        >
          A whole-food daily nutrition brand building India&rsquo;s most transparent
          supplement — six real ingredients, zero compromise, eight delivery formats
          designed for the urban Indian lifestyle.
        </p>
      </div>

      {/* ── Body ── */}
      <div className="px-5 sm:px-10 max-w-3xl mx-auto w-full space-y-20 pb-20">

        {/* 01 — Problem ───────────────────────────────────────────────────── */}
        <section>
          <SectionLabel n="01" text="The Problem" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                stat: "₹35,000 Cr",
                label: "Indian supplement market by 2027",
                body: "Growing at 17% CAGR — driven by post-COVID health awareness and rising urban incomes.",
                color: G,
              },
              {
                stat: "< 5%",
                label: "Brands built on whole-food ingredients",
                body: "The vast majority of supplements use isolates, synthetics, and proprietary blends that obscure real dosing.",
                color: RD,
              },
              {
                stat: "Zero",
                label: "Honest daily nutrition habit for most",
                body: "Most urban Indians want to eat better but lack a simple, credible daily nutrition ritual that fits real life.",
                color: AM,
              },
            ].map((item) => (
              <Card key={item.label}>
                <p style={{ fontFamily: SERIF, fontSize: "26px", color: item.color, lineHeight: 1 }}>{item.stat}</p>
                <p className="text-xs mt-2 mb-3 opacity-50" style={{ fontFamily: MONO, color: "var(--bone-muted)" }}>{item.label}</p>
                <p style={{ fontFamily: SANS, fontSize: "13px", color: "var(--bone-muted)", opacity: 0.7, lineHeight: 1.7 }}>{item.body}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* 02 — Solution ──────────────────────────────────────────────────── */}
        <section>
          <SectionLabel n="02" text="The Solution" />
          <Card highlight>
            <p className="text-xs mb-4" style={{ fontFamily: MONO, color: IN, opacity: 0.6, letterSpacing: "0.2em" }}>
              DAILY HEALTH MIX · SOIL CREST NATURALS
            </p>
            <p
              style={{
                fontFamily: SERIF,
                fontSize: "clamp(1.3rem,2vw,1.7rem)",
                color: "var(--bone)",
                fontStyle: "italic",
                lineHeight: 1.6,
              }}
            >
              Six whole foods — Amla, Beetroot, Carrot, Moringa, Ginger, Pomegranate —
              spray-dried and shade-dried to preserve every bioactive compound.
              One formula. Eight formats. Taken daily.
            </p>
          </Card>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            {[
              { title: "No Isolates",       body: "Only real foods. The full nutritional matrix — not extracted fractions." },
              { title: "Full Transparency", body: "Every ingredient listed with its exact percentage. No proprietary blend cover." },
              { title: "One Habit, 8 Ways", body: "Powder → Sachet → Shot → Tablet. Same formula, delivered how you live." },
            ].map((p) => (
              <div
                key={p.title}
                className="rounded-lg p-4"
                style={{ background: IN_B, border: `1px solid ${IN_BR}` }}
              >
                <p className="mb-2" style={{ fontFamily: SERIF, fontSize: "15px", color: IN }}>{p.title}</p>
                <p style={{ fontFamily: SANS, fontSize: "13px", color: "var(--bone-muted)", opacity: 0.7, lineHeight: 1.7 }}>{p.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 03 — Market ────────────────────────────────────────────────────── */}
        <section>
          <SectionLabel n="03" text="Market Opportunity" />
          <div className="space-y-3">
            {[
              {
                label: "Total Addressable Market",
                value: "₹35,000 Cr",
                note: "Indian nutraceutical & supplement market (2027 projection, IBEF)",
              },
              {
                label: "Serviceable Market — Urban Whole Food",
                value: "₹2,500–4,000 Cr",
                note: "Health-aware urban adults 25–45, Tier 1 & Tier 2 cities, willing to pay premium for clean labels",
              },
              {
                label: "Initial Target (Year 1–2)",
                value: "₹2–5 Cr ARR",
                note: "D2C + WhatsApp + early quick-commerce. 4,000–10,000 customers at ₹499–599/month",
              },
            ].map((row) => (
              <div
                key={row.label}
                className="flex items-start justify-between gap-4 p-4 rounded-lg"
                style={{ background: IN_B, border: `1px solid ${IN_BR}` }}
              >
                <div>
                  <p style={{ fontFamily: SANS, fontSize: "14px", color: "var(--bone)", lineHeight: 1.4 }}>{row.label}</p>
                  <p className="text-xs mt-1" style={{ fontFamily: MONO, color: "var(--bone-muted)", opacity: 0.4, lineHeight: 1.5 }}>{row.note}</p>
                </div>
                <span
                  className="shrink-0"
                  style={{ fontFamily: SERIF, fontSize: "20px", color: IN, whiteSpace: "nowrap" }}
                >
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* 04 — Product Pipeline ──────────────────────────────────────────── */}
        <section>
          <SectionLabel n="04" text="Product Pipeline" />
          <p className="mb-5 text-sm" style={{ fontFamily: SANS, color: "var(--bone-muted)", opacity: 0.55, lineHeight: 1.7 }}>
            Eight formats across three phases. Tap to expand any format.
          </p>
          <div className="space-y-2">
            {FORMATS.map((f) => {
              const color = STATUS_COLOR[f.status] ?? "#6B7280";
              const isOpen = openFormat === f.id;
              return (
                <div
                  key={f.id}
                  className="rounded overflow-hidden cursor-pointer transition-all"
                  style={{
                    background: isOpen ? `${color}0D` : IN_B,
                    border: `1px solid ${isOpen ? color + "35" : IN_BR}`,
                  }}
                  onClick={() => setOpenFormat(isOpen ? null : f.id)}
                >
                  <div className="flex items-center justify-between px-5 py-3.5 gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div style={{ width: 7, height: 7, borderRadius: 3.5, background: color, flexShrink: 0 }} />
                      <span style={{ fontFamily: SERIF, fontSize: "15px", color: "var(--bone)" }}>{f.name}</span>
                      <span className="text-xs hidden sm:block" style={{ fontFamily: MONO, color: "var(--bone-muted)", opacity: 0.3 }}>{f.phase}</span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ fontFamily: MONO, color, background: `${color}12`, border: `1px solid ${color}30` }}>
                        {f.status}
                      </span>
                      <span style={{ color: "var(--bone-muted)", opacity: 0.25, fontSize: "11px" }}>{isOpen ? "▲" : "▼"}</span>
                    </div>
                  </div>
                  {isOpen && (
                    <div className="px-5 pb-4 pt-1 border-t space-y-2" style={{ borderColor: `${color}20` }}>
                      <p style={{ fontFamily: SANS, fontSize: "13px", color: "var(--bone-muted)", opacity: 0.75, lineHeight: 1.7 }}>{f.summary}</p>
                      <div className="flex flex-wrap gap-4">
                        <span className="text-xs" style={{ fontFamily: MONO, color: "var(--bone-muted)", opacity: 0.4 }}>Timeline: {f.timeline}</span>
                        {f.estimatedCost !== "—" && (
                          <span className="text-xs" style={{ fontFamily: MONO, color: AM, opacity: 0.7 }}>Investment: {f.estimatedCost}</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* 05 — Business Model ─────────────────────────────────────────────── */}
        <section>
          <SectionLabel n="05" text="Business Model" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                channel: "Direct-to-Consumer (D2C)",
                model: "Website + WhatsApp orders",
                margin: "65–70% gross margin",
                note: "Primary channel. Full brand control. Customer data owned.",
                color: IN,
              },
              {
                channel: "Quick Commerce",
                model: "Blinkit · Zepto · Swiggy Instamart",
                margin: "40–50% gross margin",
                note: "Phase 2 entry for sachets and shots. Discovery engine.",
                color: G,
              },
              {
                channel: "Modern Trade",
                model: "Health stores · pharmacies",
                margin: "35–45% gross margin",
                note: "Phase 3. Gummies and tablets. Retail shelf credibility.",
                color: AM,
              },
              {
                channel: "Subscription",
                model: "Monthly refill — website",
                margin: "72–75% gross margin",
                note: "LTV maximisation. 30-day refill cycle. 85%+ retention target.",
                color: "#A78BFA",
              },
            ].map((ch) => (
              <div key={ch.channel} className="rounded-lg p-5" style={{ background: IN_B, border: `1px solid ${IN_BR}` }}>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <p style={{ fontFamily: SERIF, fontSize: "15px", color: "var(--bone)" }}>{ch.channel}</p>
                  <span className="text-xs px-2 py-0.5 rounded" style={{ fontFamily: MONO, color: ch.color, background: `${ch.color}12`, border: `1px solid ${ch.color}28`, whiteSpace: "nowrap" }}>
                    {ch.margin}
                  </span>
                </div>
                <p className="text-xs mb-2" style={{ fontFamily: MONO, color: ch.color, opacity: 0.6 }}>{ch.model}</p>
                <p style={{ fontFamily: SANS, fontSize: "13px", color: "var(--bone-muted)", opacity: 0.65, lineHeight: 1.6 }}>{ch.note}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 06 — Pricing ───────────────────────────────────────────────────── */}
        <section>
          <SectionLabel n="06" text="Pricing Strategy" />
          <div className="overflow-x-auto">
            <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${IN_BR}` }}>
                  {["Format", "Pack Size", "Price", "Per-Day Cost", "Phase"].map((h) => (
                    <th key={h} className="text-left py-3 pr-6" style={{ fontFamily: MONO, fontSize: "10px", color: "var(--bone-muted)", opacity: 0.45, letterSpacing: "0.1em" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "Powder",             pack: "250g / 50 servings", price: "₹499",   ppd: "₹10",   phase: "Live" },
                  { name: "Sachet",              pack: "Box of 30",          price: "₹599",   ppd: "₹20",   phase: "Phase 1" },
                  { name: "Sachet — Trial",      pack: "7-day pack",         price: "₹149",   ppd: "₹21",   phase: "Phase 1" },
                  { name: "Wellness Spice",      pack: "180g jar",           price: "₹449",   ppd: "₹15",   phase: "Phase 1" },
                  { name: "Nutrition Shot",      pack: "Pack of 6",          price: "₹699",   ppd: "₹116",  phase: "Phase 2" },
                  { name: "Nutrition Shot (sub)","pack": "30/month",         price: "₹2,499", ppd: "₹83",   phase: "Phase 2" },
                  { name: "Tablets",             pack: "90 tablets",         price: "₹799",   ppd: "₹53",   phase: "Phase 3" },
                  { name: "Gummies",             pack: "30-count jar",       price: "₹599",   ppd: "₹20",   phase: "Phase 3" },
                ].map((row, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid rgba(99,102,241,0.07)` }}>
                    <td className="py-3 pr-6" style={{ fontFamily: SERIF, fontSize: "14px", color: "var(--bone)" }}>{row.name}</td>
                    <td className="py-3 pr-6" style={{ fontFamily: SANS, fontSize: "13px", color: "var(--bone-muted)", opacity: 0.55 }}>{row.pack}</td>
                    <td className="py-3 pr-6" style={{ fontFamily: MONO, fontSize: "14px", color: IN }}>{row.price}</td>
                    <td className="py-3 pr-6" style={{ fontFamily: MONO, fontSize: "12px", color: G, opacity: 0.7 }}>{row.ppd}</td>
                    <td className="py-3" style={{ fontFamily: MONO, fontSize: "11px", color: "var(--bone-muted)", opacity: 0.35 }}>{row.phase}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 07 — Go-to-Market ──────────────────────────────────────────────── */}
        <section>
          <SectionLabel n="07" text="Go-to-Market" />
          <div className="space-y-3">
            {[
              {
                phase: "Now — Month 3",
                title: "Own the D2C Core",
                steps: [
                  "Launch sachets + wellness spice + functional seasoning",
                  "WhatsApp-first community (daily tip, recipe, reorder)",
                  "Instagram content — ingredient sourcing, formula story, transparency",
                  "Referral programme: ₹100 off for every friend who orders",
                ],
                color: G,
              },
              {
                phase: "Month 3–6",
                title: "Enter Quick Commerce",
                steps: [
                  "Sachet trial packs on Blinkit + Zepto (₹149 entry point)",
                  "Nutrition shots launch — premium ritual positioning",
                  "Influencer seeding — fitness, nutrition, chef communities",
                  "Email flows for D2C: welcome → education → subscription pitch",
                ],
                color: "#22D3EE",
              },
              {
                phase: "Month 6–12",
                title: "Phase 3 + Retail",
                steps: [
                  "Tablet launch — subscription-first, then retail",
                  "Modern trade pilots: Apollo, Wellness Forever, health stores",
                  "Gummies (demand-gated) — launch only if pre-order waitlist > 500",
                  "Corporate wellness partnerships (B2B channel)",
                ],
                color: AM,
              },
            ].map((phase) => (
              <div key={phase.phase} className="rounded-lg overflow-hidden" style={{ border: `1px solid ${IN_BR}` }}>
                <div className="flex items-center gap-4 px-5 py-4" style={{ background: IN_B }}>
                  <div style={{ width: 8, height: 8, borderRadius: 4, background: phase.color, flexShrink: 0 }} />
                  <div>
                    <p className="text-xs" style={{ fontFamily: MONO, color: phase.color, opacity: 0.6 }}>{phase.phase}</p>
                    <p style={{ fontFamily: SERIF, fontSize: "16px", color: "var(--bone)" }}>{phase.title}</p>
                  </div>
                </div>
                <div className="px-5 py-4 space-y-2">
                  {phase.steps.map((s, i) => (
                    <div key={i} className="flex gap-3">
                      <span style={{ color: phase.color, opacity: 0.5, fontFamily: MONO, fontSize: "12px", flexShrink: 0, marginTop: 2 }}>›</span>
                      <p style={{ fontFamily: SANS, fontSize: "13px", color: "var(--bone-muted)", opacity: 0.75, lineHeight: 1.6 }}>{s}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 08 — Financials ─────────────────────────────────────────────────── */}
        <section>
          <SectionLabel n="08" text="Financial Snapshot" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card>
              <p className="text-xs mb-4" style={{ fontFamily: MONO, color: IN, opacity: 0.5 }}>R&D INVESTMENT REQUIRED</p>
              <div className="space-y-2">
                {[
                  { label: "Phase 1 (0–3 months)", value: "₹3–6L" },
                  { label: "Phase 2 (3–6 months)", value: "₹2–5L" },
                  { label: "Phase 3 (6–9 months)", value: "₹7–18L" },
                  { label: "Total (excl. Gummies)", value: "₹12–29L" },
                ].map((r) => (
                  <div key={r.label} className="flex justify-between items-center py-1.5" style={{ borderBottom: `1px solid ${IN_BR}` }}>
                    <span style={{ fontFamily: SANS, fontSize: "13px", color: "var(--bone-muted)", opacity: 0.65 }}>{r.label}</span>
                    <span style={{ fontFamily: MONO, fontSize: "14px", color: r.label.includes("Total") ? IN : AM }}>{r.value}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <p className="text-xs mb-4" style={{ fontFamily: MONO, color: G, opacity: 0.5 }}>REVENUE TARGETS</p>
              <div className="space-y-2">
                {[
                  { label: "Year 1 — D2C only",    value: "₹25–50L" },
                  { label: "Year 2 — Multi-channel",value: "₹1.5–3 Cr" },
                  { label: "Year 3 — Scaled",       value: "₹5–12 Cr" },
                  { label: "Gross Margin (D2C)",    value: "65–70%" },
                ].map((r) => (
                  <div key={r.label} className="flex justify-between items-center py-1.5" style={{ borderBottom: `1px solid rgba(34,197,94,0.12)` }}>
                    <span style={{ fontFamily: SANS, fontSize: "13px", color: "var(--bone-muted)", opacity: 0.65 }}>{r.label}</span>
                    <span style={{ fontFamily: MONO, fontSize: "14px", color: G }}>{r.value}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="mt-4 rounded-lg p-4" style={{ background: "rgba(248,113,113,0.06)", border: "1px solid rgba(248,113,113,0.15)" }}>
            <p className="text-xs" style={{ fontFamily: MONO, color: RD, opacity: 0.6, lineHeight: 1.7 }}>
              Note: Financial projections are based on conservative D2C assumptions. Actual figures depend on marketing spend, retention rates, and phase execution timelines. Verify all numbers with a financial advisor before committing capital.
            </p>
          </div>
        </section>

        {/* 09 — Competitive Moat ──────────────────────────────────────────── */}
        <section>
          <SectionLabel n="09" text="Competitive Moat" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { title: "Formula Integrity",   body: "Six whole foods. No isolates. The complete food matrix is the product — not a marketing claim. This cannot be easily copied without rebuilding the sourcing chain.", color: IN },
              { title: "Radical Transparency",body: "Every ingredient at its exact percentage. In a market of proprietary blends, full disclosure is both a differentiator and a trust engine.", color: G },
              { title: "Eight-Format Moat",   body: "One formula, multiple expressions. As each format launches, the brand vocabulary deepens. Competitors have to replicate the whole system, not just the formula.", color: AM },
              { title: "Community First",     body: "WhatsApp-first distribution builds a direct relationship with every customer. No algorithm dependency. No margin sharing with a marketplace at inception.", color: "#A78BFA" },
            ].map((m) => (
              <div key={m.title} className="rounded-lg p-5" style={{ background: IN_B, border: `1px solid ${IN_BR}` }}>
                <div style={{ width: 32, height: 3, background: m.color, marginBottom: 12, borderRadius: 2, opacity: 0.7 }} />
                <p className="mb-2" style={{ fontFamily: SERIF, fontSize: "15px", color: "var(--bone)" }}>{m.title}</p>
                <p style={{ fontFamily: SANS, fontSize: "13px", color: "var(--bone-muted)", opacity: 0.7, lineHeight: 1.7 }}>{m.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 10 — Ask / Close ───────────────────────────────────────────────── */}
        <section>
          <SectionLabel n="10" text="The Ask" />
          <Card highlight>
            <p
              style={{
                fontFamily: SERIF,
                fontSize: "clamp(1.2rem,2vw,1.6rem)",
                color: "var(--bone)",
                fontStyle: "italic",
                lineHeight: 1.7,
              }}
            >
              We are building the most honest daily nutrition brand in India.
              The formula is proven. The pipeline is defined. The market is ready.
            </p>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: "Strategic Partners",   note: "Co-packers, CMOs, ingredient suppliers aligned with clean-label standards." },
                { label: "Distribution",          note: "Quick commerce ops, modern trade buyers, and community channel partners." },
                { label: "Capital (Series Pre-A)","note": "₹50L–1.5 Cr to fund R&D phases 2–3, marketing, and team expansion." },
              ].map((ask) => (
                <div key={ask.label} className="rounded p-4" style={{ background: "rgba(2,0,20,0.4)", border: `1px solid ${IN_BR}` }}>
                  <p className="mb-2" style={{ fontFamily: SERIF, fontSize: "14px", color: IN }}>{ask.label}</p>
                  <p style={{ fontFamily: SANS, fontSize: "12px", color: "var(--bone-muted)", opacity: 0.65, lineHeight: 1.6 }}>{ask.note}</p>
                </div>
              ))}
            </div>
          </Card>
        </section>

      </div>

      {/* ── Footer ── */}
      <footer className="py-5 text-center" style={{ borderTop: `1px solid ${IN_BR}` }}>
        <p className="text-xs opacity-15" style={{ fontFamily: MONO, color: "var(--bone-muted)", letterSpacing: "0.25em" }}>
          SOIL CREST NATURALS · BRIEF BUSINESS PLAN · CONFIDENTIAL · FOR DISCUSSION ONLY · 2025
        </p>
      </footer>
    </div>
  );
}
