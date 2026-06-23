import { cookies } from "next/headers";
import { AuditGate } from "@/components/marketing/audit-gate";
import { AuditDashboard } from "@/components/marketing/audit-dashboard";

export const metadata = {
  title: "Audit Console · Soil Crest Naturals",
  description: "Internal access audit log.",
  robots: "noindex,nofollow",
};

export default async function AuditPage() {
  const jar = await cookies();
  const hasAccess = jar.get("sc_audit")?.value === "1";

  return hasAccess ? <AuditDashboard /> : <AuditGate />;
}
