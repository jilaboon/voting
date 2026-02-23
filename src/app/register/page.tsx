import { prisma } from "@/lib/db";
import RegisterForm from "./register-form";
import PartyBackground from "../party-bg";

export const dynamic = 'force-dynamic';

export default async function RegisterPage() {
  const state = await prisma.eventState.findFirst({ where: { id: 1 } });
  const isOpen = state?.registrationOpen ?? false;

  if (!isOpen) {
    return (
      <PartyBackground>
        <main className="flex min-h-screen flex-col items-center justify-center px-4">
          <div className="w-full max-w-md text-center">
            <h1 className="mb-4 text-3xl font-bold text-white">ההרשמה סגורה</h1>
            <p className="text-lg text-white/60">ההרשמה לאירוע הסתיימה</p>
          </div>
        </main>
      </PartyBackground>
    );
  }

  return (
    <PartyBackground>
      <main className="flex min-h-screen flex-col items-center justify-center px-4">
        <div className="w-full max-w-md">
          <h1 className="mb-8 text-center text-3xl font-bold text-white">
            הרשמה
          </h1>
          <RegisterForm />
        </div>
      </main>
    </PartyBackground>
  );
}
