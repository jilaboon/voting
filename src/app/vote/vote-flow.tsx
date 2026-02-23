"use client";

import { useState, useEffect, useCallback } from "react";

type Costume = {
  id: string;
  title: string;
  imageUrl: string | null;
};

type Step = "phone" | "choose" | "confirm" | "done";
type VerifyError = "NOT_FOUND" | "ALREADY_VOTED" | null;

function preloadImages(costumes: Costume[]): Promise<void> {
  const urls = costumes.map((c) => c.imageUrl).filter(Boolean) as string[];
  if (urls.length === 0) return Promise.resolve();
  return Promise.all(
    urls.map(
      (url) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => resolve();
          img.src = url;
        })
    )
  ).then(() => {});
}

export default function VoteFlow({ costumes }: { costumes: Costume[] }) {
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [imagesReady, setImagesReady] = useState(false);
  const [verifyError, setVerifyError] = useState<VerifyError>(null);
  const [selected, setSelected] = useState<Costume | null>(null);
  const [castError, setCastError] = useState("");

  const startPreload = useCallback(() => {
    preloadImages(costumes).then(() => setImagesReady(true));
  }, [costumes]);

  useEffect(() => {
    startPreload();
  }, [startPreload]);

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
      <form onSubmit={handleVerify} className="flex flex-col gap-4 rounded-2xl bg-white/10 backdrop-blur-sm p-6">
        <div>
          <label
            htmlFor="phone"
            className="mb-1 block text-sm font-medium text-white/80"
          >
            מספר טלפון
          </label>
          <input
            id="phone"
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/[\s\-]/g, ''))}
            className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-lg text-white placeholder-white/40 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
            placeholder="0501234567"
            dir="ltr"
          />
        </div>

        {verifyError === "NOT_FOUND" && (
          <p className="text-center text-sm text-red-400">
            מספר לא רשום. גש/י לעמדת הכניסה
          </p>
        )}
        {verifyError === "ALREADY_VOTED" && (
          <p className="text-center text-sm text-amber-400">
            כבר הצבעת, תודה!
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full rounded-xl bg-white/90 py-4 text-lg font-semibold text-primary transition-colors hover:bg-white disabled:opacity-50"
        >
          {loading ? "בודק..." : "המשך"}
        </button>
      </form>
    );
  }

  // Step B: Choose costume
  if (step === "choose") {
    if (!imagesReady) {
      return (
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-white" />
          <p className="text-lg text-white/60">טוען תחפושות...</p>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-4">
        <p className="text-center text-lg text-white/70">בחרו תחפושת</p>
        <div className="grid grid-cols-1 gap-3">
          {costumes.map((costume) => (
            <button
              key={costume.id}
              onClick={() => {
                setSelected(costume);
                setStep("confirm");
              }}
              className="flex items-center gap-4 rounded-xl border-2 border-white/20 bg-white/10 backdrop-blur-sm px-5 py-4 text-xl font-medium text-white transition-all hover:border-white/40 hover:bg-white/20 active:bg-white/25 text-start"
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
      <div className="flex flex-col items-center gap-6 text-center rounded-2xl bg-white/10 backdrop-blur-sm p-6">
        {selected?.imageUrl && (
          <img
            src={selected.imageUrl}
            alt={selected.title}
            className="h-32 w-32 rounded-xl object-cover"
          />
        )}
        <p className="text-xl text-white">
          להצביע ל<span className="font-bold text-amber-300">{selected?.title}</span>?
        </p>

        {castError && (
          <p className="text-sm text-red-400">{castError}</p>
        )}

        <div className="flex w-full flex-col gap-3">
          <button
            onClick={handleCastVote}
            disabled={loading}
            className="w-full rounded-xl bg-white/90 py-4 text-lg font-semibold text-primary transition-colors hover:bg-white disabled:opacity-50"
          >
            {loading ? "שולח..." : "אישור הצבעה"}
          </button>
          <button
            onClick={() => {
              setSelected(null);
              setCastError("");
              setStep("choose");
            }}
            className="w-full rounded-xl border-2 border-white/30 py-4 text-lg font-medium text-white/80 transition-colors hover:border-white/50 hover:bg-white/5"
          >
            חזרה
          </button>
        </div>
      </div>
    );
  }

  // Step C: Done
  return (
    <div className="text-center rounded-2xl bg-white/10 backdrop-blur-sm p-8">
      <p className="text-2xl font-semibold text-green-400">ההצבעה נקלטה, תודה!</p>
      <p className="mt-2 text-white/60">תודה על ההשתתפות</p>
    </div>
  );
}
