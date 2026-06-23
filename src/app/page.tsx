import { AccessGate } from "@/components/marketing/access-gate";
import { Dossier } from "@/components/marketing/dossier";
import { LovePage } from "@/components/marketing/love-page";
import { cookies } from "next/headers";

export default async function Home() {
  const store  = await cookies();
  const access = store.get("sc_access")?.value;

  // "1" is the legacy cookie value from before the multi-code system
  const isMain  = access === "main" || access === "1";
  const isLove  = access === "love";

  return (
    <main className="flex-1 blueprint-bg relative z-10">
      {isLove  ? <LovePage />  :
       isMain  ? <Dossier />   :
                 <AccessGate />}
    </main>
  );
}
