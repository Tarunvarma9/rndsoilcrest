"use client";

import { useEffect, useRef, useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────
type AgentId =
  | "GT_ROUTING"
  | "FORMULATION"
  | "SOURCING"
  | "COMPLIANCE"
  | "QUALITY"
  | "COST"
  | "MARKET";

type Message = { role: "user" | "assistant"; content: string };

// ── Agent registry ────────────────────────────────────────────────────────────
const AGENTS: { id: AgentId; label: string; color: string; hint: string; isRouter?: boolean }[] = [
  { id: "GT_ROUTING",  label: "GT-Routing",  color: "#22d3ee", hint: "Auto-routes to best specialist", isRouter: true },
  { id: "FORMULATION", label: "Formulation", color: "#22d3ee", hint: "Ingredients & ratios" },
  { id: "SOURCING",    label: "Sourcing",    color: "#D4851E", hint: "Co-packers & CMOs" },
  { id: "COMPLIANCE",  label: "Compliance",  color: "#C4324E", hint: "FSSAI & regulations" },
  { id: "QUALITY",     label: "Quality",     color: "#52C046", hint: "Testing & stability" },
  { id: "COST",        label: "Cost",        color: "#9ca3af", hint: "Budget & phases" },
  { id: "MARKET",      label: "Market",      color: "#a78bfa", hint: "Positioning & channels" },
];

const AGENT_COLOR: Record<string, string> = Object.fromEntries(AGENTS.map((a) => [a.id, a.color]));

const MONO  = "var(--font-jetbrains-mono)";
const SERIF = "var(--font-fraunces)";
const SANS  = "var(--font-inter)";

// ── GT-Routing avatar — fills its container as a circle ───────────────────────
function GTAvatar({ size, ring = false }: { size: number; ring?: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/gt-routing.webp"
      alt="GT-Routing"
      width={size}
      height={size}
      style={{
        width: size,
        height: size,
        objectFit: "cover",
        objectPosition: "center top",
        borderRadius: "50%",
        display: "block",
        flexShrink: 0,
        border: ring ? "1.5px solid rgba(34,211,238,0.5)" : "none",
      }}
    />
  );
}

// ── Specialist bot avatar ─────────────────────────────────────────────────────
function BotIcon({ color = "#22d3ee", size = 26 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="7" width="16" height="2.2" rx="1.1" fill={color} opacity="0.85"/>
      <rect x="9.5" y="2.5" width="9" height="5.2" rx="1.2" fill={color} opacity="0.65"/>
      <line x1="18.5" y1="2.5" x2="21" y2="5.5" stroke={color} strokeWidth="0.9" strokeLinecap="round" opacity="0.5"/>
      <circle cx="21.4" cy="6" r="1" fill={color} opacity="0.4"/>
      <rect x="6" y="9" width="16" height="13" rx="2.5" stroke={color} strokeWidth="1" fill={color} fillOpacity="0.07"/>
      <circle cx="10.5" cy="14.5" r="1.8" fill={color} opacity="0.9"/>
      <circle cx="17.5" cy="14.5" r="1.8" fill={color} opacity="0.9"/>
      <circle cx="11.1" cy="14"   r="0.5" fill="#ffffff" opacity="0.6"/>
      <circle cx="18.1" cy="14"   r="0.5" fill="#ffffff" opacity="0.6"/>
      <line x1="10" y1="19.5" x2="18" y2="19.5" stroke={color} strokeWidth="0.9" strokeLinecap="round" opacity="0.45"/>
    </svg>
  );
}

// ── User bubble avatar ────────────────────────────────────────────────────────
function UserIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="8" r="3.5" stroke="rgba(240,238,255,0.35)" strokeWidth="1"/>
      <path d="M5 20c0-3.866 3.134-7 7-7s7 3.134 7 7"
        stroke="rgba(240,238,255,0.35)" strokeWidth="1" strokeLinecap="round"/>
    </svg>
  );
}

// ── Parse GT-Routing attribution tag ─────────────────────────────────────────
function parseRoute(content: string): { routedTo: string | null; body: string } {
  const match = content.match(/^\[ROUTE:(\w+)\]\s*\n*/);
  if (match) return { routedTo: match[1], body: content.slice(match[0].length) };
  return { routedTo: null, body: content };
}

// ── Route attribution badge ───────────────────────────────────────────────────
function RouteBadge({ agent }: { agent: string }) {
  const color = AGENT_COLOR[agent] ?? "#22d3ee";
  const label = AGENTS.find((a) => a.id === agent)?.label ?? agent;
  return (
    <div className="flex items-center gap-2 mb-3">
      <div
        className="flex items-center gap-2 px-2.5 py-1 rounded"
        style={{
          fontFamily: MONO,
          fontSize: "10px",
          color,
          background: `${color}10`,
          border: `1px solid ${color}30`,
        }}
      >
        <GTAvatar size={14} ring />
        <span style={{ opacity: 0.6 }}>routed to</span>
        <span style={{ fontWeight: 700, letterSpacing: "0.05em" }}>{label.toUpperCase()}</span>
      </div>
    </div>
  );
}

// ── Quick prompts ─────────────────────────────────────────────────────────────
const QUICK_PROMPTS = [
  { label: "Tablet compression ratio?",   emoji: "💊" },
  { label: "Co-packer for shots?",        emoji: "🏭" },
  { label: "FSSAI license for gummies?",  emoji: "📋" },
  { label: "Phase 3 budget estimate?",    emoji: "₹" },
];

// ── Main component ────────────────────────────────────────────────────────────
export function AgentConsole({ onClose }: { onClose: () => void }) {
  const [activeAgent, setActiveAgent] = useState<AgentId>("GT_ROUTING");
  const [histories, setHistories] = useState<Record<AgentId, Message[]>>(
    Object.fromEntries(AGENTS.map((a) => [a.id, []])) as unknown as Record<AgentId, Message[]>
  );
  const [input, setInput]           = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError]           = useState<string | null>(null);
  const streamRef = useRef<string>("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);

  const messages   = histories[activeAgent];
  const activeMeta = AGENTS.find((a) => a.id === activeAgent)!;
  const activeColor = activeMeta.color;
  const isRouterMode = !!activeMeta.isRouter;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  useEffect(() => {
    setError(null);
    inputRef.current?.focus();
  }, [activeAgent]);

  async function send(text?: string) {
    const msg = (text ?? input).trim();
    if (!msg || isStreaming) return;
    setInput("");
    setError(null);

    const agentId = activeAgent;
    const userMsg: Message = { role: "user", content: msg };
    const next = [...histories[agentId], userMsg];
    setHistories((h) => ({ ...h, [agentId]: next }));
    setIsStreaming(true);
    streamRef.current = "";

    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentId, messages: next }),
      });

      if (!res.ok || !res.body) {
        let errMsg = "Something went wrong.";
        try { const d = (await res.json()) as { error?: string }; errMsg = d.error ?? errMsg; } catch { /* */ }
        if (res.status === 503) errMsg = "ANTHROPIC_API_KEY not configured in .env.local";
        if (res.status === 429) errMsg = "Rate limit reached. Wait a moment.";
        setError(errMsg);
        return;
      }

      setHistories((h) => ({ ...h, [agentId]: [...next, { role: "assistant", content: "" }] }));

      const reader  = res.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        streamRef.current += decoder.decode(value, { stream: true });
        const cur = streamRef.current;
        setHistories((prev) => {
          const msgs = [...prev[agentId]];
          msgs[msgs.length - 1] = { role: "assistant", content: cur };
          return { ...prev, [agentId]: msgs };
        });
      }
    } catch {
      setError("Network error. Check your connection.");
    } finally {
      setIsStreaming(false);
    }
  }

  const isThinking =
    isStreaming && messages.length > 0 && messages[messages.length - 1].role === "user";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(6,4,2,0.95)", backdropFilter: "blur(16px)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl flex flex-col rounded-lg"
        style={{
          height: "min(92vh, 720px)",
          background: "rgba(9,7,4,0.99)",
          border: "1px solid rgba(34,211,238,0.2)",
          boxShadow: "0 0 0 1px rgba(34,211,238,0.03), 0 0 100px rgba(34,211,238,0.05), 0 50px 100px rgba(0,0,0,0.7)",
        }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="GT-Routing R&D Console"
      >

        {/* ── Header ──────────────────────────────────────────────────────────── */}
        <div
          className="flex items-center justify-between px-5 py-3 shrink-0"
          style={{ borderBottom: "1px solid rgba(34,211,238,0.09)" }}
        >
          {/* Left: avatar + titles */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <GTAvatar size={36} ring />
              {/* Live pulse dot */}
              <span
                className="absolute bottom-0 right-0 block w-2.5 h-2.5 rounded-full border-2"
                style={{
                  background: "#22d3ee",
                  borderColor: "rgba(9,7,4,0.99)",
                  boxShadow: "0 0 6px #22d3ee",
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p
                  className="text-sm font-semibold leading-none"
                  style={{ fontFamily: MONO, color: "var(--bone)" }}
                >
                  GT-Routing
                </p>
                <span
                  className="text-xs px-1.5 py-0.5 rounded-sm"
                  style={{
                    fontFamily: MONO,
                    fontSize: "8px",
                    color: "#22d3ee",
                    background: "rgba(34,211,238,0.12)",
                    border: "1px solid rgba(34,211,238,0.25)",
                    letterSpacing: "0.1em",
                  }}
                >
                  LIVE
                </span>
              </div>
              <p
                className="text-xs mt-0.5 opacity-40"
                style={{ fontFamily: MONO, color: "var(--bone-muted)" }}
              >
                claude-sonnet-4-6 · FIG. 09
              </p>
            </div>
          </div>

          {/* Right: title + ESC */}
          <div className="flex items-center gap-4">
            <h2
              className="text-base font-medium leading-none hidden sm:block"
              style={{ fontFamily: SERIF, color: "rgba(255,255,255,0.5)" }}
            >
              R&D Agent Console
            </h2>
            <button
              onClick={onClose}
              className="text-xs opacity-40 hover:opacity-90 transition-opacity px-2.5 py-1.5 rounded"
              style={{
                fontFamily: MONO,
                color: "var(--bone-muted)",
                border: "1px solid rgba(34,211,238,0.12)",
              }}
            >
              ESC
            </button>
          </div>
        </div>

        {/* ── Agent tabs ────────────────────────────────────────────────────── */}
        <div
          className="flex items-center gap-1 px-4 pt-2.5 pb-2 overflow-x-auto shrink-0"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
        >
          {AGENTS.map((agent) => {
            const active = activeAgent === agent.id;
            return (
              <button
                key={agent.id}
                onClick={() => setActiveAgent(agent.id)}
                title={agent.hint}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs whitespace-nowrap rounded transition-all"
                style={{
                  fontFamily: MONO,
                  color: active ? agent.color : "rgba(255,255,255,0.3)",
                  background: active ? `${agent.color}12` : "transparent",
                  border: active ? `1px solid ${agent.color}35` : "1px solid transparent",
                  fontSize: "11px",
                }}
              >
                {agent.isRouter ? (
                  <GTAvatar size={14} ring={active} />
                ) : (
                  active && <BotIcon color={agent.color} size={12} />
                )}
                {agent.label}
                {agent.isRouter && (
                  <span
                    style={{
                      fontSize: "8px",
                      color: active ? agent.color : "rgba(255,255,255,0.18)",
                      letterSpacing: "0.12em",
                    }}
                  >
                    AUTO
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ── Messages ─────────────────────────────────────────────────────── */}
        <div
          className="flex-1 overflow-y-auto px-5 py-5 space-y-4 min-h-0"
          style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(34,211,238,0.1) transparent" }}
        >

          {/* ── Empty state ── */}
          {messages.length === 0 && !isStreaming && (
            <div className="flex flex-col items-center justify-center h-full gap-6 pb-4">

              {/* Glowing avatar ring */}
              <div className="relative flex items-center justify-center">
                {/* Outer pulse ring */}
                <div
                  className="absolute rounded-full animate-ping"
                  style={{
                    width: 112, height: 112,
                    background: `${activeColor}08`,
                    border: `1px solid ${activeColor}20`,
                  }}
                />
                {/* Mid ring */}
                <div
                  className="absolute rounded-full"
                  style={{
                    width: 100, height: 100,
                    border: `1px solid ${activeColor}25`,
                  }}
                />
                {/* Avatar */}
                <div
                  className="relative rounded-full overflow-hidden"
                  style={{
                    width: 88, height: 88,
                    border: `2px solid ${activeColor}55`,
                    boxShadow: `0 0 0 4px ${activeColor}10, 0 0 30px ${activeColor}20`,
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/gt-routing.webp"
                    alt="GT-Routing"
                    style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block" }}
                  />
                </div>
              </div>

              {/* Labels */}
              <div className="text-center space-y-2">
                <p
                  className="text-sm tracking-[0.25em] uppercase"
                  style={{ fontFamily: MONO, color: activeColor }}
                >
                  {isRouterMode ? "GT-Routing · Active" : `${activeMeta.label} Agent`}
                </p>
                <p
                  className="text-xs max-w-xs mx-auto leading-relaxed opacity-35"
                  style={{ fontFamily: SANS, color: "var(--bone-muted)" }}
                >
                  {isRouterMode
                    ? "Ask anything. GT-Routing reads your question and dispatches it to the most qualified specialist automatically."
                    : `${activeMeta.hint} — ask anything about the Soil Crest R&D pipeline.`}
                </p>
              </div>

              {/* Specialist chips */}
              {isRouterMode && (
                <div className="flex flex-wrap justify-center gap-1.5">
                  {AGENTS.filter((a) => !a.isRouter).map((a) => (
                    <button
                      key={a.id}
                      onClick={() => setActiveAgent(a.id)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded transition-all hover:opacity-90"
                      style={{
                        fontFamily: MONO,
                        fontSize: "10px",
                        color: a.color,
                        background: `${a.color}0e`,
                        border: `1px solid ${a.color}28`,
                      }}
                    >
                      <BotIcon color={a.color} size={10}/>
                      {a.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Message list ── */}
          {messages.map((msg, i) => {
            const isLast = i === messages.length - 1;
            const showCursor = isLast && msg.role === "assistant" && isStreaming && msg.content.length > 0;

            if (msg.role === "user") {
              return (
                <div key={i} className="flex items-end justify-end gap-2.5">
                  <div
                    className="max-w-[78%] px-4 py-3 rounded-lg rounded-br-sm text-sm"
                    style={{
                      fontFamily: SANS,
                      background: "rgba(34,211,238,0.08)",
                      border: "1px solid rgba(34,211,238,0.18)",
                      color: "var(--bone)",
                      whiteSpace: "pre-wrap",
                      lineHeight: "1.6",
                    }}
                  >
                    {msg.content}
                  </div>
                  <div
                    className="shrink-0 mb-1 flex items-center justify-center rounded-full"
                    style={{ width: 30, height: 30, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    <UserIcon size={16}/>
                  </div>
                </div>
              );
            }

            // ── Assistant message ──
            const { routedTo, body } = parseRoute(msg.content);
            const routeColor = routedTo ? (AGENT_COLOR[routedTo] ?? activeColor) : activeColor;

            return (
              <div key={i} className="flex items-start gap-2.5">
                {/* Avatar */}
                <div
                  className="shrink-0 mt-0.5 rounded-full overflow-hidden"
                  style={{
                    width: 34, height: 34,
                    border: `1.5px solid ${routeColor}35`,
                    boxShadow: `0 0 8px ${routeColor}18`,
                  }}
                >
                  {isRouterMode ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src="/gt-routing.webp"
                      alt="GT"
                      style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block" }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center" style={{ background: `${activeColor}0d` }}>
                      <BotIcon color={activeColor} size={20}/>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {isRouterMode && routedTo && <RouteBadge agent={routedTo}/>}

                  {/* Routing in progress */}
                  {isRouterMode && !routedTo && msg.content.length > 0 && isStreaming && isLast && (
                    <div className="flex items-center gap-1.5 mb-2.5 opacity-50">
                      <GTAvatar size={12}/>
                      <span className="text-xs animate-pulse" style={{ fontFamily: MONO, color: activeColor }}>
                        analysing &amp; routing…
                      </span>
                    </div>
                  )}

                  <div
                    className="px-4 py-3 rounded-lg rounded-tl-sm text-sm"
                    style={{
                      fontFamily: SANS,
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      color: "var(--bone)",
                      whiteSpace: "pre-wrap",
                      lineHeight: "1.72",
                      minHeight: 44,
                    }}
                  >
                    {body || (isStreaming && isLast ? "" : "—")}
                    {showCursor && (
                      <span className="animate-pulse ml-0.5" style={{ color: routeColor, opacity: 0.7 }}>▌</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* ── Thinking indicator ── */}
          {isThinking && (
            <div className="flex items-start gap-2.5">
              <div
                className="shrink-0 rounded-full overflow-hidden"
                style={{ width: 34, height: 34, border: `1.5px solid ${activeColor}35` }}
              >
                {isRouterMode ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src="/gt-routing.webp" alt="GT" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block" }}/>
                ) : (
                  <div className="w-full h-full flex items-center justify-center" style={{ background: `${activeColor}0d` }}>
                    <BotIcon color={activeColor} size={20}/>
                  </div>
                )}
              </div>
              <div className="flex-1">
                {isRouterMode && (
                  <div className="flex items-center gap-1.5 mb-2.5 opacity-45">
                    <GTAvatar size={12}/>
                    <span className="text-xs animate-pulse" style={{ fontFamily: MONO, color: activeColor }}>
                      analysing &amp; routing…
                    </span>
                  </div>
                )}
                <div
                  className="inline-flex items-center gap-1.5 px-4 py-3 rounded-lg rounded-tl-sm"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  {[0, 0.2, 0.4].map((delay, di) => (
                    <span
                      key={di}
                      className="block rounded-full animate-bounce"
                      style={{ width: 6, height: 6, background: activeColor, opacity: 0.5, animationDelay: `${delay}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Error ── */}
          {error && (
            <div className="flex items-start gap-2.5">
              <div
                className="shrink-0 rounded-full overflow-hidden"
                style={{ width: 34, height: 34, border: "1.5px solid rgba(196,50,78,0.4)" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/gt-routing.webp" alt="GT" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block" }}/>
              </div>
              <div
                className="flex-1 px-4 py-3 rounded-lg rounded-tl-sm text-xs"
                style={{
                  fontFamily: MONO, color: "#C4324E",
                  background: "rgba(196,50,78,0.06)",
                  border: "1px solid rgba(196,50,78,0.18)",
                  lineHeight: "1.6",
                }}
              >
                {error}
              </div>
            </div>
          )}

          <div ref={bottomRef}/>
        </div>

        {/* ── Input bar ─────────────────────────────────────────────────────── */}
        <div
          className="px-4 pb-4 pt-3 shrink-0"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          {/* Quick prompts — only in router mode before any messages */}
          {isRouterMode && messages.length === 0 && (
            <div className="grid grid-cols-2 gap-1.5 mb-3">
              {QUICK_PROMPTS.map((q) => (
                <button
                  key={q.label}
                  onClick={() => send(q.label)}
                  disabled={isStreaming}
                  className="flex items-center gap-2 px-3 py-2 rounded text-left transition-all hover:opacity-90 disabled:opacity-30"
                  style={{
                    fontFamily: SANS,
                    fontSize: "11px",
                    color: "rgba(255,255,255,0.55)",
                    background: "rgba(34,211,238,0.04)",
                    border: "1px solid rgba(34,211,238,0.12)",
                  }}
                >
                  <span style={{ fontSize: "14px" }}>{q.emoji}</span>
                  {q.label}
                </button>
              ))}
            </div>
          )}

          <form
            onSubmit={(e) => { e.preventDefault(); send(); }}
            className="flex gap-2"
          >
            <div className="relative flex-1">
              {isRouterMode && (
                <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                  <GTAvatar size={18} />
                </div>
              )}
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
                }}
                placeholder={
                  isRouterMode
                    ? "Ask anything — GT-Routing will dispatch…"
                    : `Ask ${activeMeta.label} agent…`
                }
                disabled={isStreaming}
                className="w-full py-2.5 pr-4 text-sm outline-none rounded"
                style={{
                  paddingLeft: isRouterMode ? "2.5rem" : "1rem",
                  background: "rgba(255,255,255,0.04)",
                  border: `1px solid ${isStreaming ? "rgba(255,255,255,0.05)" : "rgba(34,211,238,0.16)"}`,
                  color: "var(--bone)",
                  fontFamily: SANS,
                  transition: "border-color 0.2s",
                }}
                autoFocus
              />
            </div>
            <button
              type="submit"
              disabled={!input.trim() || isStreaming}
              className="flex items-center gap-2 px-4 py-2.5 text-xs tracking-widest uppercase rounded transition-all disabled:opacity-20"
              style={{
                background: isStreaming ? "rgba(34,211,238,0.03)" : "rgba(34,211,238,0.1)",
                border: "1px solid rgba(34,211,238,0.25)",
                color: "var(--cyan)",
                fontFamily: MONO,
              }}
            >
              {isRouterMode && !isStreaming && <GTAvatar size={16}/>}
              {isStreaming ? <span className="animate-pulse tracking-widest">···</span> : "Send"}
            </button>
          </form>

          <p className="text-xs mt-2 opacity-15" style={{ fontFamily: MONO, color: "var(--bone-muted)" }}>
            Enter · send — Esc · close — tabs · direct agent access
          </p>
        </div>
      </div>
    </div>
  );
}
