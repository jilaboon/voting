'use client';

import { useState } from 'react';

export default function SettingsPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  async function handleAction(action: 'resetVotes' | 'resetAll') {
    const confirmText =
      action === 'resetVotes'
        ? 'האם את/ה בטוח/ה? פעולה זו תמחק את כל ההצבעות.'
        : 'האם את/ה בטוח/ה? פעולה זו תמחק את כל הנתונים - משתמשים, תחפושות והצבעות.';

    if (!window.confirm(confirmText)) return;

    setLoading(action);
    setMessage('');

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });

      if (res.ok) {
        setMessage(action === 'resetVotes' ? 'ההצבעות אופסו בהצלחה' : 'כל הנתונים אופסו בהצלחה');
      } else {
        setMessage('שגיאה בביצוע הפעולה');
      }
    } catch {
      setMessage('שגיאת חיבור');
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">הגדרות</h1>

      <div className="rounded-xl bg-white p-6 shadow-sm border border-red-200">
        <h2 className="text-lg font-semibold text-red-700 mb-4">אזור מסוכן</h2>

        <div className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium text-gray-800">אפס הצבעות</p>
              <p className="text-sm text-gray-500">מוחק את כל ההצבעות ומאפס את סטטוס ההצבעה של המשתמשים</p>
            </div>
            <button
              onClick={() => handleAction('resetVotes')}
              disabled={loading !== null}
              className="rounded-lg bg-red-100 px-4 py-2 text-sm text-red-700 font-medium hover:bg-red-200 disabled:opacity-50 transition-colors whitespace-nowrap"
            >
              {loading === 'resetVotes' ? 'מאפס...' : 'אפס הצבעות'}
            </button>
          </div>

          <hr className="border-gray-200" />

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium text-gray-800">אפס הכל</p>
              <p className="text-sm text-gray-500">מוחק את כל הנתונים: משתמשים, תחפושות והצבעות</p>
            </div>
            <button
              onClick={() => handleAction('resetAll')}
              disabled={loading !== null}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white font-medium hover:bg-red-700 disabled:opacity-50 transition-colors whitespace-nowrap"
            >
              {loading === 'resetAll' ? 'מאפס...' : 'אפס הכל'}
            </button>
          </div>
        </div>

        {message && (
          <p className="mt-4 text-sm text-center text-gray-600 bg-gray-50 rounded-lg py-2">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
