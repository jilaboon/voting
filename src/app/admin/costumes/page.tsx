'use client';

import { useEffect, useState, useRef } from 'react';

interface Costume {
  id: string;
  title: string;
  imageUrl: string | null;
}

export default function CostumesPage() {
  const [costumes, setCostumes] = useState<Costume[]>([]);
  const [title, setTitle] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchCostumes();
  }, []);

  async function fetchCostumes() {
    const res = await fetch('/api/admin/costumes');
    if (res.ok) {
      setCostumes(await res.json());
    }
  }

  async function uploadFile(file: File): Promise<string | null> {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
    if (res.ok) {
      const data = await res.json();
      return data.url;
    }
    return null;
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);

    let imageUrl: string | null = null;
    const file = fileInputRef.current?.files?.[0];
    if (file) {
      imageUrl = await uploadFile(file);
    }

    const res = await fetch('/api/admin/costumes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: title.trim(), imageUrl }),
    });

    if (res.ok) {
      setTitle('');
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
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
  }

  async function handleSaveEdit() {
    if (!editId || !editTitle.trim()) return;
    setLoading(true);

    let imageUrl: string | undefined;
    const file = editFileInputRef.current?.files?.[0];
    if (file) {
      const url = await uploadFile(file);
      if (url) imageUrl = url;
    }

    const body: Record<string, string> = { title: editTitle.trim() };
    if (imageUrl) body.imageUrl = imageUrl;

    const res = await fetch(`/api/admin/costumes/${editId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      setEditId(null);
      if (editFileInputRef.current) editFileInputRef.current.value = '';
      fetchCostumes();
    }
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">ניהול תחפושות</h1>

      {/* Add Form */}
      <form
        onSubmit={handleAdd}
        className="rounded-xl bg-white p-5 shadow-sm border border-gray-200 space-y-4"
      >
        <h2 className="text-lg font-semibold text-gray-700">הוסף תחפושת</h2>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="שם התחפושת"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
        />
        <div className="flex items-center gap-3">
          <label className="flex-1 cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-3 text-center text-sm text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileSelect}
              className="hidden"
            />
            {imagePreview ? 'החלף תמונה' : 'צלם או בחר תמונה'}
          </label>
        </div>
        {imagePreview && (
          <div className="relative">
            <img src={imagePreview} alt="תצוגה מקדימה" className="h-32 w-32 rounded-lg object-cover" />
            <button
              type="button"
              onClick={() => {
                setImagePreview(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              className="absolute top-1 right-1 rounded-full bg-red-500 px-2 py-0.5 text-xs text-white"
            >
              ✕
            </button>
          </div>
        )}
        <button
          type="submit"
          disabled={loading || !title.trim()}
          className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-white font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'מוסיף...' : 'הוסף תחפושת'}
        </button>
      </form>

      {/* Costumes List */}
      <div className="space-y-3">
        {costumes.length === 0 ? (
          <p className="text-center text-gray-400 py-8">אין תחפושות עדיין</p>
        ) : (
          costumes.map((costume) => (
            <div
              key={costume.id}
              className="rounded-xl bg-white p-4 shadow-sm border border-gray-200"
            >
              {editId === costume.id ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                  />
                  <label className="block cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-2 text-center text-sm text-gray-500 hover:border-blue-400 transition-colors">
                    <input
                      ref={editFileInputRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                    />
                    החלף תמונה
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveEdit}
                      disabled={loading}
                      className="rounded-lg bg-green-600 px-3 py-1.5 text-sm text-white font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
                    >
                      {loading ? 'שומר...' : 'שמור'}
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
                <div className="flex items-center gap-4">
                  {costume.imageUrl && (
                    <img
                      src={costume.imageUrl}
                      alt={costume.title}
                      className="h-16 w-16 rounded-lg object-cover flex-shrink-0"
                    />
                  )}
                  <p className="flex-1 font-medium text-gray-800">{costume.title}</p>
                  <div className="flex gap-2 flex-shrink-0">
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
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
