import { NextRequest, NextResponse } from "next/server";
import { tracker } from "@/lib/auth-tracker";
import { sendWhatsApp } from "@/lib/whatsapp";
import type { ClientHints } from "@/lib/auth-tracker-types";

// Simple per-IP rate limit — max 3 requests per IP per hour
const requestLog = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now    = Date.now();
  const window = 60 * 60 * 1000; // 1 hour
  const hits   = (requestLog.get(ip) ?? []).filter((t) => now - t < window);
  if (hits.length >= 3) return true;
  requestLog.set(ip, [...hits, now]);
  return false;
}

export async function POST(req: NextRequest) {
  const ip = (
    req.headers.get("cf-connecting-ip") ??
    req.headers.get("x-real-ip") ??
    (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim()
  ) || "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests. Try later." }, { status: 429 });
  }

  const body  = (await req.json()) as { hints?: ClientHints };
  const device = tracker.parseRequest(req, body.hints ?? {});

  const loc    = [device.city, device.country].filter(Boolean).join(", ") || "Unknown";
  const bv     = device.browserVersion ? ` ${device.browserVersion}` : "";
  const screen = device.screenW ? `${device.screenW}×${device.screenH}` : "Unknown";
  const tz     = device.timezone ?? device.locale ?? "—";

  const msg = [
    `🔔 *Access Request — R&D Dossier*`,
    ``,
    `🌐 ${device.browser}${bv} / ${device.os} ${device.osVersion}`,
    `📍 ${loc}`,
    `📺 ${screen}  ·  ${tz}`,
    `📱 ${device.deviceType}`,
    ``,
    `_Share the access code to grant entry._`,
  ].join("\n");

  const sent = await sendWhatsApp(msg);
  return NextResponse.json({ ok: true, sent });
}
