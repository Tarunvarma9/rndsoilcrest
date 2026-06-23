"use client";

import { useState } from "react";

export function AccessGate() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (code.length !== 6) return;
    setLoading(true);
    setError("");

    const res = await fetch("/api/unlock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });

    if (res.ok) {
      window.location.reload();
    } else {
      setError("Invalid access code. Try again.");
      setCode("");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="fig-card w-full max-w-sm p-8 flex flex-col items-center gap-6">
        {/* FIG. 00 label */}
        <div className="text-center">
          <p
            className="text-xs tracking-[0.2em] uppercase mb-2"
            style={{
              fontFamily: "var(--font-jetbrains-mono)",
              color: "var(--cyan)",
            }}
          >
            FIG. 00
          </p>
          <h1
            className="text-2xl font-medium"
            style={{
              fontFamily: "var(--font-fraunces)",
              color: "var(--bone)",
            }}
          >
            R&D Dossier
          </h1>
          <p
            className="text-sm mt-1"
            style={{ color: "var(--bone-muted)", fontFamily: "var(--font-inter)" }}
          >
            Soil Crest Naturals — Confidential
          </p>
        </div>

        {/* SVG lock icon */}
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <rect
            x="8"
            y="18"
            width="24"
            height="16"
            rx="2"
            stroke="var(--cyan)"
            strokeWidth="1.5"
            strokeOpacity="0.7"
          />
          <path
            d="M13 18v-5a7 7 0 0 1 14 0v5"
            stroke="var(--cyan)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeOpacity="0.7"
          />
          <circle cx="20" cy="26" r="2" fill="var(--cyan)" />
        </svg>

        {/* Code input */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <input
            type="password"
            inputMode="numeric"
            maxLength={6}
            placeholder="••••••"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            className="w-full text-center text-2xl tracking-[0.4em] py-3 px-4 rounded-none outline-none placeholder:opacity-30"
            style={{
              background: "rgba(34, 211, 238, 0.05)",
              border: "1px solid rgba(34, 211, 238, 0.28)",
              color: "var(--bone)",
              fontFamily: "var(--font-jetbrains-mono)",
            }}
            autoFocus
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
            disabled={code.length !== 6 || loading}
            className="w-full py-3 text-sm tracking-widest uppercase transition-all disabled:opacity-40"
            style={{
              background: "rgba(34, 211, 238, 0.1)",
              border: "1px solid rgba(34, 211, 238, 0.4)",
              color: "var(--cyan)",
              fontFamily: "var(--font-jetbrains-mono)",
            }}
          >
            {loading ? "Verifying…" : "Unlock"}
          </button>
        </form>
      </div>
    </div>
  );
}
