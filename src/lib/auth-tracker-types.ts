// Shared between server and client — no server-only imports here

export type ClientHints = {
  screenW?: number;
  screenH?: number;
  timezone?: string;
  colorDepth?: number;
  touchSupport?: boolean;
  platform?: string;
};

export type DeviceInfo = {
  // Network — server-trusted (from Vercel edge headers)
  ip: string;
  country: string;       // ISO-3166 alpha-2, e.g. "IN"
  city: string;
  region: string;

  // User-Agent parsed — server-trusted
  ua: string;
  browser: string;
  browserVersion: string;
  os: string;
  osVersion: string;
  deviceType: "mobile" | "tablet" | "desktop";

  // Request context — server-trusted
  locale: string;        // from Accept-Language
  referer: string;       // from Referer header

  // Client-supplied hints — self-reported, lower-trust
  screenW?: number;
  screenH?: number;
  timezone?: string;
  colorDepth?: number;
  touchSupport?: boolean;
  platform?: string;
};

export type AccessEvent = {
  id: string;
  ts: number;            // unix ms
  device: DeviceInfo;
};

export type AccessStats = {
  total: number;
  last24h: number;
  uniqueIPs: number;
  uniqueCountries: number;
  deviceBreakdown: Record<string, number>;
  browserBreakdown: Record<string, number>;
  osBreakdown: Record<string, number>;
};

// ── Client-safe utilities ──────────────────────────────────────────────────────

export function countryFlag(code: string): string {
  if (!code || code.length !== 2) return "🌐";
  const offset = 127397;
  return String.fromCodePoint(
    code.toUpperCase().charCodeAt(0) + offset,
    code.toUpperCase().charCodeAt(1) + offset
  );
}

export function deviceIcon(type: DeviceInfo["deviceType"]): string {
  if (type === "mobile")  return "📱";
  if (type === "tablet")  return "⬛";
  return "🖥";
}

export function timeAgo(ts: number): string {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60)  return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60)  return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24)  return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export function maskIP(ip: string): string {
  const parts = ip.split(".");
  if (parts.length === 4) return `${parts[0]}.${parts[1]}.*.*`;
  return ip.split(":")[0] + ":…";
}

export function collectClientHints(): ClientHints {
  return {
    screenW:      window.screen.width,
    screenH:      window.screen.height,
    timezone:     Intl.DateTimeFormat().resolvedOptions().timeZone,
    colorDepth:   window.screen.colorDepth,
    touchSupport: navigator.maxTouchPoints > 0,
    platform:     navigator.platform,
  };
}
