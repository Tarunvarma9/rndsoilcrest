"use client";

import { useState } from "react";
import { FORMATS } from "@/lib/formats";

const MONO  = "var(--font-jetbrains-mono)";
const SERIF = "var(--font-fraunces)";
const SANS  = "Inter, sans-serif";
const AM    = "#F59E0B";
const AM_B  = "rgba(245,158,11,0.08)";
const AM_BR = "rgba(245,158,11,0.18)";
const C     = "#22D3EE";

const STATUS_COLOR: Record<string, string> = {
  Shipped:        "#22C55E",
  Now:            "#22D3EE",
  "3–6 months":  "#F59E0B",
  "6–9 months":  "#A78BFA",
  "Demand-gated":"#D946EF",
  "On hold":      "#6B7280",
};

const FACTS = [
  { value: "6",     label: "Whole Food Ingredients" },
  { value: "8",     label: "Product Formats" },
  { value: "3",     label: "Launch Phases" },
  { value: "100%",  label: "Whole Food. No Isolates." },
];

const INGREDIENTS = [
  { name: "Amla",        function: "Antioxidant · Immunity",   share: "30%" },
  { name: "Beetroot",    function: "Endurance · Vasodilation", share: "20%" },
  { name: "Carrot",      function: "Vision · Skin Health",     share: "15%" },
  { name: "Moringa",     function: "Micronutrients · Energy",  share: "15%" },
  { name: "Ginger",      function: "Digestion · Thermogenesis",share: "10%" },
  { name: "Pomegranate", function: "Antioxidant · Gut Health", share: "10%" },
];

const PILLARS = [
  {
    title: "Whole Food Only",
    body: "Every ingredient is a real food — spray-dried or shade-dried. No isolated compounds. No synthetics. The full nutritional matrix, intact.",
  },
  {
    title: "One Formula, Eight Formats",
    body: "The base formula never changes. What changes is how it reaches you — powder, sachet, shot, tablet. Same six ingredients, every time.",
  },
  {
    title: "Zero Compromise on Labelling",
    body: "Every ingredient listed. Every quantity disclosed. No proprietary blends used as cover for underdosing. Full transparency, always.",
  },
];

export function OverviewPage() {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  async function handleExit() {
    await fetch("/api/logout", { method: "POST" });
    window.location.href = "/";
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--void)", color: "var(--bone)" }}>

      {/* ── Nav ── */}
      <header
        className="sticky top-0 z-30 flex items-center justify-between px-6 py-3 backdrop-blur-md"
        style={{ borderBottom: `1px solid ${AM_BR}`, background: "rgba(2,0,20,0.88)" }}
      >
        <div className="flex items-center gap-3">
          <span className="text-xs tracking-[0.35em] uppercase" style={{ fontFamily: MONO, color: AM }}>
            Soil Crest Naturals
          </span>
          <span style={{ color: AM, opacity: 0.25, fontSize: "10px" }}>·</span>
          <span className="text-xs opacity-30 tracking-widest uppercase hidden sm:block" style={{ fontFamily: MONO, color: "var(--bone)" }}>
            Product Overview
          </span>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/rd"
            className="text-xs px-3 py-1.5 rounded transition-all opacity-40 hover:opacity-90 hidden sm:block"
            style={{
              fontFamily: MONO,
              background: AM_B,
              border: `1px solid ${AM_BR}`,
              color: AM,
              letterSpacing: "0.12em",
              textDecoration: "none",
            }}
          >
            R&D Plan →
          </a>
          <button
            onClick={handleExit}
            className="text-xs px-3 py-1.5 rounded transition-all opacity-35 hover:opacity-80"
            style={{ background: AM_B, border: `1px solid ${AM_BR}`, color: AM, fontFamily: MONO }}
          >
            ⎋ Exit
          </button>
        </div>
      </header>

      {/* ── Hero ── */}
      <div
        className="px-6 py-16 sm:py-24 text-center"
        style={{ borderBottom: `1px solid ${AM_BR}` }}
      >
        <p className="text-xs tracking-[0.4em] uppercase mb-4" style={{ fontFamily: MONO, color: AM, opacity: 0.55 }}>
          Soil Crest Naturals · 2025
        </p>
        <h1
          style={{
            fontFamily: SERIF,
            fontSize: "clamp(2.2rem,6vw,4rem)",
            color: "var(--bone)",
            lineHeight: 1.1,
            fontStyle: "italic",
          }}
        >
          Daily Health Mix
        </h1>
        <p
          className="mt-4 max-w-xl mx-auto"
          style={{ fontFamily: SANS, fontSize: "16px", color: "var(--bone-muted)", opacity: 0.65, lineHeight: 1.8 }}
        >
          Six whole foods. One daily formula. Eight ways to take it.
          Designed for urban Indians who want to eat better — not supplement harder.
        </p>

        {/* Fact pills */}
        <div className="flex flex-wrap justify-center gap-3 mt-10">
          {FACTS.map((f) => (
            <div
              key={f.label}
              className="px-6 py-3 rounded"
              style={{ background: AM_B, border: `1px solid ${AM_BR}` }}
            >
              <p style={{ fontFamily: SERIF, fontSize: "22px", color: AM }}>{f.value}</p>
              <p className="text-xs mt-0.5 opacity-50" style={{ fontFamily: MONO, color: "var(--bone-muted)" }}>
                {f.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 sm:px-10 max-w-4xl mx-auto w-full py-16 space-y-20">

        {/* ── Brand Pillars ── */}
        <section>
          <p className="text-xs tracking-[0.3em] uppercase mb-2" style={{ fontFamily: MONO, color: AM, opacity: 0.55 }}>
            01 · Why We Exist
          </p>
          <h2 className="mb-8" style={{ fontFamily: SERIF, fontSize: "clamp(1.4rem,2.5vw,2rem)", color: "var(--bone)", fontStyle: "italic" }}>
            The three things we refuse to compromise on.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {PILLARS.map((p, i) => (
              <div
                key={i}
                className="rounded-lg p-6 space-y-3"
                style={{ background: AM_B, border: `1px solid ${AM_BR}` }}
              >
                <p className="text-xs" style={{ fontFamily: MONO, color: AM, opacity: 0.45 }}>0{i + 1}</p>
                <h3 style={{ fontFamily: SERIF, fontSize: "16px", color: "var(--bone)" }}>{p.title}</h3>
                <p style={{ fontFamily: SANS, fontSize: "13px", color: "var(--bone-muted)", opacity: 0.7, lineHeight: 1.7 }}>
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        <div style={{ height: 1, background: `linear-gradient(to right, ${AM_BR}, transparent)` }} />

        {/* ── Formula ── */}
        <section>
          <p className="text-xs tracking-[0.3em] uppercase mb-2" style={{ fontFamily: MONO, color: AM, opacity: 0.55 }}>
            02 · The Formula
          </p>
          <h2 className="mb-3" style={{ fontFamily: SERIF, fontSize: "clamp(1.4rem,2.5vw,2rem)", color: "var(--bone)", fontStyle: "italic" }}>
            Six ingredients. Every one earns its place.
          </h2>
          <p className="mb-8 text-sm" style={{ fontFamily: SANS, color: "var(--bone-muted)", opacity: 0.55, lineHeight: 1.7 }}>
            5g per serving. No fillers, no flow agents, no proprietary blends. What you see is all that's in it.
          </p>

          {/* Proportion bar */}
          <div className="flex gap-0.5 h-5 rounded overflow-hidden mb-4" style={{ border: `1px solid ${AM_BR}` }}>
            {INGREDIENTS.map((ing) => (
              <div
                key={ing.name}
                title={`${ing.name} — ${ing.share}`}
                style={{ width: ing.share, background: AM, opacity: 0.1 + parseFloat(ing.share) / 100 }}
              />
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {INGREDIENTS.map((ing) => (
              <div
                key={ing.name}
                className="rounded p-4"
                style={{ background: AM_B, border: `1px solid ${AM_BR}` }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span style={{ fontFamily: SERIF, fontSize: "15px", color: "var(--bone)" }}>{ing.name}</span>
                  <span style={{ fontFamily: MONO, fontSize: "11px", color: AM, opacity: 0.7 }}>{ing.share}</span>
                </div>
                <p style={{ fontFamily: MONO, fontSize: "10px", color: "var(--bone-muted)", opacity: 0.45, letterSpacing: "0.08em" }}>
                  {ing.function}
                </p>
              </div>
            ))}
          </div>
        </section>

        <div style={{ height: 1, background: `linear-gradient(to right, ${AM_BR}, transparent)` }} />

        {/* ── Format Pipeline ── */}
        <section>
          <p className="text-xs tracking-[0.3em] uppercase mb-2" style={{ fontFamily: MONO, color: AM, opacity: 0.55 }}>
            03 · Product Pipeline
          </p>
          <h2 className="mb-3" style={{ fontFamily: SERIF, fontSize: "clamp(1.4rem,2.5vw,2rem)", color: "var(--bone)", fontStyle: "italic" }}>
            Eight formats. Three phases.
          </h2>
          <p className="mb-8 text-sm" style={{ fontFamily: SANS, color: "var(--bone-muted)", opacity: 0.55, lineHeight: 1.7 }}>
            Click any format to see what it is and where it stands.
          </p>

          <div className="space-y-2">
            {FORMATS.map((f) => {
              const color = STATUS_COLOR[f.status] ?? "#6B7280";
              const isOpen = expandedId === f.id;
              return (
                <div
                  key={f.id}
                  className="rounded overflow-hidden transition-all cursor-pointer"
                  style={{ background: isOpen ? `${color}0D` : AM_B, border: `1px solid ${isOpen ? color + "35" : AM_BR}` }}
                  onClick={() => setExpandedId(isOpen ? null : f.id)}
                >
                  <div className="flex items-center justify-between px-5 py-4 gap-4">
                    <div className="flex items-center gap-4 min-w-0">
                      <div style={{ width: 8, height: 8, borderRadius: 4, background: color, flexShrink: 0 }} />
                      <span style={{ fontFamily: SERIF, fontSize: "15px", color: "var(--bone)" }}>{f.name}</span>
                      <span className="text-xs hidden sm:block" style={{ fontFamily: MONO, color: "var(--bone-muted)", opacity: 0.35 }}>
                        {f.phase}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{ fontFamily: MONO, color, background: `${color}12`, border: `1px solid ${color}30` }}
                      >
                        {f.status}
                      </span>
                      <span style={{ color: "var(--bone-muted)", opacity: 0.3, fontSize: "11px" }}>
                        {isOpen ? "▲" : "▼"}
                      </span>
                    </div>
                  </div>

                  {isOpen && (
                    <div className="px-5 pb-5 space-y-2 border-t" style={{ borderColor: `${color}20` }}>
                      <p className="mt-4" style={{ fontFamily: SANS, fontSize: "14px", color: "var(--bone-muted)", opacity: 0.75, lineHeight: 1.7 }}>
                        {f.summary}
                      </p>
                      <p className="text-xs" style={{ fontFamily: MONO, color, opacity: 0.6, lineHeight: 1.6 }}>
                        Formula: {f.formulaNote}
                      </p>
                      <div className="flex gap-4 mt-2">
                        <span className="text-xs" style={{ fontFamily: MONO, color: "var(--bone-muted)", opacity: 0.4 }}>
                          Timeline: {f.timeline}
                        </span>
                        {f.estimatedCost !== "—" && (
                          <span className="text-xs" style={{ fontFamily: MONO, color: AM, opacity: 0.6 }}>
                            Est. investment: {f.estimatedCost}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <div style={{ height: 1, background: `linear-gradient(to right, ${AM_BR}, transparent)` }} />

        {/* ── CTA ── */}
        <section className="text-center space-y-5 pb-4">
          <p className="text-xs tracking-[0.3em] uppercase" style={{ fontFamily: MONO, color: AM, opacity: 0.4 }}>
            04 · Next Steps
          </p>
          <p
            style={{
              fontFamily: SERIF,
              fontSize: "clamp(1.2rem,2vw,1.7rem)",
              color: "var(--bone)",
              fontStyle: "italic",
              lineHeight: 1.6,
            }}
          >
            If this aligns with what you&rsquo;re looking for,<br />
            the conversation starts here.
          </p>
          <p className="text-sm" style={{ fontFamily: SANS, color: "var(--bone-muted)", opacity: 0.5, lineHeight: 1.7 }}>
            For detailed formula specs, sourcing requirements, or regulatory documentation — see the full R&D Plan.
          </p>
          <a
            href="/rd"
            className="inline-block text-xs px-6 py-3 rounded transition-all mt-2"
            style={{
              fontFamily: MONO,
              background: AM_B,
              border: `1px solid ${AM_BR}`,
              color: AM,
              letterSpacing: "0.2em",
              textDecoration: "none",
            }}
          >
            VIEW FULL R&D PLAN →
          </a>
        </section>
      </div>

      {/* ── Footer ── */}
      <footer className="py-5 text-center" style={{ borderTop: `1px solid ${AM_BR}` }}>
        <p className="text-xs opacity-15" style={{ fontFamily: MONO, color: "var(--bone-muted)", letterSpacing: "0.25em" }}>
          SOIL CREST NATURALS · PRODUCT OVERVIEW · CONFIDENTIAL · 2025
        </p>
      </footer>
    </div>
  );
}
