"use client";

import { useState } from "react";

type Costume = {
  id: string;
  title: string;
  imageUrl: string | null;
};

type Step = "phone" | "choose" | "confirm" | "done";
type VerifyError = "NOT_FOUND" | "ALREADY_VOTED" | null;

export default function VoteFlow({ costumes }: { costumes: Costume[] }) {
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifyError, setVerifyError] = useState<VerifyError>(null);
  const [selected, setSelected] = useState<Costume | null>(null);
  const [castError, setCastError] = useState("");

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setVerifyError(null);

    try {
      const res = await fetch("/api/vote/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.trim() }),
      });

      const data = await res.json();

      if (data.status === "OK") {
        setStep("choose");
      } else if (data.status === "NOT_FOUND") {
        setVerifyError("NOT_FOUND");
      } else if (data.status === "ALREADY_VOTED") {
        setVerifyError("ALREADY_VOTED");
      }
    } catch {
      setVerifyError("NOT_FOUND");
    } finally {
      setLoading(false);
    }
  }

  async function handleCastVote() {
    if (!selected) return;
    setLoading(true);
    setCastError("");

    try {
      const res = await fetch("/api/vote/cast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.trim(), costumeId: selected.id }),
      });

      if (res.ok) {
        setStep("done");
      } else {
        const data = await res.json();
        setCastError(data.error || "שגיאה לא צפויה");
      }
    } catch {
      setCastError("שגיאת רשת, נסו שוב");
    } finally {
      setLoading(false);
    }
  }

  // Step A: Phone verification
  if (step === "phone") {
    return (
      <div>
        <form onSubmit={handleVerify} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="phone"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              מספר טלפון
            </label>
            <input
              id="phone"
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/[\s\-]/g, ''))}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="0501234567"
              dir="ltr"
            />
          </div>

          {verifyError === "NOT_FOUND" && (
            <p className="text-center text-sm text-red-600">
              מספר לא רשום. גש/י לעמדת הכניסה
            </p>
          )}
          {verifyError === "ALREADY_VOTED" && (
            <p className="text-center text-sm text-amber-600">
              כבר הצבעת, תודה!
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-xl bg-primary py-4 text-lg font-semibold text-white transition-colors hover:bg-primary-hover disabled:opacity-50"
          >
            {loading ? "בודק..." : "המשך"}
          </button>
        </form>
      </div>
    );
  }

  // Step B: Choose costume
  if (step === "choose") {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-center text-lg text-gray-600">בחרו תחפושת</p>
        <div className="grid grid-cols-1 gap-3">
          {costumes.map((costume) => (
            <button
              key={costume.id}
              onClick={() => {
                setSelected(costume);
                setStep("confirm");
              }}
              className="flex items-center gap-4 rounded-xl border-2 border-gray-200 bg-white px-5 py-4 text-xl font-medium text-gray-900 transition-colors hover:border-primary hover:bg-primary/5 active:bg-primary/10 text-start"
            >
              {costume.imageUrl && (
                <img
                  src={costume.imageUrl}
                  alt={costume.title}
                  className="h-20 w-20 rounded-lg object-cover flex-shrink-0"
                />
              )}
              <span>{costume.title}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Step B2: Confirm selection
  if (step === "confirm") {
    return (
      <div className="flex flex-col items-center gap-6 text-center">
        <p className="text-xl text-gray-700">
          להצביע ל<span className="font-bold text-primary">{selected?.title}</span>?
        </p>

        {castError && (
          <p className="text-sm text-red-600">{castError}</p>
        )}

        <div className="flex w-full flex-col gap-3">
          <button
            onClick={handleCastVote}
            disabled={loading}
            className="w-full rounded-xl bg-primary py-4 text-lg font-semibold text-white transition-colors hover:bg-primary-hover disabled:opacity-50"
          >
            {loading ? "שולח..." : "אישור הצבעה"}
          </button>
          <button
            onClick={() => {
              setSelected(null);
              setCastError("");
              setStep("choose");
            }}
            className="w-full rounded-xl border-2 border-gray-300 py-4 text-lg font-medium text-gray-600 transition-colors hover:border-gray-400"
          >
            חזרה
          </button>
        </div>
      </div>
    );
  }

  // Step C: Done
  return (
    <div className="text-center">
      <p className="text-2xl font-semibold text-green-600">ההצבעה נקלטה, תודה!</p>
      <p className="mt-2 text-gray-500">תודה על ההשתתפות</p>
    </div>
  );
}
