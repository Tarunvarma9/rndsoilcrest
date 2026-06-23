export type LogEntry = {
  id: string;
  ts: number; // unix ms
  ip: string;
  ua: string;
};

// ── Client-safe utilities (no server imports) ─────────────────────────────────

export function parseUA(ua: string): { browser: string; os: string } {
  let browser = "Unknown";
  let os      = "Unknown";

  if (ua.includes("Edg/"))                                    browser = "Edge";
  else if (ua.includes("OPR/") || ua.includes("Opera/"))      browser = "Opera";
  else if (ua.includes("Chrome/"))                             browser = "Chrome";
  else if (ua.includes("Firefox/"))                            browser = "Firefox";
  else if (ua.includes("Safari/") && !ua.includes("Chrome/")) browser = "Safari";

  if (ua.includes("Windows NT"))                              os = "Windows";
  else if (ua.includes("Macintosh"))                           os = "macOS";
  else if (ua.includes("iPhone") || ua.includes("iPad"))      os = "iOS";
  else if (ua.includes("Android"))                             os = "Android";
  else if (ua.includes("Linux"))                               os = "Linux";

  return { browser, os };
}

export function maskIP(ip: string): string {
  const parts = ip.split(".");
  if (parts.length === 4) return `${parts[0]}.${parts[1]}.*.*`;
  return ip.split(":")[0] + ":…";
}

export function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const s = Math.floor(diff / 1000);
  if (s < 60)  return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60)  return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24)  return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}
