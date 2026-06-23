"use client";

import { useEffect, useRef, useState } from "react";

const G  = "#22C55E";   // HK Vitals green
const G2 = "#16A34A";   // deep green
const AU = "#F59E0B";   // gold accent
const G_GLOW = "rgba(34,197,94,0.15)";
const G_BORDER = "rgba(34,197,94,0.2)";

const INGREDIENTS = [
  { name: "Amla",        note: "Vitamin C · Immunity",   icon: "⬡" },
  { name: "Beetroot",    note: "Betalain · Endurance",   icon: "⬡" },
  { name: "Carrot",      note: "Beta-Carotene · Vision", icon: "⬡" },
  { name: "Moringa",     note: "90+ Nutrients · Energy", icon: "⬡" },
  { name: "Ginger",      note: "Gingerol · Digestion",   icon: "⬡" },
  { name: "Pomegranate", note: "Punicalagin · Defence",  icon: "⬡" },
];

// ── Pulsing green ring ────────────────────────────────────────────────────────
function HKBadge() {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 96, height: 96 }}>
      <div
        className="absolute inset-0 rounded-full animate-ping"
        style={{ background: "rgba(34,197,94,0.08)", animationDuration: "2.5s" }}
      />
      <div
        className="absolute rounded-full"
        style={{ inset: 8, background: "rgba(34,197,94,0.06)", border: `1px solid ${G_BORDER}` }}
      />
      <div
        className="relative flex items-center justify-center rounded-full"
        style={{ width: 56, height: 56, background: "rgba(34,197,94,0.12)", border: `1.5px solid ${G}` }}
      >
        <span
          style={{ fontFamily: "var(--font-fraunces)", fontSize: "18px", color: G, fontWeight: 500 }}
        >
          HK
        </span>
      </div>
    </div>
  );
}

// ── Ingredient card ───────────────────────────────────────────────────────────
function IngCard({ name, note }: { name: string; note: string }) {
  return (
    <div
      className="flex flex-col gap-1 p-4 rounded"
      style={{ background: G_GLOW, border: `1px solid ${G_BORDER}` }}
    >
      <span
        style={{ fontFamily: "var(--font-fraunces)", fontSize: "15px", color: "var(--bone)" }}
      >
        {name}
      </span>
      <span
        style={{
          fontFamily: "var(--font-jetbrains-mono)",
          fontSize: "10px",
          color: G,
          opacity: 0.7,
          letterSpacing: "0.1em",
        }}
      >
        {note}
      </span>
    </div>
  );
}

// ── Timeline entry ────────────────────────────────────────────────────────────
function TimelineItem({ label, text }: { label: string; text: string }) {
  return (
    <div className="flex gap-5">
      <div className="flex flex-col items-center">
        <div
          className="rounded-full shrink-0"
          style={{ width: 10, height: 10, background: G, marginTop: 4 }}
        />
        <div style={{ width: 1, flex: 1, background: G_BORDER, marginTop: 6 }} />
      </div>
      <div className="pb-8">
        <p
          className="text-xs tracking-widest uppercase mb-1"
          style={{ fontFamily: "var(--font-jetbrains-mono)", color: G, opacity: 0.6 }}
        >
          {label}
        </p>
        <p style={{ fontFamily: "var(--font-fraunces)", fontSize: "16px", color: "var(--bone)", lineHeight: 1.6 }}>
          {text}
        </p>
      </div>
    </div>
  );
}

// ── Hero image ────────────────────────────────────────────────────────────────
function HeroImage() {
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (ref.current?.complete) setLoaded(true);
  }, []);

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ height: "clamp(280px, 45vw, 520px)" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={ref}
        src="/shoutout.jpg"
        alt=""
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
        style={{ opacity: loaded ? 0.55 : 0, objectPosition: "center top" }}
        onLoad={() => setLoaded(true)}
      />
      {/* Gradient vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(2,0,20,0.3) 0%, transparent 25%, transparent 55%, var(--void) 100%)",
        }}
      />
      {/* Left edge fade */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to right, var(--void) 0%, transparent 30%, transparent 70%, var(--void) 100%)",
        }}
      />
      {/* HK Vitals brand strip — bottom left */}
      <div className="absolute bottom-8 left-6 sm:left-10">
        <p
          className="text-xs tracking-[0.4em] uppercase mb-2"
          style={{ fontFamily: "var(--font-jetbrains-mono)", color: G, opacity: 0.8 }}
        >
          HK Vitals × Soil Crest Naturals
        </p>
        <h1
          style={{
            fontFamily: "var(--font-fraunces)",
            fontSize: "clamp(1.8rem, 5vw, 3.2rem)",
            color: "var(--bone)",
            lineHeight: 1.1,
            fontStyle: "italic",
          }}
        >
          The Standard<br />We Built Against.
        </h1>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export function LovePage() {
  async function handleSignOut() {
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
        className="sticky top-0 z-20 flex items-center justify-between px-6 py-3 backdrop-blur-sm"
        style={{ borderBottom: `1px solid ${G_BORDER}`, background: "rgba(2,0,20,0.85)" }}
      >
        <div className="flex items-center gap-3">
          <span
            className="text-xs tracking-[0.35em] uppercase"
            style={{ fontFamily: "var(--font-jetbrains-mono)", color: G }}
          >
            HK Vitals
          </span>
          <span style={{ color: G, opacity: 0.3 }}>×</span>
          <span
            className="text-xs tracking-widest uppercase opacity-40"
            style={{ fontFamily: "var(--font-jetbrains-mono)", color: "var(--bone)" }}
          >
            Soil Crest Naturals
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span
            className="text-xs opacity-25 hidden sm:block"
            style={{ fontFamily: "var(--font-jetbrains-mono)", color: G }}
          >
            COLLABORATION DOSSIER
          </span>
          <button
            onClick={handleSignOut}
            className="text-xs px-3 py-1.5 rounded transition-all opacity-50 hover:opacity-90"
            style={{
              background: "rgba(34,197,94,0.06)",
              border: `1px solid ${G_BORDER}`,
              color: G,
              fontFamily: "var(--font-jetbrains-mono)",
            }}
          >
            Exit
          </button>
        </div>
      </header>

      {/* ── Hero ── */}
      <HeroImage />

      <div className="px-4 sm:px-10 max-w-4xl mx-auto w-full space-y-20 py-16">

        {/* ── HK badge + intro ── */}
        <section className="flex flex-col sm:flex-row items-start gap-10">
          <div className="shrink-0">
            <HKBadge />
          </div>
          <div className="space-y-4">
            <p
              className="text-xs tracking-[0.3em] uppercase"
              style={{ fontFamily: "var(--font-jetbrains-mono)", color: G, opacity: 0.7 }}
            >
              Restricted · For One
            </p>
            <p
              style={{
                fontFamily: "var(--font-fraunces)",
                fontSize: "clamp(1.5rem, 3vw, 2rem)",
                lineHeight: 1.4,
                color: "var(--bone)",
              }}
            >
              Every formula in this dossier was pressure-tested against a benchmark
              that most brands don't even know exists.
            </p>
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "15px",
                lineHeight: 1.8,
                color: "var(--bone-muted)",
                opacity: 0.7,
              }}
            >
              HK Vitals set the bar. Not because of the marketing, but because of the
              real understanding behind it. That kind of knowledge doesn't come from a
              label. It comes from someone who actually cares about what goes inside the body.
            </p>
          </div>
        </section>

        {/* ── Divider ── */}
        <div style={{ height: 1, background: `linear-gradient(to right, ${G_BORDER}, transparent)` }} />

        {/* ── The formula section ── */}
        <section>
          <p
            className="text-xs tracking-[0.3em] uppercase mb-2"
            style={{ fontFamily: "var(--font-jetbrains-mono)", color: G, opacity: 0.6 }}
          >
            The Origin Formula
          </p>
          <h2
            className="mb-8"
            style={{
              fontFamily: "var(--font-fraunces)",
              fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
              color: "var(--bone)",
              fontStyle: "italic",
            }}
          >
            Six whole foods.<br />One reason they work together.
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {INGREDIENTS.map((ing) => (
              <IngCard key={ing.name} name={ing.name} note={ing.note} />
            ))}
          </div>
          <p
            className="mt-6 text-sm opacity-50"
            style={{ fontFamily: "Inter, sans-serif", color: "var(--bone-muted)", lineHeight: 1.7 }}
          >
            The same six. Across eight formats. Because when the base formula is right,
            everything else is just geometry.
          </p>
        </section>

        {/* ── Divider ── */}
        <div style={{ height: 1, background: `linear-gradient(to right, ${G_BORDER}, transparent)` }} />

        {/* ── Timeline ── */}
        <section>
          <p
            className="text-xs tracking-[0.3em] uppercase mb-10"
            style={{ fontFamily: "var(--font-jetbrains-mono)", color: G, opacity: 0.6 }}
          >
            How This Started
          </p>
          <div>
            <TimelineItem
              label="The Reference Point"
              text="Before a single formula was written, there was a conversation about what real nutrition should feel like — not marketed, not glamorised. Just whole and honest."
            />
            <TimelineItem
              label="The Benchmark"
              text="HK Vitals proved that an Indian brand can do it right. That it's possible to build a supplement business rooted in actual science and not just shelf aesthetics."
            />
            <TimelineItem
              label="The Build"
              text="Every format you see in this dossier — from the powder that ships today to the tablets in Phase 3 — was designed with that standard in mind."
            />
            <TimelineItem
              label="The Reason"
              text="This page exists for one person. Someone who understood what we were building before the first prototype. If you're reading this — you already know."
            />
          </div>
        </section>

        {/* ── Quote ── */}
        <section
          className="rounded-lg p-8 sm:p-12 text-center"
          style={{ background: G_GLOW, border: `1px solid ${G_BORDER}` }}
        >
          <span
            className="block mb-6 opacity-40"
            style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: "10px", letterSpacing: "0.4em", color: G }}
          >
            HK VITALS PRINCIPLE
          </span>
          <blockquote
            style={{
              fontFamily: "var(--font-fraunces)",
              fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)",
              color: "var(--bone)",
              fontStyle: "italic",
              lineHeight: 1.6,
            }}
          >
            &ldquo;The strongest supplement is knowledge.
            The rest is just bioavailability.&rdquo;
          </blockquote>
          <span
            className="block mt-6 text-xs tracking-widest opacity-40"
            style={{ fontFamily: "var(--font-jetbrains-mono)", color: G }}
          >
            — H. · Adapted for SCN
          </span>
        </section>

        {/* ── Sign off ── */}
        <section className="text-center space-y-4 pb-4">
          <div className="flex items-center justify-center gap-4">
            <div style={{ height: 1, width: 60, background: G_BORDER }} />
            <span style={{ color: G, fontSize: "18px" }}>✦</span>
            <div style={{ height: 1, width: 60, background: G_BORDER }} />
          </div>
          <p
            style={{
              fontFamily: "var(--font-fraunces)",
              fontSize: "20px",
              color: "var(--bone)",
              fontStyle: "italic",
              opacity: 0.8,
            }}
          >
            For H.
          </p>
          <p
            className="text-xs tracking-[0.3em] opacity-30"
            style={{ fontFamily: "var(--font-jetbrains-mono)", color: G }}
          >
            HK × SCN · 2025
          </p>
        </section>

      </div>

      {/* ── Footer ── */}
      <footer
        className="py-5 text-center"
        style={{ borderTop: `1px solid ${G_BORDER}` }}
      >
        <p
          className="text-xs opacity-20"
          style={{
            fontFamily: "var(--font-jetbrains-mono)",
            color: "var(--bone-muted)",
            letterSpacing: "0.25em",
          }}
        >
          HK VITALS × SOIL CREST NATURALS · COLLABORATION DOSSIER · CONFIDENTIAL
        </p>
      </footer>
    </div>
  );
}
