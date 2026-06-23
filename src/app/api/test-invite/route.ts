import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { sendLoveInviteTest } from "@/lib/whatsapp";

// Protected — only accessible when logged in as main (482917)
export async function POST(req: NextRequest) {
  void req;
  const jar    = await cookies();
  const access = jar.get("sc_access")?.value;

  if (access !== "main" && access !== "1") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sent = await sendLoveInviteTest();
  return NextResponse.json({ ok: sent, to: process.env.ALERT_PHONE });
}
