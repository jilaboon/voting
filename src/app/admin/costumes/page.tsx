'use client';

import { useEffect, useState } from 'react';

interface Costume {
  id: string;
  title: string;
  imageUrl: string | null;
}

export default function CostumesPage() {
  const [costumes, setCostumes] = useState<Costume[]>([]);
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCostumes();
  }, []);

  async function fetchCostumes() {
    const res = await fetch('/api/admin/costumes');
    if (res.ok) {
      setCostumes(await res.json());
    }
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);

    const res = await fetch('/api/admin/costumes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: title.trim(), imageUrl: imageUrl.trim() || null }),
    });

    if (res.ok) {
      setTitle('');
      setImageUrl('');
      fetchCostumes();
    }
    setLoading(false);
  }

  async function handleDelete(id: string, costumeTitle: string) {
    if (!window.confirm(`למחוק את "${costumeTitle}"?`)) return;

    const res = await fetch(`/api/admin/costumes/${id}`, { method: 'DELETE' });
    if (res.ok) {
      fetchCostumes();
    }
  }

  function startEdit(costume: Costume) {
    setEditId(costume.id);
    setEditTitle(costume.title);
    setEditImageUrl(costume.imageUrl || '');
  }

  async function handleSaveEdit() {
    if (!editId || !editTitle.trim()) return;

    const res = await fetch(`/api/admin/costumes/${editId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: editTitle.trim(), imageUrl: editImageUrl.trim() || null }),
    });

    if (res.ok) {
      setEditId(null);
      fetchCostumes();
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">ניהול תחפושות</h1>

      {/* Add Form */}
      <form
        onSubmit={handleAdd}
        className="rounded-xl bg-white p-5 shadow-sm border border-gray-200 space-y-3"
      >
        <h2 className="text-lg font-semibold text-gray-700">הוסף תחפושת</h2>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="שם התחפושת"
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
          />
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="קישור לתמונה (אופציונלי)"
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading || !title.trim()}
            className="rounded-lg bg-blue-600 px-5 py-2 text-white font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'מוסיף...' : 'הוסף'}
          </button>
        </div>
      </form>

      {/* Costumes List */}
      <div className="space-y-3">
        {costumes.length === 0 ? (
          <p className="text-center text-gray-400 py-8">אין תחפושות עדיין</p>
        ) : (
          costumes.map((costume) => (
            <div
              key={costume.id}
              className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm border border-gray-200"
            >
              {editId === costume.id ? (
                <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={editImageUrl}
                    onChange={(e) => setEditImageUrl(e.target.value)}
                    placeholder="קישור לתמונה"
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveEdit}
                      className="rounded-lg bg-green-600 px-3 py-1.5 text-sm text-white font-medium hover:bg-green-700 transition-colors"
                    >
                      שמור
                    </button>
                    <button
                      onClick={() => setEditId(null)}
                      className="rounded-lg bg-gray-200 px-3 py-1.5 text-sm text-gray-700 font-medium hover:bg-gray-300 transition-colors"
                    >
                      ביטול
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <p className="font-medium text-gray-800">{costume.title}</p>
                    {costume.imageUrl && (
                      <p className="text-xs text-gray-400 truncate max-w-xs">{costume.imageUrl}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(costume)}
                      className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-700 font-medium hover:bg-gray-200 transition-colors"
                    >
                      עריכה
                    </button>
                    <button
                      onClick={() => handleDelete(costume.id, costume.title)}
                      className="rounded-lg bg-red-50 px-3 py-1.5 text-sm text-red-600 font-medium hover:bg-red-100 transition-colors"
                    >
                      מחיקה
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
