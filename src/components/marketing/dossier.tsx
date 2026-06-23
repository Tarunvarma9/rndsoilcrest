"use client";

import { useState } from "react";
import { AgentConsole } from "./agent-console";
import { FigModal } from "./fig-modal";
import { FORMATS, type Format } from "@/lib/formats";

export function Dossier() {
  const [activeFormat, setActiveFormat] = useState<Format | null>(null);
  const [agentOpen, setAgentOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <header className="pt-16 pb-10 px-6 text-center">
        <p
          className="text-xs tracking-[0.25em] uppercase mb-3"
          style={{
            fontFamily: "var(--font-jetbrains-mono)",
            color: "var(--cyan)",
          }}
        >
          Soil Crest Naturals — Confidential R&D Dossier
        </p>
        <h1
          className="text-4xl md:text-6xl font-medium glow-violet"
          style={{ fontFamily: "var(--font-fraunces)", color: "var(--bone)" }}
        >
          Daily Health Mix
        </h1>
        <p
          className="mt-3 text-sm max-w-md mx-auto"
          style={{ color: "var(--bone-muted)", fontFamily: "var(--font-inter)" }}
        >
          Eight product formats. One mother formula. Sequenced by R&D readiness.
        </p>
      </header>

      {/* Mother formula */}
      <section className="px-6 pb-10 max-w-4xl mx-auto w-full">
        <p
          className="text-xs tracking-[0.2em] uppercase mb-4"
          style={{ fontFamily: "var(--font-jetbrains-mono)", color: "var(--bone-muted)" }}
        >
          Mother Formula — Six Ingredients
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {["Amla", "Beetroot", "Carrot", "Moringa", "Ginger", "Pomegranate"].map(
            (ing) => (
              <div
                key={ing}
                className="fig-card px-3 py-2 text-center text-xs"
                style={{
                  fontFamily: "var(--font-jetbrains-mono)",
                  color: "var(--bone-muted)",
                }}
              >
                {ing}
              </div>
            )
          )}
        </div>
      </section>

      {/* FIG. grid */}
      <section className="px-6 pb-16 max-w-6xl mx-auto w-full">
        <p
          className="text-xs tracking-[0.2em] uppercase mb-6"
          style={{ fontFamily: "var(--font-jetbrains-mono)", color: "var(--bone-muted)" }}
        >
          Product Roadmap
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FORMATS.map((fmt) => (
            <button
              key={fmt.id}
              onClick={() => setActiveFormat(fmt)}
              className="fig-card p-6 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
            >
              <p
                className="text-xs tracking-[0.2em] uppercase mb-2"
                style={{ fontFamily: "var(--font-jetbrains-mono)", color: "var(--cyan)" }}
              >
                FIG. {String(fmt.id).padStart(2, "0")}
              </p>
              <h2
                className="text-lg font-medium mb-1"
                style={{ fontFamily: "var(--font-fraunces)", color: "var(--bone)" }}
              >
                {fmt.name}
              </h2>
              <p
                className="text-xs"
                style={{ color: "var(--bone-muted)", fontFamily: "var(--font-inter)" }}
              >
                {fmt.phase} · {fmt.status}
              </p>
            </button>
          ))}

          {/* FIG. 09 — Agent Console */}
          <button
            onClick={() => setAgentOpen(true)}
            className="fig-card p-6 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
            style={{ borderColor: "rgba(139, 92, 246, 0.5)" }}
          >
            <p
              className="text-xs tracking-[0.2em] uppercase mb-2"
              style={{ fontFamily: "var(--font-jetbrains-mono)", color: "var(--violet)" }}
            >
              FIG. 09
            </p>
            <h2
              className="text-lg font-medium mb-1"
              style={{ fontFamily: "var(--font-fraunces)", color: "var(--bone)" }}
            >
              R&D Agent Console
            </h2>
            <p
              className="text-xs"
              style={{ color: "var(--bone-muted)", fontFamily: "var(--font-inter)" }}
            >
              AI · Live · 6 Specialists
            </p>
          </button>
        </div>
      </section>

      {/* Format modal */}
      {activeFormat && (
        <FigModal format={activeFormat} onClose={() => setActiveFormat(null)} />
      )}

      {/* Agent console */}
      {agentOpen && <AgentConsole onClose={() => setAgentOpen(false)} />}
    </div>
  );
}
