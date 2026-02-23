import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <h1 className="mb-2 text-4xl font-bold text-gray-900">
          הצבעת תחפושות
        </h1>
        <p className="mb-12 text-lg text-gray-500">בחרו את התחפושת המנצחת</p>

        <div className="flex flex-col gap-4">
          <Link
            href="/register"
            className="block w-full rounded-xl bg-primary py-4 text-center text-lg font-semibold text-white transition-colors hover:bg-primary-hover"
          >
            הרשמה
          </Link>
          <Link
            href="/vote"
            className="block w-full rounded-xl border-2 border-primary py-4 text-center text-lg font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
          >
            הצבעה
          </Link>
        </div>
      </div>
    </main>
  );
}
