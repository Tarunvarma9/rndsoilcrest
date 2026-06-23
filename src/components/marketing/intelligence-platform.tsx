"use client";

import { useState, useEffect } from "react";
import { AgentConsole } from "./agent-console";
import { FORMATS } from "@/lib/formats";

// ── Design tokens ─────────────────────────────────────────────────────────────
const C  = "var(--cyan)";
const CM = "rgba(34,211,238,";

const STATUS_COLOR: Record<string, string> = {
  Shipped:        "#22C55E",
  Now:            "#22D3EE",
  "3–6 months":  "#F59E0B",
  "6–9 months":  "#A78BFA",
  "Demand-gated":"#D946EF",
  "On hold":      "#6B7280",
};

// ── Agent definitions ─────────────────────────────────────────────────────────
const AGENTS = [
  {
    id: "GT_ROUTING",
    name: "GT-Routing",
    role: "Master Intelligence Router",
    color: "#22D3EE",
    capabilities: [
      "Reads intent — routes to correct specialist instantly",
      "Blends multi-domain responses when needed",
      "Zero hallucination — grounded in real SCN data",
    ],
    isRouter: true,
  },
  {
    id: "FORMULATION",
    name: "Formulation",
    role: "Ingredient Ratios · Formula Design",
    color: "#A78BFA",
    capabilities: [
      "Per-format reformulation logic",
      "Sensory outcome modelling across 8 formats",
      "Phase-locked ingredient set management",
    ],
  },
  {
    id: "SOURCING",
    name: "Sourcing",
    role: "Co-Packers · CMOs · Packaging",
    color: "#F59E0B",
    capabilities: [
      "VFFS line identification with moisture-barrier spec",
      "MOQ economics and CMO shortlisting",
      "Glass, shaker, HPP supplier scouting",
    ],
  },
  {
    id: "COMPLIANCE",
    name: "Compliance",
    role: "FSSAI · Licensing · Health Claims",
    color: "#F87171",
    capabilities: [
      "Category classification across all 8 formats",
      "Health-claims rules and dosage cap guidance",
      "Nutraceutical vs Proprietary Food split logic",
    ],
  },
  {
    id: "QUALITY",
    name: "Quality",
    role: "Testing · Stability · Shelf-Life",
    color: "#60A5FA",
    capabilities: [
      "Microbial + heavy-metal test protocol per format",
      "Accelerated stability at 40°C / 75% RH",
      "HPP vs thermal shelf-life benchmarks for shots",
    ],
  },
  {
    id: "COST",
    name: "Cost",
    role: "Phase Budgets · MOQ Economics",
    color: "#FBBF24",
    capabilities: [
      "Phase-by-phase R&D spend breakdowns",
      "MOQ-driven cost gating for Gummies",
      "ROI thresholds before committing to Phase 3",
    ],
  },
  {
    id: "MARKET",
    name: "Market",
    role: "Positioning · Channel · Pricing",
    color: "#34D399",
    capabilities: [
      "ICP definition per format and channel",
      "D2C vs quick commerce vs modern trade fit",
      "White-space mapping — Indian supplement market",
    ],
  },
];

// ── Live clock ────────────────────────────────────────────────────────────────
function LiveClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const update = () =>
      setTime(
        new Date().toLocaleString("en-IN", {
          day: "2-digit", month: "short", year: "numeric",
          hour: "2-digit", minute: "2-digit", second: "2-digit",
          hour12: false,
        })
      );
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <span
      className="text-xs opacity-40 hidden md:block"
      style={{ fontFamily: "var(--font-jetbrains-mono)", color: C }}
    >
      {time}
    </span>
  );
}

// ── Metric pill ───────────────────────────────────────────────────────────────
function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div
      className="flex flex-col items-center gap-0.5 px-5 py-3 rounded"
      style={{ background: `${CM}0.05)`, border: `1px solid ${CM}0.12)` }}
    >
      <span
        className="text-2xl font-medium"
        style={{ fontFamily: "var(--font-fraunces)", color: C }}
      >
        {value}
      </span>
      <span
        className="text-xs tracking-widest uppercase opacity-50"
        style={{ fontFamily: "var(--font-jetbrains-mono)", color: "var(--bone-muted)" }}
      >
        {label}
      </span>
    </div>
  );
}

// ── Agent card ────────────────────────────────────────────────────────────────
function AgentCard({
  agent,
  selected,
  onClick,
}: {
  agent: typeof AGENTS[number];
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left flex flex-col gap-3 p-4 rounded transition-all"
      style={{
        background: selected
          ? `rgba(${hexToRgb(agent.color)},0.1)`
          : "rgba(255,255,255,0.02)",
        border: `1px solid ${selected ? agent.color : "rgba(255,255,255,0.06)"}`,
        outline: "none",
      }}
    >
      {/* Header row */}
      <div className="flex items-center gap-2.5">
        {/* Status dot */}
        <div className="relative shrink-0">
          <div
            className="absolute inset-0 rounded-full animate-ping"
            style={{ background: agent.color, opacity: 0.3, animationDuration: "2s" }}
          />
          <div
            className="relative rounded-full"
            style={{ width: 8, height: 8, background: agent.color }}
          />
        </div>

        <span
          className="text-xs tracking-[0.2em] uppercase"
          style={{
            fontFamily: "var(--font-jetbrains-mono)",
            color: agent.color,
            opacity: 0.9,
          }}
        >
          {agent.isRouter ? "⬡ " : ""}{agent.name}
        </span>

        {agent.isRouter && (
          <span
            className="ml-auto text-xs px-1.5 py-0.5 rounded"
            style={{
              background: `${CM}0.1)`,
              border: `1px solid ${CM}0.2)`,
              color: C,
              fontFamily: "var(--font-jetbrains-mono)",
              fontSize: "9px",
              letterSpacing: "0.15em",
            }}
          >
            ROUTER
          </span>
        )}
      </div>

      {/* Role */}
      <p
        className="text-xs opacity-50 leading-snug"
        style={{ fontFamily: "var(--font-jetbrains-mono)", color: "var(--bone-muted)" }}
      >
        {agent.role}
      </p>

      {/* Capabilities */}
      <ul className="space-y-1">
        {agent.capabilities.map((cap) => (
          <li
            key={cap}
            className="flex gap-2 text-xs leading-snug"
            style={{ color: "var(--bone-muted)", opacity: 0.65 }}
          >
            <span style={{ color: agent.color, opacity: 0.7, fontFamily: "var(--font-jetbrains-mono)" }}>›</span>
            <span style={{ fontFamily: "Inter, sans-serif" }}>{cap}</span>
          </li>
        ))}
      </ul>

      {/* Query label */}
      <div
        className="text-xs pt-1"
        style={{
          fontFamily: "var(--font-jetbrains-mono)",
          color: agent.color,
          opacity: selected ? 0.9 : 0.4,
          letterSpacing: "0.15em",
        }}
      >
        {selected ? "▸ ACTIVE" : "Query →"}
      </div>
    </button>
  );
}

// ── Format pipeline bar ───────────────────────────────────────────────────────
function FormatPipeline() {
  return (
    <div
      className="p-5 rounded"
      style={{ background: `${CM}0.03)`, border: `1px solid ${CM}0.1)` }}
    >
      <p
        className="text-xs tracking-widest uppercase opacity-40 mb-4"
        style={{ fontFamily: "var(--font-jetbrains-mono)", color: C }}
      >
        Format Pipeline · 8 SKUs
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {FORMATS.map((f) => {
          const color = STATUS_COLOR[f.status] ?? "#6B7280";
          return (
            <div
              key={f.id}
              className="flex flex-col gap-1 p-3 rounded"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
            >
              <div className="flex items-center gap-1.5">
                <div className="rounded-full" style={{ width: 6, height: 6, background: color }} />
                <span
                  className="text-xs"
                  style={{ fontFamily: "var(--font-jetbrains-mono)", color: "var(--bone)", opacity: 0.85 }}
                >
                  {f.name}
                </span>
              </div>
              <span
                className="text-xs opacity-50"
                style={{ fontFamily: "var(--font-jetbrains-mono)", color, fontSize: "10px" }}
              >
                {f.status}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Hex → rgb helper ──────────────────────────────────────────────────────────
function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

// ── Main platform ─────────────────────────────────────────────────────────────
export function IntelligencePlatform() {
  const [selectedAgent, setSelectedAgent] = useState("GT_ROUTING");

  async function logout() {
    await fetch("/api/logout", { method: "POST" });
    window.location.href = "/";
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--void)", color: "var(--bone)" }}
    >
      {/* ── Top nav ── */}
      <header
        className="sticky top-0 z-20 flex items-center justify-between px-5 py-3 backdrop-blur-sm"
        style={{ borderBottom: `1px solid ${CM}0.12)`, background: "rgba(2,0,20,0.9)" }}
      >
        <div className="flex items-center gap-3">
          <span
            className="text-xs tracking-[0.3em] uppercase"
            style={{ fontFamily: "var(--font-jetbrains-mono)", color: C }}
          >
            Soil Crest Naturals
          </span>
          <span style={{ color: C, opacity: 0.2 }}>|</span>
          <span
            className="text-xs tracking-widest uppercase opacity-40"
            style={{ fontFamily: "var(--font-jetbrains-mono)", color: "var(--bone-muted)" }}
          >
            Intelligence Platform
          </span>
        </div>

        <div className="flex items-center gap-4">
          <LiveClock />
          <button
            onClick={logout}
            className="text-xs px-3 py-1.5 rounded transition-all opacity-30 hover:opacity-80"
            style={{
              fontFamily: "var(--font-jetbrains-mono)",
              color: C,
              background: `${CM}0.05)`,
              border: `1px solid ${CM}0.15)`,
              letterSpacing: "0.15em",
            }}
          >
            ⎋ Exit
          </button>
        </div>
      </header>

      <div className="flex-1 px-4 sm:px-6 py-8 max-w-screen-xl mx-auto w-full space-y-8">

        {/* ── Hero ── */}
        <section className="text-center space-y-5 pt-4">
          <p
            className="text-xs tracking-[0.4em] uppercase opacity-40"
            style={{ fontFamily: "var(--font-jetbrains-mono)", color: C }}
          >
            R&D Intelligence · Active Session
          </p>

          <h1
            style={{
              fontFamily: "var(--font-fraunces)",
              fontSize: "clamp(2rem, 5vw, 3.8rem)",
              color: "var(--bone)",
              lineHeight: 1.1,
            }}
          >
            The Intelligence Layer
          </h1>

          <p
            className="max-w-xl mx-auto text-sm opacity-50 leading-relaxed"
            style={{ fontFamily: "Inter, sans-serif", color: "var(--bone-muted)" }}
          >
            Six specialists. One routing intelligence. Every response grounded in
            real Soil Crest formulas, timelines, and cost data.
          </p>

          {/* Metrics */}
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Metric value="6" label="Specialists" />
            <Metric value="1" label="Router" />
            <Metric value="8" label="Formats" />
            <Metric value="∞" label="Queries" />
          </div>
        </section>

        {/* ── Divider ── */}
        <div
          className="flex items-center gap-4"
          style={{ borderTop: `1px solid ${CM}0.08)` }}
        >
          <span
            className="text-xs tracking-[0.3em] uppercase opacity-30 pt-0"
            style={{ fontFamily: "var(--font-jetbrains-mono)", color: C }}
          />
        </div>

        {/* ── Main grid: agents left / console right ── */}
        <section className="grid lg:grid-cols-[320px_1fr] gap-6 items-start">

          {/* Agent roster */}
          <div className="space-y-3">
            <p
              className="text-xs tracking-[0.3em] uppercase opacity-40 mb-4"
              style={{ fontFamily: "var(--font-jetbrains-mono)", color: C }}
            >
              Agent Roster · {AGENTS.length} Active
            </p>
            {AGENTS.map((agent) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                selected={selectedAgent === agent.id}
                onClick={() => setSelectedAgent(agent.id)}
              />
            ))}
          </div>

          {/* Agent console — passes the selected agent */}
          <div
            className="rounded overflow-hidden sticky top-20"
            style={{ border: `1px solid ${CM}0.12)` }}
          >
            <div
              className="px-4 py-3 flex items-center gap-3"
              style={{ borderBottom: `1px solid ${CM}0.08)`, background: `${CM}0.03)` }}
            >
              <div
                className="rounded-full animate-pulse"
                style={{ width: 8, height: 8, background: C }}
              />
              <span
                className="text-xs tracking-widest uppercase opacity-60"
                style={{ fontFamily: "var(--font-jetbrains-mono)", color: C }}
              >
                Live Agent Console
              </span>
              <span
                className="ml-auto text-xs opacity-30"
                style={{ fontFamily: "var(--font-jetbrains-mono)", color: "var(--bone-muted)" }}
              >
                {AGENTS.find((a) => a.id === selectedAgent)?.name ?? "GT-Routing"}
              </span>
            </div>
            <AgentConsole initialAgent={selectedAgent} />
          </div>
        </section>

        {/* ── Format pipeline ── */}
        <FormatPipeline />

      </div>

      {/* Footer */}
      <footer
        className="py-4 text-center"
        style={{ borderTop: `1px solid ${CM}0.08)` }}
      >
        <p
          className="text-xs opacity-15"
          style={{ fontFamily: "var(--font-jetbrains-mono)", color: "var(--bone-muted)", letterSpacing: "0.25em" }}
        >
          SOIL CREST NATURALS · INTELLIGENCE PLATFORM · CONFIDENTIAL
        </p>
      </footer>
    </div>
  );
}
