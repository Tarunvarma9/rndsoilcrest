import "server-only";
import { Redis } from "@upstash/redis";
import { randomUUID } from "crypto";
import type { ClientHints, DeviceInfo, AccessEvent, AccessStats } from "./auth-tracker-types";

// ── UA parsing ────────────────────────────────────────────────────────────────

function parseBrowser(ua: string): { name: string; version: string } {
  const rules: [RegExp, string][] = [
    [/SamsungBrowser\/(\S+)/,      "Samsung Browser"],
    [/Edg\/(\S+)/,                 "Edge"],
    [/OPR\/(\S+)/,                 "Opera"],
    [/YaBrowser\/(\S+)/,           "Yandex"],
    [/UCBrowser\/(\S+)/,           "UC Browser"],
    [/Chrome\/(\S+)/,              "Chrome"],
    [/Firefox\/(\S+)/,             "Firefox"],
    [/Version\/(\S+).*Safari/,     "Safari"],
    [/MSIE (\S+)/,                 "IE"],
    [/Trident\/.*rv:(\S+)/,        "IE"],
  ];
  for (const [re, name] of rules) {
    const m = ua.match(re);
    if (m) return { name, version: m[1].split(".")[0] }; // major version only
  }
  return { name: "Unknown", version: "" };
}

function parseOS(ua: string): { name: string; version: string } {
  const windowsMap: Record<string, string> = {
    "10.0": "10/11", "6.3": "8.1", "6.2": "8", "6.1": "7",
    "6.0": "Vista", "5.2": "XP x64", "5.1": "XP",
  };

  let m: RegExpMatchArray | null;

  if ((m = ua.match(/iPhone OS ([\d_]+)/)))
    return { name: "iOS",     version: m[1].replace(/_/g, ".").split(".").slice(0, 2).join(".") };
  if ((m = ua.match(/iPad.*CPU OS ([\d_]+)/)))
    return { name: "iPadOS",  version: m[1].replace(/_/g, ".").split(".").slice(0, 2).join(".") };
  if ((m = ua.match(/Android ([\d.]+)/)))
    return { name: "Android", version: m[1].split(".").slice(0, 2).join(".") };
  if ((m = ua.match(/Windows NT ([\d.]+)/)))
    return { name: "Windows", version: windowsMap[m[1]] ?? m[1] };
  if ((m = ua.match(/Mac OS X ([\d_]+)/)))
    return { name: "macOS",   version: m[1].replace(/_/g, ".").split(".").slice(0, 2).join(".") };
  if (/CrOS/.test(ua))
    return { name: "ChromeOS", version: "" };
  if (/Linux/.test(ua))
    return { name: "Linux",   version: "" };

  return { name: "Unknown", version: "" };
}

function parseDeviceType(ua: string): DeviceInfo["deviceType"] {
  if (/iPad|Tablet|PlayBook|Nexus 9|Nexus 10/.test(ua))            return "tablet";
  if (/Mobi|iPhone|Android.*Mobile|BlackBerry|IEMobile|Opera Mini/.test(ua)) return "mobile";
  return "desktop";
}

// ── AuthTracker plugin ────────────────────────────────────────────────────────

export type AuthTrackerConfig = {
  redisUrl:   string;
  redisToken: string;
  logKey?:    string;   // default: "auth:access_log"
  maxLogs?:   number;   // default: 500
};

export class AuthTracker {
  private redis: Redis | null = null;
  private readonly logKey:  string;
  private readonly maxLogs: number;

  constructor(private readonly config: AuthTrackerConfig) {
    this.logKey  = config.logKey  ?? "auth:access_log";
    this.maxLogs = config.maxLogs ?? 500;

    if (config.redisUrl && config.redisToken) {
      this.redis = new Redis({
        url:   config.redisUrl,
        token: config.redisToken,
      });
    }
  }

  // Parse everything from the request — returns a DeviceInfo struct
  parseRequest(req: Request, hints?: ClientHints): DeviceInfo {
    const headers = req.headers;

    const ua  = headers.get("user-agent") ?? "";
    const ip = (
      headers.get("cf-connecting-ip") ??
      headers.get("x-real-ip") ??
      (headers.get("x-forwarded-for") ?? "").split(",")[0].trim()
    ) || "unknown";

    // Vercel edge geo headers (free — automatically set by Vercel's CDN)
    const country = headers.get("x-vercel-ip-country")      ?? "";
    const city    = headers.get("x-vercel-ip-city")         ?? "";
    const region  = headers.get("x-vercel-ip-region")       ?? "";

    const { name: browser, version: browserVersion } = parseBrowser(ua);
    const { name: os,      version: osVersion       } = parseOS(ua);
    const deviceType = parseDeviceType(ua);

    const locale = (headers.get("accept-language") ?? "").split(",")[0].trim();
    const referer = headers.get("referer") ?? "";

    return {
      ip, country, city, region,
      ua, browser, browserVersion, os, osVersion, deviceType,
      locale, referer,
      ...(hints ?? {}),
    };
  }

  // Log a single access event
  async logAccess(req: Request, hints?: ClientHints): Promise<void> {
    const device = this.parseRequest(req, hints);
    const event: AccessEvent = { id: randomUUID(), ts: Date.now(), device };

    try {
      if (!this.redis) return;
      await this.redis.lpush(this.logKey, JSON.stringify(event));
      await this.redis.ltrim(this.logKey, 0, this.maxLogs - 1);
    } catch {
      // Redis unreachable — silent no-op; do not block the auth response
    }
  }

  async getLogs(limit = 200): Promise<AccessEvent[]> {
    try {
      if (!this.redis) return [];
      const raw = await this.redis.lrange<string>(this.logKey, 0, limit - 1);
      return raw.map((item) =>
        typeof item === "string"
          ? (JSON.parse(item) as AccessEvent)
          : (item as unknown as AccessEvent)
      );
    } catch {
      return [];
    }
  }

  async clearLogs(): Promise<void> {
    try {
      if (!this.redis) return;
      await this.redis.del(this.logKey);
    } catch {
      // no-op
    }
  }

  computeStats(events: AccessEvent[]): AccessStats {
    const now     = Date.now();
    const last24h = events.filter((e) => now - e.ts < 86_400_000).length;

    const counter = <T extends string>(
      arr: T[]
    ): Record<string, number> =>
      arr.reduce<Record<string, number>>((acc, v) => {
        acc[v] = (acc[v] ?? 0) + 1;
        return acc;
      }, {});

    return {
      total:            events.length,
      last24h,
      uniqueIPs:        new Set(events.map((e) => e.device.ip)).size,
      uniqueCountries:  new Set(events.map((e) => e.device.country).filter(Boolean)).size,
      deviceBreakdown:  counter(events.map((e) => e.device.deviceType)),
      browserBreakdown: counter(events.map((e) => e.device.browser)),
      osBreakdown:      counter(events.map((e) => e.device.os)),
    };
  }
}

// ── Singleton for this project ────────────────────────────────────────────────
// Import `tracker` into any server route — it's already configured.

export const tracker = new AuthTracker({
  redisUrl:   process.env.UPSTASH_REDIS_REST_URL   ?? "",
  redisToken: process.env.UPSTASH_REDIS_REST_TOKEN ?? "",
  logKey:     "sc:access_log",
  maxLogs:    500,
});
