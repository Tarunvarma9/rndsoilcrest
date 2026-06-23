"use client";

import { useEffect, useState } from "react";
import type { Format } from "@/lib/formats";

function RefImage({ src, label, brand }: { src: string; label: string; brand?: string }) {
  const [status, setStatus] = useState<"loading" | "loaded" | "failed">("loading");

  return (
    <div
      className="rounded overflow-hidden"
      style={{ border: "1px solid rgba(34,211,238,0.15)" }}
    >
      {status !== "failed" && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={label}
          className="w-full object-cover transition-opacity duration-500"
          style={{
            height: "140px",
            opacity: status === "loaded" ? 1 : 0,
            color: "transparent",
          }}
          onLoad={() => setStatus("loaded")}
          onError={() => setStatus("failed")}
        />
      )}

      {status === "loading" && (
        <div
          className="w-full flex items-center justify-center"
          style={{ height: "140px", background: "rgba(34,211,238,0.04)" }}
        >
          <span
            className="text-xs opacity-30 tracking-widest"
            style={{ fontFamily: "var(--font-jetbrains-mono)", color: "var(--cyan)" }}
          >
            ···
          </span>
        </div>
      )}

      {status === "failed" && (
        <div
          className="w-full flex items-center justify-center"
          style={{ height: "80px", background: "rgba(34,211,238,0.03)" }}
        >
          <span
            className="text-xs opacity-25 tracking-widest"
            style={{ fontFamily: "var(--font-jetbrains-mono)", color: "var(--bone-muted)" }}
          >
            no image
          </span>
        </div>
      )}

      <div className="px-3 py-2 space-y-0.5">
        <p
          className="text-xs leading-snug"
          style={{ color: "var(--bone-muted)", fontFamily: "var(--font-inter)" }}
        >
          {label}
        </p>
        {brand && (
          <p
            className="text-xs opacity-50"
            style={{ color: "var(--cyan)", fontFamily: "var(--font-jetbrains-mono)" }}
          >
            {brand}
          </p>
        )}
      </div>
    </div>
  );
}

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

  const hasImages = format.referenceImages && format.referenceImages.length > 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(12,10,6,0.88)", backdropFilter: "blur(10px)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg overflow-y-auto max-h-[90vh] rounded"
        style={{
          background: "rgba(18, 14, 8, 0.92)",
          border: "1px solid rgba(34,211,238,0.3)",
          boxShadow: "0 0 40px rgba(34,211,238,0.08), 0 0 80px rgba(34,211,238,0.04)",
          backdropFilter: "blur(20px)",
        }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`FIG. ${String(format.id).padStart(2, "0")} — ${format.name}`}
      >
        {/* Header bar */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid rgba(34,211,238,0.12)" }}
        >
          <div>
            <p
              className="text-xs tracking-[0.2em] uppercase mb-0.5"
              style={{ fontFamily: "var(--font-jetbrains-mono)", color: "var(--cyan)" }}
            >
              FIG. {String(format.id).padStart(2, "0")}
            </p>
            <h2
              className="text-xl font-medium"
              style={{ fontFamily: "var(--font-fraunces)", color: "var(--bone)" }}
            >
              {format.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-xs opacity-50 hover:opacity-100 transition-opacity ml-4 px-2 py-1 rounded"
            style={{
              fontFamily: "var(--font-jetbrains-mono)",
              color: "var(--bone-muted)",
              border: "1px solid rgba(34,211,238,0.2)",
            }}
            aria-label="Close"
          >
            ESC
          </button>
        </div>

        <div className="p-6 space-y-6 text-sm" style={{ fontFamily: "var(--font-inter)" }}>

          {/* Summary */}
          <div>
            <p className="text-xs tracking-widest uppercase mb-1.5"
              style={{ color: "var(--cyan)", fontFamily: "var(--font-jetbrains-mono)" }}>
              Summary
            </p>
            <p style={{ color: "var(--bone-muted)" }}>{format.summary}</p>
          </div>

          {/* Formula Note */}
          <div>
            <p className="text-xs tracking-widest uppercase mb-1.5"
              style={{ color: "var(--cyan)", fontFamily: "var(--font-jetbrains-mono)" }}>
              Formula Note
            </p>
            <p style={{ color: "var(--bone-muted)" }}>{format.formulaNote}</p>
          </div>

          {/* R&D Steps */}
          <div>
            <p className="text-xs tracking-widest uppercase mb-2"
              style={{ color: "var(--cyan)", fontFamily: "var(--font-jetbrains-mono)" }}>
              R&D Steps
            </p>
            <ol className="space-y-1.5 list-none">
              {format.rdSteps.map((step, i) => (
                <li key={i} className="flex gap-2.5" style={{ color: "var(--bone-muted)" }}>
                  <span style={{ color: "var(--cyan)", fontFamily: "var(--font-jetbrains-mono)", flexShrink: 0 }}>
                    {String(i + 1).padStart(2, "0")}.
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          {/* Timeline + Cost */}
          <div
            className="grid grid-cols-2 gap-4 rounded p-4"
            style={{ background: "rgba(34,211,238,0.04)", border: "1px solid rgba(34,211,238,0.1)" }}
          >
            <div>
              <p className="text-xs tracking-widest uppercase mb-1"
                style={{ color: "var(--cyan)", fontFamily: "var(--font-jetbrains-mono)" }}>
                Timeline
              </p>
              <p style={{ color: "var(--bone)" }}>{format.timeline}</p>
            </div>
            <div>
              <p className="text-xs tracking-widest uppercase mb-1"
                style={{ color: "var(--cyan)", fontFamily: "var(--font-jetbrains-mono)" }}>
                Est. Cost
              </p>
              <p style={{ color: "var(--bone)" }}>{format.estimatedCost}</p>
            </div>
          </div>

          {/* Packaging Reference */}
          {hasImages && (
            <div>
              <div className="flex items-center gap-3 mb-3">
                <p
                  className="text-xs tracking-widest uppercase"
                  style={{ color: "var(--cyan)", fontFamily: "var(--font-jetbrains-mono)" }}
                >
                  Packaging Reference
                </p>
                <span
                  className="text-xs px-1.5 py-0.5 rounded"
                  style={{
                    color: "var(--cyan)",
                    fontFamily: "var(--font-jetbrains-mono)",
                    background: "rgba(34,211,238,0.1)",
                    border: "1px solid rgba(34,211,238,0.2)",
                  }}
                >
                  {format.referenceImages!.length}
                </span>
              </div>
              <div className={`grid gap-3 ${format.referenceImages!.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
                {format.referenceImages!.map((img, i) => (
                  <RefImage key={i} src={img.src} label={img.label} brand={img.brand} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
