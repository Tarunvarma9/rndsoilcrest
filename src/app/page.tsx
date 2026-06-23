import { AccessGate } from "@/components/marketing/access-gate";
import { Dossier } from "@/components/marketing/dossier";
import { cookies } from "next/headers";

export default async function Home() {
  const cookieStore = await cookies();
  const isUnlocked = cookieStore.get("sc_access")?.value === "1";

  return (
    <main className="flex-1 blueprint-bg">
      {isUnlocked ? <Dossier /> : <AccessGate />}
    </main>
  );
}
