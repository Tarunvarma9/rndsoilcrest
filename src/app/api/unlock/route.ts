import { NextRequest, NextResponse } from "next/server";
import { tracker } from "@/lib/auth-tracker";
import type { ClientHints } from "@/lib/auth-tracker-types";

type AccessType = "main" | "love" | "overview" | "brief";

export async function POST(req: NextRequest) {
  const body = (await req.json()) as { code?: string; hints?: ClientHints };
  const code = body.code ?? "";

  const mainCode     = process.env.ACCESS_CODE   ?? "";
  const loveCode     = process.env.LOVE_CODE     ?? "";
  const overviewCode = process.env.OVERVIEW_CODE ?? "";
  const briefCode    = process.env.BRIEF_CODE    ?? "";

  let accessType: AccessType | null = null;
  if (mainCode     && code === mainCode)     accessType = "main";
  if (loveCode     && code === loveCode)     accessType = "love";
  if (overviewCode && code === overviewCode) accessType = "overview";
  if (briefCode    && code === briefCode)    accessType = "brief";

  if (!accessType) {
    return NextResponse.json({ error: "Invalid code" }, { status: 401 });
  }

  // Fire-and-forget log — does not block response
  tracker.logAccess(req, body.hints ?? {});

  const res = NextResponse.json({ ok: true, access: accessType });
  res.cookies.set("sc_access", accessType, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    secure: process.env.NODE_ENV === "production",
  });
  return res;
}
