"use client";

import { useEffect } from "react";
import type { Format } from "@/lib/formats";

export function FigModal({
  format,
  onClose,
}: {
  format: Format;
  onClose: () => void;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(2, 0, 20, 0.85)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        className="fig-card w-full max-w-lg p-8 overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`FIG. ${String(format.id).padStart(2, "0")} — ${format.name}`}
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <p
              className="text-xs tracking-[0.2em] uppercase mb-1"
              style={{ fontFamily: "var(--font-jetbrains-mono)", color: "var(--cyan)" }}
            >
              FIG. {String(format.id).padStart(2, "0")}
            </p>
            <h2
              className="text-2xl font-medium"
              style={{ fontFamily: "var(--font-fraunces)", color: "var(--bone)" }}
            >
              {format.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-sm ml-4 opacity-60 hover:opacity-100 transition-opacity"
            style={{
              fontFamily: "var(--font-jetbrains-mono)",
              color: "var(--bone-muted)",
            }}
            aria-label="Close"
          >
            [ESC]
          </button>
        </div>

        <div className="space-y-6 text-sm" style={{ fontFamily: "var(--font-inter)" }}>
          <div>
            <p className="text-xs tracking-widest uppercase mb-1" style={{ color: "var(--violet)", fontFamily: "var(--font-jetbrains-mono)" }}>
              Summary
            </p>
            <p style={{ color: "var(--bone-muted)" }}>{format.summary}</p>
          </div>

          <div>
            <p className="text-xs tracking-widest uppercase mb-1" style={{ color: "var(--violet)", fontFamily: "var(--font-jetbrains-mono)" }}>
              Formula Note
            </p>
            <p style={{ color: "var(--bone-muted)" }}>{format.formulaNote}</p>
          </div>

          <div>
            <p className="text-xs tracking-widest uppercase mb-2" style={{ color: "var(--violet)", fontFamily: "var(--font-jetbrains-mono)" }}>
              R&D Steps
            </p>
            <ol className="space-y-1 list-none">
              {format.rdSteps.map((step, i) => (
                <li key={i} className="flex gap-2" style={{ color: "var(--bone-muted)" }}>
                  <span style={{ color: "var(--cyan)", fontFamily: "var(--font-jetbrains-mono)" }}>
                    {String(i + 1).padStart(2, "0")}.
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs tracking-widest uppercase mb-1" style={{ color: "var(--violet)", fontFamily: "var(--font-jetbrains-mono)" }}>
                Timeline
              </p>
              <p style={{ color: "var(--bone)" }}>{format.timeline}</p>
            </div>
            <div>
              <p className="text-xs tracking-widest uppercase mb-1" style={{ color: "var(--violet)", fontFamily: "var(--font-jetbrains-mono)" }}>
                Est. Cost
              </p>
              <p style={{ color: "var(--bone)" }}>{format.estimatedCost}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
