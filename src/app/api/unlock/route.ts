import { NextRequest, NextResponse } from "next/server";
import { appendLog } from "@/lib/access-log";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  const { code } = (await req.json()) as { code?: string };

  const expected = process.env.ACCESS_CODE;
  if (!expected || !code || code !== expected) {
    return NextResponse.json({ error: "Invalid code" }, { status: 401 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  const ua = req.headers.get("user-agent") ?? "";

  // Fire-and-forget — don't block the response
  appendLog({ id: randomUUID(), ts: Date.now(), ip, ua });

  const res = NextResponse.json({ ok: true });
  res.cookies.set("sc_access", "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    secure: process.env.NODE_ENV === "production",
  });
  return res;
}
