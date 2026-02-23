import Link from "next/link";
import PartyBackground from "./party-bg";

export default function Home() {
  return (
    <PartyBackground>
      <main className="flex min-h-screen flex-col items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <h1 className="mb-2 text-4xl font-bold text-white">
            הצביעו והשפיעו
          </h1>
          <p className="mb-12 text-lg text-white/60">בחרו את התחפושת המנצחת</p>

          <div className="flex flex-col gap-4">
            <Link
              href="/register"
              className="block w-full rounded-xl bg-white/90 py-4 text-center text-lg font-semibold text-primary transition-colors hover:bg-white"
            >
              הרשמה
            </Link>
            <Link
              href="/vote"
              className="block w-full rounded-xl border-2 border-white/40 py-4 text-center text-lg font-semibold text-white transition-colors hover:bg-white/10"
            >
              הצבעה
            </Link>
          </div>
        </div>
      </main>
    </PartyBackground>
  );
}
