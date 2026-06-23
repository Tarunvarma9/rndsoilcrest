import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { RdPlan } from "@/components/marketing/rd-plan";

export const metadata = {
  title: "R&D Master Plan · Soil Crest Naturals",
  description: "Confidential product R&D plan.",
  robots: "noindex,nofollow",
};

export default async function RdPage() {
  const jar    = await cookies();
  const access = jar.get("sc_access")?.value;

  // Main and overview access can view the R&D plan
  if (access !== "main" && access !== "1" && access !== "overview") redirect("/");

  return <RdPlan />;
}
