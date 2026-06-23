"use client";

import { useState } from "react";
import { AgentConsole } from "./agent-console";
import { FigModal } from "./fig-modal";
import { FORMATS, type Format, type FormatImage } from "@/lib/formats";

function CardThumbnail({ images }: { images: FormatImage[] }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  if (images.length === 0) return null;

  return (
    <div className="relative w-full h-28 overflow-hidden">
      {/* Placeholder shown until image loads or on failure */}
      {!loaded && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ background: "rgba(34, 211, 238, 0.04)" }}
        >
          <span
            className="text-xs tracking-widest uppercase opacity-20"
            style={{ fontFamily: "var(--font-jetbrains-mono)", color: "var(--cyan)" }}
          >
            {failed ? "place image here →" : "···"}
          </span>
        </div>
      )}

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={images[0].src}
        alt=""
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
        style={{ opacity: loaded ? 0.92 : 0, color: "transparent" }}
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
      />

      {loaded && (
        <>
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to bottom, transparent 50%, rgba(15,11,7,0.85) 100%)",
            }}
          />
          <span
            className="absolute bottom-2 right-2 text-xs opacity-40"
            style={{ fontFamily: "var(--font-jetbrains-mono)", color: "var(--bone-muted)" }}
          >
            {images.length} ref
          </span>
        </>
      )}
    </div>
  );
}

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
          className="text-4xl md:text-6xl font-medium gradient-text"
          style={{ fontFamily: "var(--font-fraunces)" }}
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
              className="fig-card text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 overflow-hidden"
            >
              {fmt.referenceImages && fmt.referenceImages.length > 0 && (
                <CardThumbnail images={fmt.referenceImages} />
              )}
              <div className="p-6">
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
              </div>
            </button>
          ))}

          {/* FIG. 09 — GT-Routing Agent Console */}
          <button
            onClick={() => setAgentOpen(true)}
            className="fig-card text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 overflow-hidden"
            style={{ borderColor: "rgba(34,211,238,0.35)" }}
          >
            {/* GT header strip */}
            <div
              className="w-full px-6 pt-5 pb-3 flex items-center justify-between"
              style={{ background: "rgba(34,211,238,0.04)", borderBottom: "1px solid rgba(34,211,238,0.1)" }}
            >
              <div className="flex items-center gap-2">
                {/* GT-Routing image icon */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/gt-routing.webp" alt="GT-Routing" width={24} height={24} style={{ objectFit: "contain" }}/>
                <span
                  className="text-xs tracking-widest"
                  style={{ fontFamily: "var(--font-jetbrains-mono)", color: "var(--cyan)", fontSize: "10px" }}
                >
                  GT-ROUTING
                </span>
              </div>
              <span
                className="text-xs opacity-40"
                style={{ fontFamily: "var(--font-jetbrains-mono)", color: "var(--cyan)", fontSize: "9px" }}
              >
                FIG. 09
              </span>
            </div>

            <div className="p-6">
              <h2
                className="text-lg font-medium mb-1"
                style={{ fontFamily: "var(--font-fraunces)", color: "var(--bone)" }}
              >
                R&D Agent Console
              </h2>
              <p
                className="text-xs mb-3"
                style={{ color: "var(--bone-muted)", fontFamily: "var(--font-inter)" }}
              >
                Auto-routes your question to the best specialist — Formulation, Sourcing, Compliance, Quality, Cost, or Market.
              </p>
              <div className="flex flex-wrap gap-1">
                {["Formulation","Sourcing","Compliance","Quality","Cost","Market"].map((s) => (
                  <span
                    key={s}
                    className="text-xs px-1.5 py-0.5 rounded"
                    style={{
                      fontFamily: "var(--font-jetbrains-mono)",
                      fontSize: "9px",
                      color: "rgba(34,211,238,0.7)",
                      background: "rgba(34,211,238,0.07)",
                      border: "1px solid rgba(34,211,238,0.15)",
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
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
