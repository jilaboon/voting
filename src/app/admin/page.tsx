'use client';

import { useEffect, useState, useCallback } from 'react';

interface State {
  registrationOpen: boolean;
  votingOpen: boolean;
  userCount: number;
  voteCount: number;
}

interface User {
  id: string;
  name: string;
  phone: string;
  hasVoted: boolean;
  createdAt: string;
}

export default function AdminDashboardPage() {
  const [state, setState] = useState<State | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);

  const fetchState = useCallback(async () => {
    const res = await fetch('/api/admin/state');
    if (res.ok) {
      setState(await res.json());
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    setUsersLoading(true);
    const res = await fetch('/api/admin/users');
    if (res.ok) {
      setUsers(await res.json());
    }
    setUsersLoading(false);
  }, []);

  useEffect(() => {
    fetchState();
    fetchUsers();
  }, [fetchState, fetchUsers]);

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

      {/* Registered Users Table */}
      <div className="rounded-xl bg-white shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">רשומים</h2>
          <button
            onClick={() => { fetchUsers(); fetchState(); }}
            disabled={usersLoading}
            className="rounded-lg bg-gray-100 px-4 py-2 text-sm text-gray-700 font-medium hover:bg-gray-200 disabled:opacity-50 transition-colors"
          >
            {usersLoading ? 'טוען...' : 'רענן'}
          </button>
        </div>

        {users.length === 0 ? (
          <p className="px-5 py-8 text-center text-gray-400">
            {usersLoading ? 'טוען...' : 'אין נרשמים עדיין'}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-5 py-3 text-start text-sm font-semibold text-gray-600">#</th>
                  <th className="px-5 py-3 text-start text-sm font-semibold text-gray-600">שם</th>
                  <th className="px-5 py-3 text-start text-sm font-semibold text-gray-600">טלפון</th>
                  <th className="px-5 py-3 text-start text-sm font-semibold text-gray-600">הצביע/ה</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user.id} className="border-b border-gray-100 last:border-b-0">
                    <td className="px-5 py-3 text-sm text-gray-500">{index + 1}</td>
                    <td className="px-5 py-3 text-sm font-medium text-gray-800">{user.name}</td>
                    <td className="px-5 py-3 text-sm text-gray-600" dir="ltr">{user.phone}</td>
                    <td className="px-5 py-3 text-sm">
                      <span className={user.hasVoted ? 'text-green-600' : 'text-gray-400'}>
                        {user.hasVoted ? 'כן' : 'לא'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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
