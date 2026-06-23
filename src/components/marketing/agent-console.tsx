"use client";

import { useEffect, useRef, useState } from "react";

type AgentId =
  | "FORMULATION"
  | "SOURCING"
  | "COMPLIANCE"
  | "QUALITY"
  | "COST"
  | "MARKET";

type Message = { role: "user" | "assistant"; content: string };

const AGENTS: { id: AgentId; label: string; color: string }[] = [
  { id: "FORMULATION", label: "Formulation", color: "var(--violet)" },
  { id: "SOURCING", label: "Sourcing", color: "var(--cyan)" },
  { id: "COMPLIANCE", label: "Compliance", color: "var(--pink)" },
  { id: "QUALITY", label: "Quality", color: "var(--violet)" },
  { id: "COST", label: "Cost", color: "var(--cyan)" },
  { id: "MARKET", label: "Market", color: "var(--pink)" },
];

export function AgentConsole({ onClose }: { onClose: () => void }) {
  const [activeAgent, setActiveAgent] = useState<AgentId>("FORMULATION");
  const [histories, setHistories] = useState<Record<AgentId, Message[]>>(
    Object.fromEntries(AGENTS.map((a) => [a.id, []])) as Record<AgentId, Message[]>
  );
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const messages = histories[activeAgent];

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");

    const userMsg: Message = { role: "user", content: text };
    const next = [...messages, userMsg];
    setHistories((h) => ({ ...h, [activeAgent]: next }));
    setLoading(true);

    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentId: activeAgent, messages: next }),
      });
      const data = (await res.json()) as { reply: string; error?: string };
      const reply = data.reply ?? data.error ?? "Something went wrong.";
      setHistories((h) => ({
        ...h,
        [activeAgent]: [...next, { role: "assistant", content: reply }],
      }));
    } catch {
      setHistories((h) => ({
        ...h,
        [activeAgent]: [
          ...next,
          { role: "assistant", content: "Network error. Please try again." },
        ],
      }));
    }
    setLoading(false);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(2, 0, 20, 0.9)", backdropFilter: "blur(8px)" }}
    >
      <div
        className="fig-card w-full max-w-2xl flex flex-col"
        style={{ height: "min(85vh, 640px)" }}
        role="dialog"
        aria-modal="true"
        aria-label="R&D Agent Console"
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: "rgba(139, 92, 246, 0.2)" }}
        >
          <div>
            <p
              className="text-xs tracking-[0.2em] uppercase"
              style={{ fontFamily: "var(--font-jetbrains-mono)", color: "var(--cyan)" }}
            >
              FIG. 09
            </p>
            <h2
              className="text-lg font-medium"
              style={{ fontFamily: "var(--font-fraunces)", color: "var(--bone)" }}
            >
              R&D Agent Console
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-xs opacity-60 hover:opacity-100 transition-opacity"
            style={{ fontFamily: "var(--font-jetbrains-mono)", color: "var(--bone-muted)" }}
            aria-label="Close"
          >
            [ESC]
          </button>
        </div>

        {/* Agent tabs */}
        <div
          className="flex gap-1 px-4 pt-3 pb-1 overflow-x-auto"
          style={{ borderBottom: "1px solid rgba(139, 92, 246, 0.1)" }}
        >
          {AGENTS.map((agent) => (
            <button
              key={agent.id}
              onClick={() => setActiveAgent(agent.id)}
              className="px-3 py-1 text-xs whitespace-nowrap transition-all rounded-sm"
              style={{
                fontFamily: "var(--font-jetbrains-mono)",
                color: activeAgent === agent.id ? agent.color : "var(--bone-muted)",
                background:
                  activeAgent === agent.id
                    ? "rgba(139, 92, 246, 0.12)"
                    : "transparent",
                border:
                  activeAgent === agent.id
                    ? `1px solid ${agent.color}40`
                    : "1px solid transparent",
              }}
            >
              {agent.label}
            </button>
          ))}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {messages.length === 0 && (
            <p
              className="text-xs text-center opacity-40 mt-8"
              style={{ fontFamily: "var(--font-jetbrains-mono)", color: "var(--bone-muted)" }}
            >
              {activeAgent} agent ready. Ask anything about Soil Crest R&D.
            </p>
          )}
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className="max-w-[85%] rounded-sm px-4 py-3 text-sm"
                style={{
                  fontFamily: "var(--font-inter)",
                  background:
                    msg.role === "user"
                      ? "rgba(139, 92, 246, 0.15)"
                      : "rgba(13, 10, 30, 0.8)",
                  border:
                    msg.role === "user"
                      ? "1px solid rgba(139, 92, 246, 0.3)"
                      : "1px solid rgba(139, 92, 246, 0.1)",
                  color: "var(--bone)",
                  whiteSpace: "pre-wrap",
                  lineHeight: "1.6",
                }}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div
                className="px-4 py-3 text-xs rounded-sm"
                style={{
                  fontFamily: "var(--font-jetbrains-mono)",
                  color: "var(--violet)",
                  background: "rgba(139, 92, 246, 0.06)",
                  border: "1px solid rgba(139, 92, 246, 0.15)",
                }}
              >
                thinking…
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div
          className="px-4 pb-4"
          style={{ borderTop: "1px solid rgba(139, 92, 246, 0.1)" }}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="flex gap-2 mt-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder={`Ask ${activeAgent} agent…`}
              className="flex-1 py-2 px-3 text-sm outline-none"
              style={{
                background: "rgba(139, 92, 246, 0.06)",
                border: "1px solid rgba(139, 92, 246, 0.25)",
                color: "var(--bone)",
                fontFamily: "var(--font-inter)",
              }}
              autoFocus
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="px-4 py-2 text-xs tracking-widest uppercase transition-all disabled:opacity-30"
              style={{
                background: "rgba(139, 92, 246, 0.15)",
                border: "1px solid rgba(139, 92, 246, 0.4)",
                color: "var(--violet)",
                fontFamily: "var(--font-jetbrains-mono)",
              }}
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
