"use client";

import { useEffect, useRef, useState } from "react";

const G        = "#22C55E";
const AU       = "#F59E0B";
const G_GLOW   = "rgba(34,197,94,0.10)";
const G_BORDER = "rgba(34,197,94,0.18)";

const INGREDIENTS = [
  { name: "Amla",        note: "Vitamin C · Immunity",   },
  { name: "Beetroot",    note: "Betalain · Endurance",   },
  { name: "Carrot",      note: "Beta-Carotene · Vision", },
  { name: "Moringa",     note: "90+ Nutrients · Energy", },
  { name: "Ginger",      note: "Gingerol · Digestion",   },
  { name: "Pomegranate", note: "Punicalagin · Defence",  },
];

// ── Pulsing HK badge ──────────────────────────────────────────────────────────
function HKBadge() {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 96, height: 96 }}>
      <div
        className="absolute inset-0 rounded-full animate-ping"
        style={{ background: "rgba(34,197,94,0.06)", animationDuration: "3s" }}
      />
      <div
        className="absolute rounded-full"
        style={{ inset: 8, background: "rgba(34,197,94,0.05)", border: `1px solid ${G_BORDER}` }}
      />
      <div
        className="relative flex items-center justify-center rounded-full"
        style={{ width: 56, height: 56, background: "rgba(34,197,94,0.10)", border: `1.5px solid ${G}` }}
      >
        <span style={{ fontFamily: "var(--font-fraunces)", fontSize: "18px", color: G, fontWeight: 500 }}>
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
      <span style={{ fontFamily: "var(--font-fraunces)", fontSize: "15px", color: "var(--bone)" }}>
        {name}
      </span>
      <span
        style={{
          fontFamily: "var(--font-jetbrains-mono)",
          fontSize: "10px",
          color: G,
          opacity: 0.65,
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
          style={{ width: 10, height: 10, background: G, marginTop: 5 }}
        />
        <div style={{ width: 1, flex: 1, background: G_BORDER, marginTop: 6 }} />
      </div>
      <div className="pb-9">
        <p
          className="text-xs tracking-widest uppercase mb-2"
          style={{ fontFamily: "var(--font-jetbrains-mono)", color: G, opacity: 0.55 }}
        >
          {label}
        </p>
        <p
          style={{
            fontFamily: "var(--font-fraunces)",
            fontSize: "16px",
            color: "var(--bone)",
            lineHeight: 1.7,
            opacity: 0.9,
          }}
        >
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
      style={{ height: "clamp(260px, 42vw, 500px)" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={ref}
        src="/shoutout.jpg"
        alt=""
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
        style={{ opacity: loaded ? 0.45 : 0, objectPosition: "center top" }}
        onLoad={() => setLoaded(true)}
      />
      {/* Bottom fade */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(2,0,20,0.2) 0%, transparent 20%, transparent 50%, var(--void) 100%)",
        }}
      />
      {/* Edge fades */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, var(--void) 0%, transparent 25%, transparent 75%, var(--void) 100%)",
        }}
      />
      {/* Headline */}
      <div className="absolute bottom-8 left-6 sm:left-10 max-w-sm">
        <p
          className="text-xs tracking-[0.4em] uppercase mb-2.5"
          style={{ fontFamily: "var(--font-jetbrains-mono)", color: G, opacity: 0.75 }}
        >
          HK Vitals × Soil Crest Naturals
        </p>
        <h1
          style={{
            fontFamily: "var(--font-fraunces)",
            fontSize: "clamp(1.7rem, 4.5vw, 3rem)",
            color: "var(--bone)",
            lineHeight: 1.15,
            fontStyle: "italic",
          }}
        >
          Because You Believed<br />Before Anyone Else Did.
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
            className="text-xs tracking-widest uppercase opacity-35"
            style={{ fontFamily: "var(--font-jetbrains-mono)", color: "var(--bone)" }}
          >
            Soil Crest Naturals
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span
            className="text-xs opacity-20 hidden sm:block"
            style={{ fontFamily: "var(--font-jetbrains-mono)", color: G }}
          >
            PERSONAL DOSSIER
          </span>
          <button
            onClick={handleSignOut}
            className="text-xs px-3 py-1.5 rounded transition-all opacity-40 hover:opacity-80"
            style={{
              background: "rgba(34,197,94,0.05)",
              border: `1px solid ${G_BORDER}`,
              color: G,
              fontFamily: "var(--font-jetbrains-mono)",
            }}
          >
            ⎋ Exit
          </button>
        </div>
      </header>

      {/* ── Hero ── */}
      <HeroImage />

      <div className="px-4 sm:px-10 max-w-4xl mx-auto w-full space-y-20 py-16">

        {/* ── Intro ── */}
        <section className="flex flex-col sm:flex-row items-start gap-10">
          <div className="shrink-0 mt-1">
            <HKBadge />
          </div>
          <div className="space-y-5">
            <p
              className="text-xs tracking-[0.3em] uppercase"
              style={{ fontFamily: "var(--font-jetbrains-mono)", color: G, opacity: 0.6 }}
            >
              A Personal Note · With Gratitude
            </p>
            <p
              style={{
                fontFamily: "var(--font-fraunces)",
                fontSize: "clamp(1.4rem, 2.8vw, 1.9rem)",
                lineHeight: 1.5,
                color: "var(--bone)",
              }}
            >
              Some people understand the work before you can fully explain it.
              That kind of trust is rare, and it means more than most words can hold.
            </p>
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "15px",
                lineHeight: 1.9,
                color: "var(--bone-muted)",
                opacity: 0.75,
              }}
            >
              HK Vitals was the clearest proof that building with real ingredients and real
              intention is not only possible — it resonates. H. understood that from the very
              beginning, not just as a product reference, but as a philosophy for what this
              work should stand for. This dossier is shaped by that understanding.
            </p>
          </div>
        </section>

        {/* ── Divider ── */}
        <div style={{ height: 1, background: `linear-gradient(to right, ${G_BORDER}, transparent)` }} />

        {/* ── Formula section ── */}
        <section>
          <p
            className="text-xs tracking-[0.3em] uppercase mb-2"
            style={{ fontFamily: "var(--font-jetbrains-mono)", color: G, opacity: 0.55 }}
          >
            The Origin Formula
          </p>
          <h2
            className="mb-8"
            style={{
              fontFamily: "var(--font-fraunces)",
              fontSize: "clamp(1.5rem, 3vw, 2.1rem)",
              color: "var(--bone)",
              fontStyle: "italic",
            }}
          >
            Six whole foods. One reason they belong together.
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {INGREDIENTS.map((ing) => (
              <IngCard key={ing.name} name={ing.name} note={ing.note} />
            ))}
          </div>
          <p
            className="mt-6 text-sm"
            style={{ fontFamily: "Inter, sans-serif", color: "var(--bone-muted)", lineHeight: 1.8, opacity: 0.55 }}
          >
            The same six ingredients, expressed across eight formats — because when the
            base is truly right, every form it takes becomes an extension of that truth.
          </p>
        </section>

        {/* ── Divider ── */}
        <div style={{ height: 1, background: `linear-gradient(to right, ${G_BORDER}, transparent)` }} />

        {/* ── Timeline ── */}
        <section>
          <p
            className="text-xs tracking-[0.3em] uppercase mb-10"
            style={{ fontFamily: "var(--font-jetbrains-mono)", color: G, opacity: 0.55 }}
          >
            How This Came Together
          </p>
          <div>
            <TimelineItem
              label="A Real Conversation"
              text="It didn't begin with a pitch or a presentation. It began with a genuine conversation about what honest nutrition should look and feel like — something that H. has understood deeply for a long time."
            />
            <TimelineItem
              label="The Inspiration"
              text="HK Vitals demonstrated that an Indian brand can hold itself to the highest standard — clean ingredients, real science, and genuine respect for the person it serves. That became the quiet benchmark for everything here."
            />
            <TimelineItem
              label="The Work"
              text="Every format in this dossier — from the first powder to the phases still ahead — was built with that same spirit: no shortcuts, no compromise, no performance without substance."
            />
            <TimelineItem
              label="The Reason This Page Exists"
              text="There is one person who saw what this could become before it had a name or a form. Who asked the right questions and offered honest encouragement when it mattered most. This is a small acknowledgment of something that cannot be fully repaid — only honoured."
            />
          </div>
        </section>

        {/* ── Quote card ── */}
        <section
          className="rounded-lg p-8 sm:p-12 text-center"
          style={{ background: G_GLOW, border: `1px solid ${G_BORDER}` }}
        >
          <span
            className="block mb-6 opacity-35"
            style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: "10px", letterSpacing: "0.4em", color: G }}
          >
            A PRINCIPLE TO BUILD BY
          </span>
          <blockquote
            style={{
              fontFamily: "var(--font-fraunces)",
              fontSize: "clamp(1.2rem, 2.4vw, 1.75rem)",
              color: "var(--bone)",
              fontStyle: "italic",
              lineHeight: 1.7,
            }}
          >
            &ldquo;You don&rsquo;t need to understand every compound in a formula
            to know whether it was made with care.
            Sincerity has its own signature.&rdquo;
          </blockquote>
          <span
            className="block mt-6 text-xs tracking-widest opacity-35"
            style={{ fontFamily: "var(--font-jetbrains-mono)", color: G }}
          >
            — Adapted for SCN · With respect to H.
          </span>
        </section>

        {/* ── Sign off ── */}
        <section className="text-center space-y-5 pb-4">
          <div className="flex items-center justify-center gap-4">
            <div style={{ height: 1, width: 60, background: G_BORDER }} />
            <span style={{ color: AU, fontSize: "18px" }}>✦</span>
            <div style={{ height: 1, width: 60, background: G_BORDER }} />
          </div>
          <p
            style={{
              fontFamily: "var(--font-fraunces)",
              fontSize: "clamp(1.1rem, 2vw, 1.4rem)",
              color: "var(--bone)",
              fontStyle: "italic",
              lineHeight: 1.7,
              opacity: 0.85,
            }}
          >
            With sincere gratitude and deep respect —<br />
            <span style={{ color: G }}>For H.</span>
          </p>
          <p
            className="text-xs tracking-[0.3em] opacity-25"
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
          className="text-xs opacity-15"
          style={{
            fontFamily: "var(--font-jetbrains-mono)",
            color: "var(--bone-muted)",
            letterSpacing: "0.25em",
          }}
        >
          HK VITALS × SOIL CREST NATURALS · PERSONAL DOSSIER · CONFIDENTIAL
        </p>
      </footer>
    </div>
  );
}
