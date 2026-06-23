import { AccessGate } from "@/components/marketing/access-gate";
import { IntelligencePlatform } from "@/components/marketing/intelligence-platform";
import { LovePage } from "@/components/marketing/love-page";
import { OverviewPage } from "@/components/marketing/overview-page";
import { BriefPage } from "@/components/marketing/brief-page";
import { cookies } from "next/headers";

export default async function Home() {
  const store  = await cookies();
  const access = store.get("sc_access")?.value;

  // "1" is the legacy cookie value from before the multi-code system
  const isMain     = access === "main" || access === "1";
  const isLove     = access === "love";
  const isOverview = access === "overview";
  const isBrief    = access === "brief";

  return (
    <main className="flex-1 blueprint-bg relative z-10">
      {isLove     ? <LovePage />            :
       isOverview ? <OverviewPage />         :
       isBrief    ? <BriefPage />            :
       isMain     ? <IntelligencePlatform /> :
                    <AccessGate />}
    </main>
  );
}
