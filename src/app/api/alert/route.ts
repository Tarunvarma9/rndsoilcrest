import { NextRequest, NextResponse } from "next/server";
import { tracker } from "@/lib/auth-tracker";
import { timeAgo } from "@/lib/auth-tracker-types";
import { sendWhatsApp } from "@/lib/whatsapp";

// Called by Vercel Cron every 3 hours.
// Vercel automatically sends `Authorization: Bearer ${CRON_SECRET}` on cron triggers.
export async function GET(req: NextRequest) {
  const expected = process.env.CRON_SECRET;
  const received = req.headers.get("authorization");

  if (!expected || received !== `Bearer ${expected}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const events     = await tracker.getLogs(100);
  const windowMs   = 3 * 60 * 60 * 1000; // 3 hours
  const since      = Date.now() - windowMs;
  const recent     = events.filter((e) => e.ts >= since);

  if (recent.length === 0) {
    return NextResponse.json({ ok: true, sent: false, reason: "no logins in last 3h" });
  }

  const lines = recent.map((e, i) => {
    const d   = e.device;
    const loc = [d.city, d.country].filter(Boolean).join(", ") || "Unknown";
    const bv  = d.browserVersion ? ` ${d.browserVersion}` : "";
    return `${i + 1}. ${d.browser}${bv} · ${d.os}\n   📍 ${loc}  🕐 ${timeAgo(e.ts)}`;
  });

  const msg = [
    `🛡 *SCN Access Report*`,
    `📊 Last 3h: ${recent.length} login${recent.length > 1 ? "s" : ""}`,
    ``,
    lines.join("\n\n"),
    ``,
    `_Soil Crest Intelligence Platform_`,
  ].join("\n");

  const sent = await sendWhatsApp(msg);
  return NextResponse.json({ ok: true, sent, count: recent.length });
}
