import { NextRequest, NextResponse } from "next/server";
import { tracker } from "@/lib/auth-tracker";
import type { ClientHints } from "@/lib/auth-tracker-types";

export async function POST(req: NextRequest) {
  const body = (await req.json()) as { code?: string; hints?: ClientHints };

  const expected = process.env.ACCESS_CODE;
  if (!expected || !body.code || body.code !== expected) {
    return NextResponse.json({ error: "Invalid code" }, { status: 401 });
  }

  // Fire-and-forget — does not block the auth response
  tracker.logAccess(req, body.hints ?? {});

  const res = NextResponse.json({ ok: true });
  res.cookies.set("sc_access", "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    secure: process.env.NODE_ENV === "production",
  });
  return res;
}
