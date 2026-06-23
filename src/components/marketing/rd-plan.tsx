"use client";

import { useState } from "react";
import {
  VISION,
  CORE_FORMULA,
  FORMAT_ADAPTATIONS,
  REGULATORY_MAP,
  INVESTMENT_SUMMARY,
  type Ingredient,
  type FormatAdaptation,
} from "@/lib/rd-plan";

// ── Tokens ────────────────────────────────────────────────────────────────────
const MONO  = "var(--font-jetbrains-mono)";
const SERIF = "var(--font-fraunces)";
const SANS  = "Inter, sans-serif";

const V   = "#8B5CF6";
const C   = "#22D3EE";
const G   = "#22C55E";
const AM  = "#F59E0B";
const RD  = "#F87171";
const V_B = "rgba(139,92,246,0.12)";
const V_BR= "rgba(139,92,246,0.2)";
const C_B = "rgba(34,211,238,0.08)";
const C_BR= "rgba(34,211,238,0.18)";

const STATUS_COLOR: Record<string, string> = {
  "Live":          G,
  "Shipped":       G,
  "0–3 months":   C,
  "3–6 months":   AM,
  "6–9 months":   V,
  "Demand-gated": "#D946EF",
  "On hold":      "#6B7280",
};

// ── Shared primitives ─────────────────────────────────────────────────────────
function Label({ children, color = C }: { children: React.ReactNode; color?: string }) {
  return (
    <span
      className="text-xs tracking-[0.3em] uppercase block mb-2"
      style={{ fontFamily: MONO, color, opacity: 0.6 }}
    >
      {children}
    </span>
  );
}

function Card({ children, accent = V_BR }: { children: React.ReactNode; accent?: string }) {
  return (
    <div
      className="rounded-lg p-6"
      style={{ background: V_B, border: `1px solid ${accent}` }}
    >
      {children}
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const color = STATUS_COLOR[status] ?? "#6B7280";
  return (
    <span
      className="text-xs px-2 py-0.5 rounded-full"
      style={{
        fontFamily: MONO,
        color,
        background: `${color}18`,
        border: `1px solid ${color}40`,
      }}
    >
      {status}
    </span>
  );
}

// ── Section: Vision ───────────────────────────────────────────────────────────
function VisionSection() {
  return (
    <section className="space-y-8">
      <div>
        <Label>FIG. RD-01 · Brand Vision</Label>
        <h2 style={{ fontFamily: SERIF, fontSize: "clamp(1.6rem,3vw,2.4rem)", color: "var(--bone)", fontStyle: "italic", lineHeight: 1.2 }}>
          {VISION.tagline}
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <Label color={V}>Mission</Label>
          <p style={{ fontFamily: SANS, fontSize: "14px", lineHeight: 1.8, color: "var(--bone-muted)", opacity: 0.85 }}>
            {VISION.mission}
          </p>
        </Card>
        <Card>
          <Label color={AM}>Target Customer</Label>
          <p style={{ fontFamily: SANS, fontSize: "14px", lineHeight: 1.8, color: "var(--bone-muted)", opacity: 0.85 }}>
            {VISION.targetCustomer}
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {VISION.philosophy.map((p, i) => (
          <div
            key={i}
            className="rounded-lg p-5"
            style={{ background: C_B, border: `1px solid ${C_BR}` }}
          >
            <div
              className="text-xs mb-3"
              style={{ fontFamily: MONO, color: C, opacity: 0.4 }}
            >
              0{i + 1}
            </div>
            <p style={{ fontFamily: SANS, fontSize: "13px", lineHeight: 1.8, color: "var(--bone-muted)", opacity: 0.8 }}>
              {p}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Section: Core Formula ─────────────────────────────────────────────────────
function IngCard({ ing }: { ing: Ingredient }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="rounded-lg overflow-hidden cursor-pointer transition-all"
      style={{
        background: open ? "rgba(139,92,246,0.15)" : V_B,
        border: `1px solid ${open ? V : V_BR}`,
      }}
      onClick={() => setOpen(!open)}
    >
      {/* Header row */}
      <div className="flex items-center justify-between p-4 gap-4">
        <div className="flex items-center gap-4 min-w-0">
          {/* percent bar */}
          <div className="shrink-0 flex flex-col items-center gap-1" style={{ width: 36 }}>
            <span style={{ fontFamily: MONO, fontSize: "18px", color: V, fontWeight: 600 }}>
              {ing.percentBase}
            </span>
            <span style={{ fontFamily: MONO, fontSize: "9px", color: "var(--bone-muted)", opacity: 0.5 }}>
              %
            </span>
          </div>
          <div className="min-w-0">
            <p style={{ fontFamily: SERIF, fontSize: "16px", color: "var(--bone)" }}>{ing.name}</p>
            <p style={{ fontFamily: MONO, fontSize: "10px", color: "var(--bone-muted)", opacity: 0.45, fontStyle: "italic" }}>
              {ing.botanicalName}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span
            className="text-xs px-2 py-0.5 rounded"
            style={{ fontFamily: MONO, color: C, background: C_B, border: `1px solid ${C_BR}` }}
          >
            {ing.perServing}
          </span>
          <span style={{ color: "var(--bone-muted)", opacity: 0.3, fontSize: "12px" }}>
            {open ? "▲" : "▼"}
          </span>
        </div>
      </div>

      {/* Percent bar */}
      <div style={{ height: 2, background: "rgba(139,92,246,0.08)" }}>
        <div style={{ height: 2, width: `${ing.percentBase}%`, background: V, opacity: 0.5 }} />
      </div>

      {/* Expanded detail */}
      {open && (
        <div className="p-4 pt-5 grid grid-cols-1 sm:grid-cols-2 gap-5 border-t" style={{ borderColor: V_BR }}>
          <div>
            <p className="text-xs mb-1.5" style={{ fontFamily: MONO, color: AM, opacity: 0.6 }}>FORM</p>
            <p style={{ fontFamily: SANS, fontSize: "13px", color: "var(--bone-muted)", lineHeight: 1.6 }}>{ing.form}</p>
          </div>
          <div>
            <p className="text-xs mb-1.5" style={{ fontFamily: MONO, color: AM, opacity: 0.6 }}>FUNCTION</p>
            <p style={{ fontFamily: SANS, fontSize: "13px", color: "var(--bone-muted)", lineHeight: 1.6 }}>{ing.function}</p>
          </div>
          <div>
            <p className="text-xs mb-2" style={{ fontFamily: MONO, color: V, opacity: 0.6 }}>KEY BIOACTIVES</p>
            <div className="flex flex-wrap gap-1.5">
              {ing.keyBioactives.map((b) => (
                <span
                  key={b}
                  className="text-xs px-2 py-0.5 rounded"
                  style={{ fontFamily: MONO, color: V, background: V_B, border: `1px solid ${V_BR}` }}
                >
                  {b}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs mb-1.5" style={{ fontFamily: MONO, color: G, opacity: 0.6 }}>BIOAVAILABILITY</p>
            <p style={{ fontFamily: SANS, fontSize: "13px", color: "var(--bone-muted)", lineHeight: 1.6 }}>{ing.bioavailabilityNote}</p>
          </div>
          <div>
            <p className="text-xs mb-1.5" style={{ fontFamily: MONO, color: C, opacity: 0.6 }}>SOURCING</p>
            <p style={{ fontFamily: SANS, fontSize: "13px", color: "var(--bone-muted)", lineHeight: 1.6 }}>{ing.sourcing}</p>
          </div>
          <div>
            <p className="text-xs mb-1.5" style={{ fontFamily: MONO, color: RD, opacity: 0.6 }}>QA FLAG</p>
            <p style={{ fontFamily: SANS, fontSize: "13px", color: "var(--bone-muted)", lineHeight: 1.6 }}>{ing.qaFlag}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function FormulaSection() {
  return (
    <section className="space-y-5">
      <div>
        <Label>FIG. RD-02 · Core Formula</Label>
        <h2 style={{ fontFamily: SERIF, fontSize: "clamp(1.4rem,2.5vw,2rem)", color: "var(--bone)", fontStyle: "italic" }}>
          Daily Health Mix — Base Formula v1.2
        </h2>
        <p className="mt-2 text-sm" style={{ fontFamily: SANS, color: "var(--bone-muted)", opacity: 0.55, lineHeight: 1.7 }}>
          5g per serving. All six ingredients unchanged across the base formula. Format adaptations are downstream derivations.
          Click any ingredient to expand the full specification.
        </p>
      </div>

      {/* Serving size bar */}
      <div className="flex gap-0.5 h-6 rounded overflow-hidden" style={{ border: `1px solid ${V_BR}` }}>
        {CORE_FORMULA.map((ing) => (
          <div
            key={ing.name}
            title={`${ing.name} — ${ing.percentBase}%`}
            style={{ width: `${ing.percentBase}%`, background: V, opacity: 0.15 + ing.percentBase / 100 }}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-3">
        {CORE_FORMULA.map((ing) => (
          <div key={ing.name} className="flex items-center gap-1.5">
            <div style={{ width: 8, height: 8, borderRadius: 2, background: V, opacity: 0.15 + ing.percentBase / 100 }} />
            <span style={{ fontFamily: MONO, fontSize: "10px", color: "var(--bone-muted)", opacity: 0.5 }}>
              {ing.name} {ing.percentBase}%
            </span>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        {CORE_FORMULA.map((ing) => (
          <IngCard key={ing.name} ing={ing} />
        ))}
      </div>
    </section>
  );
}

// ── Section: Format Pipeline ──────────────────────────────────────────────────
function FormatCard({ fa }: { fa: FormatAdaptation }) {
  const [tab, setTab] = useState<"formula" | "rd" | "commercial">("formula");
  const statusColor = STATUS_COLOR[fa.status] ?? "#6B7280";

  return (
    <div
      className="rounded-lg overflow-hidden"
      style={{ background: V_B, border: `1px solid ${V_BR}` }}
    >
      {/* Header */}
      <div className="p-5 border-b" style={{ borderColor: V_BR }}>
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <p style={{ fontFamily: MONO, fontSize: "10px", color: "var(--bone-muted)", opacity: 0.4 }}>{fa.phase}</p>
            <h3 style={{ fontFamily: SERIF, fontSize: "20px", color: "var(--bone)" }}>{fa.formatName}</h3>
          </div>
          <StatusPill status={fa.status} />
        </div>
        <p style={{ fontFamily: SANS, fontSize: "13px", color: "var(--bone-muted)", opacity: 0.7, lineHeight: 1.7 }}>
          {fa.vision}
        </p>
        <p className="mt-2 text-xs" style={{ fontFamily: MONO, color: C, opacity: 0.5 }}>
          Habit: {fa.targetHabit}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex" style={{ borderBottom: `1px solid ${V_BR}` }}>
        {(["formula", "rd", "commercial"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-4 py-2.5 text-xs uppercase tracking-widest transition-all"
            style={{
              fontFamily: MONO,
              color: tab === t ? V : "var(--bone-muted)",
              borderBottom: tab === t ? `2px solid ${V}` : "2px solid transparent",
              opacity: tab === t ? 1 : 0.4,
            }}
          >
            {t === "formula" ? "Formula" : t === "rd" ? "R&D Steps" : "Commercial"}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="p-5">
        {tab === "formula" && (
          <div className="space-y-4">
            <p style={{ fontFamily: SANS, fontSize: "13px", color: "var(--bone-muted)", opacity: 0.7, lineHeight: 1.7 }}>
              <span style={{ color: V, opacity: 0.8 }}>Formula shift:</span> {fa.formulaShift}
            </p>
            <table className="w-full text-xs" style={{ borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${V_BR}` }}>
                  {["Ingredient", "Share", "Note"].map((h) => (
                    <th key={h} className="text-left py-2 pr-4" style={{ fontFamily: MONO, color: "var(--bone-muted)", opacity: 0.4 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {fa.ingredientRatios.map((r) => (
                  <tr key={r.name} style={{ borderBottom: `1px solid rgba(139,92,246,0.08)` }}>
                    <td className="py-2 pr-4" style={{ fontFamily: SERIF, fontSize: "13px", color: "var(--bone)" }}>{r.name}</td>
                    <td className="py-2 pr-4" style={{ fontFamily: MONO, color: r.share === "—" ? "#6B7280" : V }}>{r.share}</td>
                    <td className="py-2" style={{ fontFamily: SANS, color: "var(--bone-muted)", opacity: 0.55, lineHeight: 1.5 }}>{r.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-xs pt-2" style={{ fontFamily: MONO, color: "var(--bone-muted)", opacity: 0.4 }}>
              Packaging: {fa.packagingSpec}
            </p>
          </div>
        )}

        {tab === "rd" && (
          <div className="space-y-2">
            {fa.rdMilestones.map((m, i) => (
              <div
                key={i}
                className="flex gap-4 p-3 rounded"
                style={{ background: "rgba(139,92,246,0.06)", border: `1px solid ${V_BR}` }}
              >
                <div className="shrink-0 mt-0.5">
                  <div style={{ width: 6, height: 6, borderRadius: 3, background: V, opacity: 0.6 }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p style={{ fontFamily: SANS, fontSize: "13px", color: "var(--bone)", lineHeight: 1.5 }}>{m.step}</p>
                  <div className="flex gap-3 mt-1">
                    <span style={{ fontFamily: MONO, fontSize: "10px", color: AM, opacity: 0.6 }}>{m.owner}</span>
                    <span style={{ fontFamily: MONO, fontSize: "10px", color: "var(--bone-muted)", opacity: 0.4 }}>{m.deadline}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "commercial" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs mb-1.5" style={{ fontFamily: MONO, color: AM, opacity: 0.6 }}>INVESTMENT</p>
                <p style={{ fontFamily: SERIF, fontSize: "20px", color: AM }}>{fa.investmentRange}</p>
              </div>
              <div>
                <p className="text-xs mb-1.5" style={{ fontFamily: MONO, color: G, opacity: 0.6 }}>REGULATORY</p>
                <p style={{ fontFamily: SANS, fontSize: "13px", color: "var(--bone-muted)", lineHeight: 1.6 }}>{fa.regulatory}</p>
              </div>
            </div>
            <div>
              <p className="text-xs mb-1.5" style={{ fontFamily: MONO, color: C, opacity: 0.6 }}>REVENUE MODEL</p>
              <p style={{ fontFamily: SANS, fontSize: "13px", color: "var(--bone-muted)", lineHeight: 1.7 }}>{fa.revenueModel}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PipelineSection() {
  return (
    <section className="space-y-5">
      <div>
        <Label>FIG. RD-03 · Format Pipeline</Label>
        <h2 style={{ fontFamily: SERIF, fontSize: "clamp(1.4rem,2.5vw,2rem)", color: "var(--bone)", fontStyle: "italic" }}>
          Eight formats. One formula.
        </h2>
        <p className="mt-2 text-sm" style={{ fontFamily: SANS, color: "var(--bone-muted)", opacity: 0.55, lineHeight: 1.7 }}>
          Each card shows how the base formula adapts to the format's delivery context — what changes, what holds, and what needs to be built.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {FORMAT_ADAPTATIONS.map((fa) => (
          <FormatCard key={fa.formatId} fa={fa} />
        ))}
      </div>
    </section>
  );
}

// ── Section: Regulatory Map ───────────────────────────────────────────────────
function RegulatorySection() {
  const COMPLEXITY_COLOR: Record<string, string> = { Low: G, Medium: AM, High: RD };

  return (
    <section className="space-y-5">
      <div>
        <Label>FIG. RD-04 · Regulatory Roadmap</Label>
        <h2 style={{ fontFamily: SERIF, fontSize: "clamp(1.4rem,2.5vw,2rem)", color: "var(--bone)", fontStyle: "italic" }}>
          FSSAI Category Map
        </h2>
        <p className="mt-2 text-sm" style={{ fontFamily: SANS, color: "var(--bone-muted)", opacity: 0.55, lineHeight: 1.7 }}>
          Eight formats span three distinct FSSAI licensing categories. Complexity and timeline vary significantly across them.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {REGULATORY_MAP.map((cat) => {
          const cc = COMPLEXITY_COLOR[cat.complexity];
          return (
            <div
              key={cat.category}
              className="rounded-lg p-5 space-y-4"
              style={{ background: `${cc}0D`, border: `1px solid ${cc}30` }}
            >
              <div>
                <p className="text-xs mb-1" style={{ fontFamily: MONO, color: cc, opacity: 0.6 }}>{cat.complexity} Complexity · {cat.approxTime}</p>
                <h3 style={{ fontFamily: SERIF, fontSize: "17px", color: "var(--bone)" }}>{cat.category}</h3>
                <p className="text-xs mt-0.5" style={{ fontFamily: MONO, color: "var(--bone-muted)", opacity: 0.35 }}>{cat.fssaiSchedule}</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {cat.formats.map((f) => (
                  <span
                    key={f}
                    className="text-xs px-2 py-0.5 rounded"
                    style={{ fontFamily: MONO, color: cc, background: `${cc}10`, border: `1px solid ${cc}25` }}
                  >
                    {f}
                  </span>
                ))}
              </div>
              <ul className="space-y-1.5">
                {cat.keyRequirements.map((r) => (
                  <li
                    key={r}
                    className="text-xs flex gap-2"
                    style={{ fontFamily: SANS, color: "var(--bone-muted)", opacity: 0.7, lineHeight: 1.6 }}
                  >
                    <span style={{ color: cc, opacity: 0.5, flexShrink: 0 }}>·</span>
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ── Section: Investment ───────────────────────────────────────────────────────
function InvestmentSection() {
  return (
    <section className="space-y-5">
      <div>
        <Label>FIG. RD-05 · Investment Overview</Label>
        <h2 style={{ fontFamily: SERIF, fontSize: "clamp(1.4rem,2.5vw,2rem)", color: "var(--bone)", fontStyle: "italic" }}>
          Phase-wise capital requirement
        </h2>
      </div>
      <div className="space-y-2">
        {INVESTMENT_SUMMARY.map((row, i) => {
          const isTotal = i === INVESTMENT_SUMMARY.length - 1;
          return (
            <div
              key={i}
              className="flex items-center justify-between gap-4 p-4 rounded-lg"
              style={{
                background: isTotal ? "rgba(139,92,246,0.15)" : V_B,
                border: `1px solid ${isTotal ? V : V_BR}`,
              }}
            >
              <div>
                <p style={{ fontFamily: isTotal ? SERIF : SANS, fontSize: isTotal ? "15px" : "14px", color: "var(--bone)", fontStyle: isTotal ? "italic" : "normal" }}>
                  {row.phase}
                </p>
                <p className="text-xs mt-0.5" style={{ fontFamily: MONO, color: "var(--bone-muted)", opacity: 0.4 }}>{row.timeline}</p>
              </div>
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: isTotal ? "18px" : "15px",
                  color: isTotal ? V : AM,
                  whiteSpace: "nowrap",
                }}
              >
                {row.range}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ── Nav ───────────────────────────────────────────────────────────────────────
const SECTIONS = [
  { id: "vision",     label: "Vision" },
  { id: "formula",   label: "Formula" },
  { id: "pipeline",  label: "Pipeline" },
  { id: "regulatory",label: "Regulatory" },
  { id: "investment",label: "Investment" },
];

// ── Root ──────────────────────────────────────────────────────────────────────
export function RdPlan() {
  const [active, setActive] = useState("vision");

  function scrollTo(id: string) {
    setActive(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function handleExit() {
    window.location.href = "/";
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--void)", color: "var(--bone)" }}>
      {/* ── Top nav ── */}
      <header
        className="sticky top-0 z-30 flex items-center justify-between px-5 py-3 backdrop-blur-md gap-4"
        style={{ borderBottom: `1px solid ${V_BR}`, background: "rgba(2,0,20,0.9)" }}
      >
        {/* Left: brand + scroll nav */}
        <div className="flex items-center gap-6 min-w-0">
          <div className="shrink-0">
            <p className="text-xs" style={{ fontFamily: MONO, color: V, letterSpacing: "0.2em" }}>SCN R&D</p>
          </div>
          <nav className="hidden md:flex items-center gap-1">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className="px-3 py-1.5 text-xs rounded transition-all"
                style={{
                  fontFamily: MONO,
                  color: active === s.id ? V : "var(--bone-muted)",
                  background: active === s.id ? V_B : "transparent",
                  letterSpacing: "0.1em",
                  opacity: active === s.id ? 1 : 0.4,
                }}
              >
                {s.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs hidden sm:block" style={{ fontFamily: MONO, color: "var(--bone-muted)", opacity: 0.25, letterSpacing: "0.15em" }}>
            CONFIDENTIAL · 2025
          </span>
          <button
            onClick={handleExit}
            className="text-xs px-3 py-1.5 rounded transition-all opacity-40 hover:opacity-80"
            style={{ background: V_B, border: `1px solid ${V_BR}`, color: V, fontFamily: MONO }}
          >
            ⎋ Exit
          </button>
        </div>
      </header>

      {/* ── Hero strip ── */}
      <div
        className="px-5 py-10 sm:py-14 max-w-5xl mx-auto w-full"
        style={{ borderBottom: `1px solid ${V_BR}` }}
      >
        <p className="text-xs mb-3" style={{ fontFamily: MONO, color: V, opacity: 0.5, letterSpacing: "0.3em" }}>
          SOIL CREST NATURALS · R&D MASTER PLAN · CONFIDENTIAL
        </p>
        <h1
          style={{
            fontFamily: SERIF,
            fontSize: "clamp(2rem,5vw,3.5rem)",
            color: "var(--bone)",
            lineHeight: 1.1,
            fontStyle: "italic",
          }}
        >
          Research &amp; Development<br />
          <span style={{ color: V }}>Master Plan</span>
        </h1>
        <p className="mt-4 max-w-2xl text-sm" style={{ fontFamily: SANS, color: "var(--bone-muted)", opacity: 0.6, lineHeight: 1.8 }}>
          Daily Health Mix — six ingredients, eight formats, one vision. This document captures
          every product specification, formula adaptation, R&D milestone, regulatory pathway,
          and capital requirement across the full pipeline.
        </p>
      </div>

      {/* ── Content ── */}
      <div className="flex-1 px-5 py-12 max-w-5xl mx-auto w-full space-y-24">
        <div id="vision"><VisionSection /></div>
        <div style={{ height: 1, background: `linear-gradient(to right, ${V_BR}, transparent)` }} />
        <div id="formula"><FormulaSection /></div>
        <div style={{ height: 1, background: `linear-gradient(to right, ${V_BR}, transparent)` }} />
        <div id="pipeline"><PipelineSection /></div>
        <div style={{ height: 1, background: `linear-gradient(to right, ${V_BR}, transparent)` }} />
        <div id="regulatory"><RegulatorySection /></div>
        <div style={{ height: 1, background: `linear-gradient(to right, ${V_BR}, transparent)` }} />
        <div id="investment"><InvestmentSection /></div>
      </div>

      {/* ── Footer ── */}
      <footer
        className="py-5 text-center"
        style={{ borderTop: `1px solid ${V_BR}` }}
      >
        <p className="text-xs opacity-15" style={{ fontFamily: MONO, color: "var(--bone-muted)", letterSpacing: "0.25em" }}>
          SOIL CREST NATURALS · R&D MASTER PLAN · INTERNAL CONFIDENTIAL · 2025
        </p>
      </footer>
    </div>
  );
}
