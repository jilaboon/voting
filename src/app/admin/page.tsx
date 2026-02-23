'use client';

import { useEffect, useState } from 'react';

interface State {
  registrationOpen: boolean;
  votingOpen: boolean;
  userCount: number;
  voteCount: number;
}

export default function AdminDashboardPage() {
  const [state, setState] = useState<State | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);

  useEffect(() => {
    fetchState();
  }, []);

  async function fetchState() {
    const res = await fetch('/api/admin/state');
    if (res.ok) {
      setState(await res.json());
    }
  }

  async function toggleField(field: 'registrationOpen' | 'votingOpen') {
    if (!state) return;
    setToggling(field);

    const res = await fetch('/api/admin/state', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: !state[field] }),
    });

    if (res.ok) {
      setState(await res.json());
    }
    setToggling(null);
  }

  if (!state) {
    return (
      <div className="flex justify-center py-12">
        <p className="text-gray-500">טוען...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">לוח בקרה</h1>

      {/* State Toggles */}
      <div className="grid gap-4 sm:grid-cols-2">
        <ToggleCard
          label="הרשמה"
          active={state.registrationOpen}
          loading={toggling === 'registrationOpen'}
          onToggle={() => toggleField('registrationOpen')}
        />
        <ToggleCard
          label="הצבעה"
          active={state.votingOpen}
          loading={toggling === 'votingOpen'}
          onToggle={() => toggleField('votingOpen')}
        />
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">נרשמו</p>
          <p className="mt-1 text-3xl font-bold text-gray-800">{state.userCount}</p>
        </div>
        <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">הצביעו</p>
          <p className="mt-1 text-3xl font-bold text-gray-800">{state.voteCount}</p>
        </div>
      </div>
    </div>
  );
}

function ToggleCard({
  label,
  active,
  loading,
  onToggle,
}: {
  label: string;
  active: boolean;
  loading: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-white p-5 shadow-sm border border-gray-200">
      <div>
        <p className="text-lg font-semibold text-gray-800">{label}</p>
        <p className={`text-sm ${active ? 'text-green-600' : 'text-gray-400'}`}>
          {active ? 'פעיל' : 'לא פעיל'}
        </p>
      </div>
      <button
        onClick={onToggle}
        disabled={loading}
        className={`relative h-8 w-14 rounded-full transition-colors ${
          active ? 'bg-green-500' : 'bg-gray-300'
        } ${loading ? 'opacity-50' : ''}`}
        dir="ltr"
      >
        <span
          className={`absolute top-1 left-1 h-6 w-6 rounded-full bg-white shadow transition-transform ${
            active ? 'translate-x-6' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}
