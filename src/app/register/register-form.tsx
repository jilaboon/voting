"use client";

import { useState } from "react";

type Status = "idle" | "loading" | "success" | "duplicate" | "error";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), phone: phone.trim() }),
      });

      if (res.ok) {
        setStatus("success");
        return;
      }

      const data = await res.json();
      if (res.status === 409) {
        setStatus("duplicate");
        return;
      }

      setErrorMsg(data.error || "שגיאה לא צפויה");
      setStatus("error");
    } catch {
      setErrorMsg("שגיאת רשת, נסו שוב");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl bg-white/10 backdrop-blur-sm p-8 text-center">
        <p className="text-2xl font-semibold text-green-400">נרשמת בהצלחה 🎉</p>
        <p className="mt-2 text-white/60">נתראה באירוע!</p>
      </div>
    );
  }

  if (status === "duplicate") {
    return (
      <div className="rounded-2xl bg-white/10 backdrop-blur-sm p-8 text-center">
        <p className="text-xl font-semibold text-amber-400">מספר הטלפון כבר רשום</p>
        <p className="mt-2 text-white/60">אם נרשמת בעבר, אין צורך להירשם שוב</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-2xl bg-white/10 backdrop-blur-sm p-6">
      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium text-white/80">
          שם
        </label>
        <input
          id="name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-lg text-white placeholder-white/40 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
          placeholder="השם שלך"
        />
      </div>
      <div>
        <label htmlFor="phone" className="mb-1 block text-sm font-medium text-white/80">
          טלפון
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

      {status === "error" && (
        <p className="text-center text-sm text-red-400">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="mt-2 w-full rounded-xl bg-white/90 py-4 text-lg font-semibold text-primary transition-colors hover:bg-white disabled:opacity-50"
      >
        {status === "loading" ? "שולח..." : "הרשמה"}
      </button>
    </form>
  );
}
