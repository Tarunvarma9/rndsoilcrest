import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { tracker } from "@/lib/auth-tracker";

export async function GET() {
  const jar = await cookies();
  if (jar.get("sc_audit")?.value !== "1") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const events = await tracker.getLogs(200);
  const stats  = tracker.computeStats(events);
  return NextResponse.json({ events, stats });
}

export async function DELETE() {
  const jar = await cookies();
  if (jar.get("sc_audit")?.value !== "1") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await tracker.clearLogs();
  return NextResponse.json({ ok: true });
}
