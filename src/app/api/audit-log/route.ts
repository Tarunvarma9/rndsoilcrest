import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getLogs, clearLogs } from "@/lib/access-log";

export async function GET() {
  const jar = await cookies();
  if (jar.get("sc_audit")?.value !== "1") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const logs = await getLogs(200);
  return NextResponse.json({ logs });
}

export async function DELETE(req: NextRequest) {
  const jar = await cookies();
  if (jar.get("sc_audit")?.value !== "1") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await clearLogs();
  return NextResponse.json({ ok: true });
}
