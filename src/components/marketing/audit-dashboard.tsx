"use client";

import { useCallback, useEffect, useState } from "react";
import {
  type AccessEvent,
  type AccessStats,
  countryFlag,
  deviceIcon,
  maskIP,
  timeAgo,
} from "@/lib/auth-tracker-types";

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div
      className="flex flex-col gap-1 p-5 rounded"
      style={{
        background: "rgba(34,211,238,0.04)",
        border: "1px solid rgba(34,211,238,0.12)",
      }}
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

// ── Mini bar chart — last 7 days ──────────────────────────────────────────────
function ActivityBars({ events }: { events: AccessEvent[] }) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  });

  const counts = days.map((start) =>
    events.filter((e) => e.ts >= start && e.ts < start + 86_400_000).length
  );
  const max = Math.max(...counts, 1);
  const labels = days.map((ts) =>
    new Date(ts).toLocaleDateString("en-IN", { weekday: "short" }).slice(0, 2)
  );

  return (
    <div className="flex items-end gap-2 h-16">
      {counts.map((count, i) => (
        <div key={i} className="flex flex-col items-center gap-1 flex-1">
          <div
            className="w-full rounded-sm transition-all"
            style={{
              height: `${Math.max(4, (count / max) * 48)}px`,
              background:
                count > 0 ? "rgba(34,211,238,0.55)" : "rgba(34,211,238,0.08)",
            }}
          />
          <span
            className="text-xs opacity-30"
            style={{
              fontFamily: "var(--font-jetbrains-mono)",
              color: "var(--cyan)",
              fontSize: "9px",
            }}
          >
            {labels[i]}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Breakdown pill row ────────────────────────────────────────────────────────
function BreakdownRow({
  label,
  data,
}: {
  label: string;
  data: Record<string, number>;
}) {
  const total = Object.values(data).reduce((a, b) => a + b, 0) || 1;
  const sorted = Object.entries(data).sort((a, b) => b[1] - a[1]);

  return (
    <div>
      <p
        className="text-xs tracking-widest uppercase opacity-40 mb-2"
        style={{ fontFamily: "var(--font-jetbrains-mono)", color: "var(--cyan)" }}
      >
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {sorted.map(([name, count]) => (
          <span
            key={name}
            className="text-xs px-2.5 py-1 rounded-full"
            style={{
              background: "rgba(34,211,238,0.08)",
              border: "1px solid rgba(34,211,238,0.15)",
              color: "var(--bone)",
              fontFamily: "var(--font-jetbrains-mono)",
            }}
          >
            {name}{" "}
            <span style={{ color: "var(--cyan)", opacity: 0.7 }}>
              {Math.round((count / total) * 100)}%
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ── CSV export ────────────────────────────────────────────────────────────────
function exportCSV(events: AccessEvent[]) {
  const header =
    "ID,Timestamp,IP,Country,City,DeviceType,Browser,BrowserVersion,OS,OSVersion,Screen,Timezone,Locale\n";
  const rows = events.map((e) => {
    const d = e.device;
    const ts = new Date(e.ts).toISOString();
    const screen = d.screenW ? `${d.screenW}x${d.screenH}` : "";
    return [
      e.id, ts, maskIP(d.ip), d.country, d.city,
      d.deviceType, d.browser, d.browserVersion, d.os, d.osVersion,
      screen, d.timezone ?? "", d.locale,
    ]
      .map((v) => `"${String(v).replace(/"/g, "'")}"`)
      .join(",");
  });
  const blob = new Blob([header + rows.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `sc-audit-${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Main dashboard ────────────────────────────────────────────────────────────
export function AuditDashboard() {
  const [events, setEvents]       = useState<AccessEvent[]>([]);
  const [stats, setStats]         = useState<AccessStats | null>(null);
  const [loading, setLoading]     = useState(true);
  const [clearing, setClearing]   = useState(false);
  const [lastRefresh, setLast]    = useState(Date.now());

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/audit-log");
    if (res.ok) {
      const data = await res.json();
      setEvents(data.events ?? []);
      setStats(data.stats ?? null);
    }
    setLast(Date.now());
    setLoading(false);
  }, []);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  async function handleClear() {
    if (!confirm("Clear all access logs? This cannot be undone.")) return;
    setClearing(true);
    await fetch("/api/audit-log", { method: "DELETE" });
    setEvents([]);
    setStats(null);
    setClearing(false);
  }

  function handleSignOut() {
    document.cookie = "sc_audit=; path=/; max-age=0";
    window.location.reload();
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--void)", color: "var(--bone)" }}
    >
      {/* ── Top nav ── */}
      <header
        className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 backdrop-blur-sm"
        style={{
          borderBottom: "1px solid rgba(34,211,238,0.1)",
          background: "rgba(2,0,20,0.85)",
        }}
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
            className="text-xs px-3 py-1.5 rounded opacity-50 hover:opacity-90 transition-all"
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

      <main className="flex-1 px-4 sm:px-8 py-8 max-w-6xl mx-auto w-full space-y-8">

        {/* ── Title ── */}
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
            Device fingerprint captured on every successful unlock.
          </p>
        </div>

        {/* ── Stats row ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard label="Total Unlocks" value={stats?.total ?? 0} />
          <StatCard label="Last 24h"      value={stats?.last24h ?? 0} />
          <StatCard label="Unique IPs"    value={stats?.uniqueIPs ?? 0} />
          <StatCard
            label="Countries"
            value={stats?.uniqueCountries ?? 0}
            sub={
              stats && events.length > 0
                ? events
                    .map((e) => countryFlag(e.device.country))
                    .filter(Boolean)
                    .slice(0, 6)
                    .join(" ")
                : undefined
            }
          />
        </div>

        {/* ── Activity chart + breakdowns ── */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div
            className="p-5 rounded"
            style={{
              background: "rgba(34,211,238,0.03)",
              border: "1px solid rgba(34,211,238,0.1)",
            }}
          >
            <p
              className="text-xs tracking-widest uppercase opacity-40 mb-4"
              style={{ fontFamily: "var(--font-jetbrains-mono)", color: "var(--cyan)" }}
            >
              Last 7 Days
            </p>
            <ActivityBars events={events} />
          </div>

          <div
            className="p-5 rounded space-y-4"
            style={{
              background: "rgba(34,211,238,0.03)",
              border: "1px solid rgba(34,211,238,0.1)",
            }}
          >
            {stats && (
              <>
                <BreakdownRow label="Device"  data={stats.deviceBreakdown} />
                <BreakdownRow label="Browser" data={stats.browserBreakdown} />
                <BreakdownRow label="OS"      data={stats.osBreakdown} />
              </>
            )}
            {!stats && (
              <p className="text-xs opacity-30" style={{ fontFamily: "var(--font-jetbrains-mono)", color: "var(--bone-muted)" }}>
                No data yet.
              </p>
            )}
          </div>
        </div>

        {/* ── Log table ── */}
        <div
          className="rounded overflow-hidden overflow-x-auto"
          style={{ border: "1px solid rgba(34,211,238,0.12)" }}
        >
          {/* Header */}
          <div
            className="grid gap-3 px-5 py-3 text-xs tracking-widest uppercase opacity-40 min-w-180"
            style={{
              gridTemplateColumns: "6rem 5rem 7rem 6rem 8rem 7rem 7rem 5rem",
              fontFamily: "var(--font-jetbrains-mono)",
              color: "var(--cyan)",
              borderBottom: "1px solid rgba(34,211,238,0.1)",
              background: "rgba(34,211,238,0.03)",
            }}
          >
            <span>Time</span>
            <span>Country</span>
            <span>City</span>
            <span>Device</span>
            <span>Browser</span>
            <span>OS</span>
            <span>Screen</span>
            <span>Timezone</span>
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

            {!loading && events.length === 0 && (
              <div className="px-5 py-10 text-center">
                <p
                  className="text-xs opacity-30 tracking-widest"
                  style={{ fontFamily: "var(--font-jetbrains-mono)", color: "var(--bone-muted)" }}
                >
                  No access events yet. Logs appear after the first unlock.
                </p>
                <p
                  className="text-xs opacity-20 mt-2"
                  style={{ fontFamily: "var(--font-jetbrains-mono)", color: "var(--bone-muted)" }}
                >
                  Add UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN to Vercel env vars to enable persistence.
                </p>
              </div>
            )}

            {events.map((event) => {
              const d = event.device;
              const screen = d.screenW ? `${d.screenW}×${d.screenH}` : "—";
              const tz = d.timezone
                ? d.timezone.split("/").pop()?.replace(/_/g, " ") ?? d.timezone
                : "—";
              return (
                <div
                  key={event.id}
                  className="grid gap-3 px-5 py-3 text-xs hover:bg-white/2 transition-colors min-w-180"
                  style={{
                    gridTemplateColumns: "6rem 5rem 7rem 6rem 8rem 7rem 7rem 5rem",
                    fontFamily: "var(--font-jetbrains-mono)",
                  }}
                >
                  <span
                    title={new Date(event.ts).toLocaleString("en-IN")}
                    style={{ color: "var(--bone)" }}
                  >
                    {timeAgo(event.ts)}
                  </span>

                  <span title={maskIP(d.ip)} style={{ color: "var(--cyan)", opacity: 0.8 }}>
                    {d.country ? `${countryFlag(d.country)} ${d.country}` : "—"}
                  </span>

                  <span
                    className="truncate"
                    title={d.city}
                    style={{ color: "var(--bone-muted)" }}
                  >
                    {d.city || "—"}
                  </span>

                  <span title={d.deviceType} style={{ color: "var(--bone-muted)" }}>
                    {deviceIcon(d.deviceType)}{" "}
                    <span className="opacity-60">{d.deviceType.slice(0, 3)}</span>
                  </span>

                  <span style={{ color: "var(--bone)" }}>
                    {d.browser}
                    {d.browserVersion && (
                      <span style={{ color: "var(--bone-muted)", opacity: 0.6 }}>
                        {" "}{d.browserVersion}
                      </span>
                    )}
                  </span>

                  <span style={{ color: "var(--bone-muted)" }}>
                    {d.os}
                    {d.osVersion && (
                      <span style={{ opacity: 0.6 }}> {d.osVersion}</span>
                    )}
                  </span>

                  <span style={{ color: "var(--bone-muted)", opacity: 0.7 }}>
                    {screen}
                    {d.colorDepth && (
                      <span style={{ opacity: 0.5 }}> {d.colorDepth}bit</span>
                    )}
                  </span>

                  <span
                    className="truncate"
                    title={d.timezone}
                    style={{ color: "var(--bone-muted)", opacity: 0.6 }}
                  >
                    {tz}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Action bar ── */}
        <div className="flex items-center justify-between gap-4 flex-wrap pb-8">
          <button
            onClick={() => exportCSV(events)}
            disabled={events.length === 0}
            className="text-xs px-4 py-2 rounded transition-all disabled:opacity-30"
            style={{
              background: "rgba(34,211,238,0.06)",
              border: "1px solid rgba(34,211,238,0.2)",
              color: "var(--cyan)",
              fontFamily: "var(--font-jetbrains-mono)",
            }}
          >
            ↓ Export CSV ({events.length} records)
          </button>

          <button
            onClick={handleClear}
            disabled={events.length === 0 || clearing}
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
    </div>
  );
}
