"use client";

import { useCallback, useEffect, useState } from "react";
import { parseUA, maskIP, timeAgo, type LogEntry } from "@/lib/access-log";

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div
      className="flex flex-col gap-1 p-5 rounded"
      style={{ background: "rgba(34,211,238,0.04)", border: "1px solid rgba(34,211,238,0.12)" }}
    >
      <span
        className="text-xs tracking-widest uppercase opacity-50"
        style={{ fontFamily: "var(--font-jetbrains-mono)", color: "var(--cyan)" }}
      >
        {label}
      </span>
      <span
        className="text-3xl font-medium"
        style={{ fontFamily: "var(--font-fraunces)", color: "var(--bone)" }}
      >
        {value}
      </span>
      {sub && (
        <span
          className="text-xs opacity-40"
          style={{ fontFamily: "var(--font-jetbrains-mono)", color: "var(--bone-muted)" }}
        >
          {sub}
        </span>
      )}
    </div>
  );
}

// ── Mini bar chart — last 7 days ───────────────────────────────────────────
function ActivityBars({ logs }: { logs: LogEntry[] }) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  });

  const counts = days.map((start) => {
    const end = start + 86_400_000;
    return logs.filter((l) => l.ts >= start && l.ts < end).length;
  });

  const max = Math.max(...counts, 1);
  const labels = days.map((ts) => {
    const d = new Date(ts);
    return d.toLocaleDateString("en-IN", { weekday: "short" }).slice(0, 2);
  });

  return (
    <div className="flex items-end gap-2 h-16">
      {counts.map((count, i) => (
        <div key={i} className="flex flex-col items-center gap-1 flex-1">
          <div
            className="w-full rounded-sm transition-all"
            style={{
              height: `${Math.max(4, (count / max) * 48)}px`,
              background: count > 0 ? "rgba(34,211,238,0.5)" : "rgba(34,211,238,0.08)",
            }}
          />
          <span
            className="text-xs opacity-30"
            style={{ fontFamily: "var(--font-jetbrains-mono)", color: "var(--cyan)", fontSize: "9px" }}
          >
            {labels[i]}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── CSV export ────────────────────────────────────────────────────────────────
function exportCSV(logs: LogEntry[]) {
  const header = "ID,Timestamp,IP,Browser,OS,User Agent\n";
  const rows = logs.map((l) => {
    const { browser, os } = parseUA(l.ua);
    const ts = new Date(l.ts).toISOString();
    const safeUA = `"${l.ua.replace(/"/g, "'")}"`;
    return `${l.id},${ts},${maskIP(l.ip)},${browser},${os},${safeUA}`;
  });
  const blob = new Blob([header + rows.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `sc-audit-${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Main dashboard ─────────────────────────────────────────────────────────
export function AuditDashboard() {
  const [logs, setLogs]       = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(Date.now());

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/audit-log");
    if (res.ok) {
      const { logs: data } = await res.json();
      setLogs(data ?? []);
    }
    setLastRefresh(Date.now());
    setLoading(false);
  }, []);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  async function handleClear() {
    if (!confirm("Clear all access logs? This cannot be undone.")) return;
    setClearing(true);
    await fetch("/api/audit-log", { method: "DELETE" });
    setLogs([]);
    setClearing(false);
  }

  function handleSignOut() {
    document.cookie = "sc_audit=; path=/; max-age=0";
    window.location.reload();
  }

  // ── Computed stats ────────────────────────────────────────────────────────
  const now = Date.now();
  const last24h  = logs.filter((l) => now - l.ts < 86_400_000).length;
  const uniqueIPs = new Set(logs.map((l) => l.ip)).size;
  const lastAccess = logs.length > 0 ? timeAgo(logs[0].ts) : "—";

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--void)", color: "var(--bone)" }}
    >
      {/* ── Top nav ── */}
      <header
        className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 backdrop-blur-sm"
        style={{ borderBottom: "1px solid rgba(34,211,238,0.1)", background: "rgba(2,0,20,0.85)" }}
      >
        <div className="flex items-center gap-3">
          <a
            href="/"
            className="text-xs opacity-40 hover:opacity-70 transition-opacity"
            style={{ fontFamily: "var(--font-jetbrains-mono)", color: "var(--cyan)" }}
          >
            ← Dossier
          </a>
          <span className="opacity-20" style={{ color: "var(--cyan)" }}>|</span>
          <span
            className="text-xs tracking-widest uppercase"
            style={{ fontFamily: "var(--font-jetbrains-mono)", color: "var(--cyan)" }}
          >
            FIG.AX · Audit Console
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span
            className="text-xs opacity-30 hidden sm:block"
            style={{ fontFamily: "var(--font-jetbrains-mono)", color: "var(--bone-muted)" }}
          >
            Updated {timeAgo(lastRefresh)}
          </span>
          <button
            onClick={fetchLogs}
            disabled={loading}
            className="text-xs px-3 py-1.5 rounded transition-all disabled:opacity-40"
            style={{
              background: "rgba(34,211,238,0.07)",
              border: "1px solid rgba(34,211,238,0.2)",
              color: "var(--cyan)",
              fontFamily: "var(--font-jetbrains-mono)",
            }}
          >
            {loading ? "···" : "↻ Refresh"}
          </button>
          <button
            onClick={handleSignOut}
            className="text-xs px-3 py-1.5 rounded transition-all opacity-50 hover:opacity-90"
            style={{
              background: "rgba(217,70,239,0.06)",
              border: "1px solid rgba(217,70,239,0.18)",
              color: "var(--pink)",
              fontFamily: "var(--font-jetbrains-mono)",
            }}
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="flex-1 px-4 sm:px-8 py-8 max-w-5xl mx-auto w-full space-y-8">

        {/* ── Page title ── */}
        <div>
          <h1
            className="text-3xl sm:text-4xl font-medium"
            style={{ fontFamily: "var(--font-fraunces)", color: "var(--bone)" }}
          >
            Access Audit
          </h1>
          <p
            className="text-xs opacity-40 mt-1"
            style={{ fontFamily: "var(--font-jetbrains-mono)", color: "var(--bone-muted)" }}
          >
            Every successful dossier unlock is recorded here.
          </p>
        </div>

        {/* ── Stats row ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard label="Total Unlocks" value={logs.length} />
          <StatCard label="Last 24h" value={last24h} />
          <StatCard label="Unique IPs" value={uniqueIPs} />
          <StatCard label="Last Access" value={lastAccess} />
        </div>

        {/* ── Activity chart ── */}
        <div
          className="p-5 rounded"
          style={{ background: "rgba(34,211,238,0.03)", border: "1px solid rgba(34,211,238,0.1)" }}
        >
          <p
            className="text-xs tracking-widest uppercase opacity-40 mb-4"
            style={{ fontFamily: "var(--font-jetbrains-mono)", color: "var(--cyan)" }}
          >
            Last 7 Days
          </p>
          <ActivityBars logs={logs} />
        </div>

        {/* ── Log table ── */}
        <div
          className="rounded overflow-hidden"
          style={{ border: "1px solid rgba(34,211,238,0.12)" }}
        >
          {/* Table header */}
          <div
            className="grid grid-cols-4 gap-4 px-5 py-3 text-xs tracking-widest uppercase opacity-40"
            style={{
              fontFamily: "var(--font-jetbrains-mono)",
              color: "var(--cyan)",
              borderBottom: "1px solid rgba(34,211,238,0.1)",
              background: "rgba(34,211,238,0.03)",
            }}
          >
            <span>Time</span>
            <span>IP</span>
            <span>Browser</span>
            <span>OS</span>
          </div>

          {/* Rows */}
          <div className="divide-y" style={{ borderColor: "rgba(34,211,238,0.07)" }}>
            {loading && (
              <div className="px-5 py-8 text-center">
                <span
                  className="text-xs opacity-30 tracking-widest"
                  style={{ fontFamily: "var(--font-jetbrains-mono)", color: "var(--cyan)" }}
                >
                  Loading…
                </span>
              </div>
            )}

            {!loading && logs.length === 0 && (
              <div className="px-5 py-8 text-center">
                <span
                  className="text-xs opacity-30 tracking-widest"
                  style={{ fontFamily: "var(--font-jetbrains-mono)", color: "var(--bone-muted)" }}
                >
                  No access events yet. Logs appear after the first unlock.
                </span>
              </div>
            )}

            {logs.map((log) => {
              const { browser, os } = parseUA(log.ua);
              return (
                <div
                  key={log.id}
                  className="grid grid-cols-4 gap-4 px-5 py-3 text-xs hover:bg-white/[0.02] transition-colors"
                  style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                >
                  <span title={new Date(log.ts).toISOString()} style={{ color: "var(--bone)" }}>
                    {timeAgo(log.ts)}
                  </span>
                  <span style={{ color: "var(--cyan)", opacity: 0.7 }}>
                    {maskIP(log.ip)}
                  </span>
                  <span style={{ color: "var(--bone-muted)" }}>
                    {browser}
                  </span>
                  <span style={{ color: "var(--bone-muted)" }}>
                    {os}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Action bar ── */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <button
            onClick={() => exportCSV(logs)}
            disabled={logs.length === 0}
            className="text-xs px-4 py-2 rounded transition-all disabled:opacity-30"
            style={{
              background: "rgba(34,211,238,0.06)",
              border: "1px solid rgba(34,211,238,0.2)",
              color: "var(--cyan)",
              fontFamily: "var(--font-jetbrains-mono)",
            }}
          >
            ↓ Export CSV ({logs.length} records)
          </button>

          <button
            onClick={handleClear}
            disabled={logs.length === 0 || clearing}
            className="text-xs px-4 py-2 rounded transition-all disabled:opacity-30"
            style={{
              background: "rgba(217,70,239,0.04)",
              border: "1px solid rgba(217,70,239,0.18)",
              color: "var(--pink)",
              fontFamily: "var(--font-jetbrains-mono)",
            }}
          >
            {clearing ? "Clearing…" : "Clear all logs"}
          </button>
        </div>

      </main>

      {/* Footer */}
      <footer className="py-6 text-center">
        <p
          className="text-xs opacity-15"
          style={{ fontFamily: "var(--font-jetbrains-mono)", color: "var(--bone-muted)", letterSpacing: "0.2em" }}
        >
          SOIL CREST NATURALS · INTERNAL AUDIT · {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
