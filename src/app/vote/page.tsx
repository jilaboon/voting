import { prisma } from "@/lib/db";
import VoteFlow from "./vote-flow";
import PartyBackground from "../party-bg";

export const dynamic = 'force-dynamic';

export default async function VotePage() {
  const state = await prisma.eventState.findFirst({ where: { id: 1 } });
  const isOpen = state?.votingOpen ?? false;

  if (!isOpen) {
    return (
      <PartyBackground>
        <main className="flex min-h-screen flex-col items-center justify-center px-4">
          <div className="w-full max-w-md text-center">
            <h1 className="mb-4 text-3xl font-bold text-white">
              ההצבעה עדיין לא נפתחה
            </h1>
            <p className="text-lg text-white/60">ההצבעה תיפתח בקרוב</p>
          </div>
        </main>
      </PartyBackground>
    );
  }

  const costumes = await prisma.costume.findMany({
    select: { id: true, title: true, imageUrl: true },
    orderBy: { createdAt: "asc" },
  });

  return (
    <PartyBackground>
      <main className="flex min-h-screen flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <h1 className="mb-8 text-center text-3xl font-bold text-white">
            הצביעו והשפיעו
          </h1>
          <VoteFlow costumes={costumes} />
        </div>
      </main>
    </PartyBackground>
  );
}
