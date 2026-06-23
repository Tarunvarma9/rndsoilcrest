"use client";

import { useState } from "react";

export function AuditGate() {
  const [code, setCode]       = useState("");
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (code.length < 4) return;
    setLoading(true);
    setError("");

    const res = await fetch("/api/audit-unlock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });

    if (res.ok) {
      window.location.reload();
    } else {
      setError("Access denied.");
      setCode("");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 gap-10">

      {/* Quote */}
      <div className="text-center max-w-xs">
        <p
          className="text-xs tracking-widest uppercase mb-3 opacity-40"
          style={{ fontFamily: "var(--font-jetbrains-mono)", color: "var(--cyan)" }}
        >
          FIG.AX · Audit Console
        </p>
        <blockquote
          className="text-lg leading-snug"
          style={{ fontFamily: "var(--font-fraunces)", color: "var(--bone)", fontStyle: "italic" }}
        >
          &ldquo;What gets measured gets managed.&rdquo;
        </blockquote>
      </div>

      {/* Gate card */}
      <div
        className="fig-card w-full max-w-xs p-8 flex flex-col items-center gap-6"
        style={{ border: "1px solid rgba(34,211,238,0.2)" }}
      >
        <div className="text-center space-y-1">
          <h1
            className="text-2xl font-medium"
            style={{ fontFamily: "var(--font-fraunces)", color: "var(--bone)" }}
          >
            Audit Console
          </h1>
          <p
            className="text-xs opacity-35"
            style={{ fontFamily: "var(--font-jetbrains-mono)", color: "var(--bone-muted)", letterSpacing: "0.15em" }}
          >
            SOIL CREST · RESTRICTED
          </p>
        </div>

        {/* Shield icon */}
        <svg width="36" height="36" viewBox="0 0 40 40" fill="none" aria-hidden="true">
          <path
            d="M20 5L8 10v10c0 7.18 5.14 13.89 12 15.5C27.86 33.89 33 27.18 33 20V10L20 5z"
            stroke="var(--cyan)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.7"
          />
          <path d="M15 20l3.5 3.5L26 15" stroke="var(--cyan)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
          <input
            type="text"
            maxLength={10}
            placeholder="Audit code"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            className="w-full text-center text-lg tracking-[0.35em] py-3 px-4 outline-none placeholder:opacity-25 placeholder:tracking-normal"
            style={{
              background: "rgba(34,211,238,0.05)",
              border: "1px solid rgba(34,211,238,0.25)",
              color: "var(--cyan)",
              fontFamily: "var(--font-jetbrains-mono)",
            }}
            autoFocus
            autoCapitalize="none"
            autoCorrect="off"
            autoComplete="off"
            spellCheck={false}
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
            {loading ? "Verifying…" : "Enter Console"}
          </button>
        </form>
      </div>

      <p
        className="text-xs opacity-20"
        style={{ fontFamily: "var(--font-jetbrains-mono)", color: "var(--bone-muted)", letterSpacing: "0.2em" }}
      >
        SOIL CREST NATURALS · INTERNAL ONLY
      </p>
    </div>
  );
}
