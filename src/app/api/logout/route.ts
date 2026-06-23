import { NextRequest, NextResponse } from "next/server";

// scope=access (default) → clears sc_access
// scope=audit            → clears sc_audit
export async function POST(req: NextRequest) {
  const scope = new URL(req.url).searchParams.get("scope") ?? "access";

  const res = NextResponse.json({ ok: true });

  if (scope === "audit") {
    res.cookies.set("sc_audit", "", {
      httpOnly: true,
      sameSite: "lax",
      path: "/audit",
      maxAge: 0,
      secure: process.env.NODE_ENV === "production",
    });
  } else {
    res.cookies.set("sc_access", "", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 0,
      secure: process.env.NODE_ENV === "production",
    });
  }

  return res;
}
