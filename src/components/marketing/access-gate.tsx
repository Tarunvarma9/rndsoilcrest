"use client";

import { useState } from "react";
import { collectClientHints } from "@/lib/auth-tracker-types";

type GateView = "unlock" | "request" | "requested";

const QUOTES = [
  "The things you consume end up consuming you.",
  "You are not your supplement label.",
  "Stop buying what you don't need. Start building what your body demands.",
  "Without sacrifice, without real ingredients — you have nothing.",
];

export function AccessGate() {
  const [code, setCode]       = useState("");
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const [view, setView]       = useState<GateView>("unlock");
  const [requesting, setRequesting] = useState(false);

  const quote = QUOTES[Math.floor(Date.now() / 86_400_000) % QUOTES.length];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (code.length !== 6) return;
    setLoading(true);
    setError("");

    const res = await fetch("/api/unlock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code,
        hints: collectClientHints(),
      }),
    });

    if (res.ok) {
      window.location.reload();
    } else {
      setError("Wrong code. Try again.");
      setCode("");
    }
    setLoading(false);
  }

  async function handleRequestAccess() {
    setRequesting(true);
    try {
      await fetch("/api/request-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hints: collectClientHints() }),
      });
    } catch { /* silent */ }
    setView("requested");
    setRequesting(false);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 gap-10">

      {/* ── Fight Club quote ── */}
      <div className="text-center max-w-xs">
        <p
          className="text-xs tracking-widest uppercase mb-3 opacity-40"
          style={{ fontFamily: "var(--font-jetbrains-mono)", color: "var(--cyan)" }}
        >
          FIG. 00 · Internal Access
        </p>
        <blockquote
          className="text-lg leading-snug"
          style={{ fontFamily: "var(--font-fraunces)", color: "var(--bone)", fontStyle: "italic" }}
        >
          &ldquo;{quote}&rdquo;
        </blockquote>
      </div>

      {/* ── Gate card ── */}
      <div
        className="fig-card w-full max-w-xs p-8 flex flex-col items-center gap-6"
        style={{ border: "1px solid rgba(34,211,238,0.2)" }}
      >
        <div className="text-center space-y-1">
          <h1
            className="text-2xl font-medium"
            style={{ fontFamily: "var(--font-fraunces)", color: "var(--bone)" }}
          >
            R&D Dossier
          </h1>
          <p
            className="text-xs opacity-35"
            style={{
              fontFamily: "var(--font-jetbrains-mono)",
              color: "var(--bone-muted)",
              letterSpacing: "0.15em",
            }}
          >
            SOIL CREST NATURALS · CONFIDENTIAL
          </p>
        </div>

        {/* Lock icon */}
        <svg width="36" height="36" viewBox="0 0 40 40" fill="none" aria-hidden="true">
          <rect x="8" y="18" width="24" height="16" rx="2"
            stroke="var(--cyan)" strokeWidth="1.5" strokeOpacity="0.6" />
          <path d="M13 18v-5a7 7 0 0 1 14 0v5"
            stroke="var(--cyan)" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.6" />
          <circle cx="20" cy="26" r="2" fill="var(--cyan)" />
        </svg>

        {/* ── Unlock form ── */}
        {view === "unlock" && (
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
            <input
              type="password"
              maxLength={8}
              placeholder="••••••"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="w-full text-center text-2xl tracking-[0.5em] py-3 px-4 outline-none placeholder:opacity-25"
              style={{
                background: "rgba(34,211,238,0.05)",
                border: "1px solid rgba(34,211,238,0.25)",
                color: "var(--bone)",
                fontFamily: "var(--font-jetbrains-mono)",
              }}
              autoFocus
              autoCapitalize="none"
              autoCorrect="off"
              autoComplete="off"
            />

            {error && (
              <p
                className="text-xs text-center"
                style={{ color: "var(--pink)", fontFamily: "var(--font-jetbrains-mono)" }}
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={code.length < 4 || loading}
              className="w-full py-3 text-xs tracking-[0.25em] uppercase transition-all disabled:opacity-30"
              style={{
                background: "rgba(34,211,238,0.08)",
                border: "1px solid rgba(34,211,238,0.35)",
                color: "var(--cyan)",
                fontFamily: "var(--font-jetbrains-mono)",
              }}
            >
              {loading ? "Verifying…" : "Unlock"}
            </button>

            {/* Request access link */}
            <button
              type="button"
              onClick={() => setView("request")}
              className="text-xs opacity-30 hover:opacity-60 transition-opacity pt-1"
              style={{ fontFamily: "var(--font-jetbrains-mono)", color: "var(--bone-muted)" }}
            >
              Don&apos;t have the code? Request access →
            </button>
          </form>
        )}

        {/* ── Request access view ── */}
        {view === "request" && (
          <div className="w-full flex flex-col gap-4 text-center">
            <p
              className="text-sm leading-relaxed opacity-60"
              style={{ fontFamily: "Inter, sans-serif", color: "var(--bone-muted)" }}
            >
              Send a request to the admin. They&apos;ll be notified with your device info.
            </p>
            <button
              onClick={handleRequestAccess}
              disabled={requesting}
              className="w-full py-3 text-xs tracking-[0.25em] uppercase transition-all disabled:opacity-40"
              style={{
                background: "rgba(34,211,238,0.08)",
                border: "1px solid rgba(34,211,238,0.35)",
                color: "var(--cyan)",
                fontFamily: "var(--font-jetbrains-mono)",
              }}
            >
              {requesting ? "Sending…" : "Send Request"}
            </button>
            <button
              type="button"
              onClick={() => setView("unlock")}
              className="text-xs opacity-30 hover:opacity-60 transition-opacity"
              style={{ fontFamily: "var(--font-jetbrains-mono)", color: "var(--bone-muted)" }}
            >
              ← Back
            </button>
          </div>
        )}

        {/* ── Confirmation ── */}
        {view === "requested" && (
          <div className="w-full flex flex-col items-center gap-4 text-center py-2">
            <div
              className="text-3xl"
              style={{ filter: "drop-shadow(0 0 12px rgba(34,211,238,0.4))" }}
            >
              ✓
            </div>
            <p
              className="text-sm leading-relaxed"
              style={{ fontFamily: "var(--font-fraunces)", color: "var(--bone)", fontStyle: "italic" }}
            >
              Request sent. Admin has been notified.
            </p>
            <p
              className="text-xs opacity-40"
              style={{ fontFamily: "var(--font-jetbrains-mono)", color: "var(--bone-muted)" }}
            >
              They&apos;ll reach out if access is granted.
            </p>
            <button
              type="button"
              onClick={() => { setView("unlock"); setCode(""); }}
              className="text-xs opacity-30 hover:opacity-60 transition-opacity"
              style={{ fontFamily: "var(--font-jetbrains-mono)", color: "var(--bone-muted)" }}
            >
              ← Back to unlock
            </button>
          </div>
        )}
      </div>

      <p
        className="text-xs opacity-20"
        style={{
          fontFamily: "var(--font-jetbrains-mono)",
          color: "var(--bone-muted)",
          letterSpacing: "0.2em",
        }}
      >
        SOIL CREST NATURALS · 2025
      </p>
    </div>
  );
}
