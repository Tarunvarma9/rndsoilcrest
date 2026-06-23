export type LogEntry = {
  id: string;
  ts: number;
  ip: string;
  ua: string;
};

const KV_KEY = "sc:access_log";
const MAX_LOGS = 500;

async function getKv() {
  const { kv } = await import("@vercel/kv");
  return kv;
}

export async function appendLog(entry: LogEntry): Promise<void> {
  try {
    const store = await getKv();
    await store.lpush(KV_KEY, JSON.stringify(entry));
    await store.ltrim(KV_KEY, 0, MAX_LOGS - 1);
  } catch {
    // KV not configured — no-op in local dev
  }
}

export async function getLogs(limit = 200): Promise<LogEntry[]> {
  try {
    const store = await getKv();
    const raw = await store.lrange<string>(KV_KEY, 0, limit - 1);
    return raw.map((item) =>
      typeof item === "string" ? (JSON.parse(item) as LogEntry) : (item as unknown as LogEntry)
    );
  } catch {
    return [];
  }
}

export async function clearLogs(): Promise<void> {
  try {
    const store = await getKv();
    await store.del(KV_KEY);
  } catch {
    // no-op
  }
}

export function parseUA(ua: string): { browser: string; os: string } {
  let browser = "Unknown";
  let os = "Unknown";

  if (ua.includes("Edg/")) browser = "Edge";
  else if (ua.includes("OPR/") || ua.includes("Opera/")) browser = "Opera";
  else if (ua.includes("Chrome/")) browser = "Chrome";
  else if (ua.includes("Firefox/")) browser = "Firefox";
  else if (ua.includes("Safari/") && !ua.includes("Chrome/")) browser = "Safari";

  if (ua.includes("Windows NT")) os = "Windows";
  else if (ua.includes("Macintosh")) os = "macOS";
  else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";
  else if (ua.includes("Android")) os = "Android";
  else if (ua.includes("Linux")) os = "Linux";

  return { browser, os };
}

export function maskIP(ip: string): string {
  const parts = ip.split(".");
  if (parts.length === 4) return `${parts[0]}.${parts[1]}.*.*`;
  // IPv6 — show first segment only
  return ip.split(":")[0] + ":…";
}

export function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}
