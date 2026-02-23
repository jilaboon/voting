'use client';

import { useEffect, useState } from 'react';

interface Result {
  id: string;
  title: string;
  imageUrl: string | null;
  _count: { votes: number };
}

export default function ResultsPage() {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResults();
  }, []);

  async function fetchResults() {
    setLoading(true);
    const res = await fetch('/api/admin/results');
    if (res.ok) {
      setResults(await res.json());
    }
    setLoading(false);
  }

  const maxVotes = results.length > 0 ? results[0]._count.votes : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">תוצאות ההצבעה</h1>
        <button
          onClick={fetchResults}
          disabled={loading}
          className="rounded-lg bg-gray-100 px-4 py-2 text-sm text-gray-700 font-medium hover:bg-gray-200 disabled:opacity-50 transition-colors"
        >
          {loading ? 'טוען...' : 'רענן'}
        </button>
      </div>

      {results.length === 0 ? (
        <p className="text-center text-gray-400 py-8">
          {loading ? 'טוען תוצאות...' : 'אין תוצאות עדיין'}
        </p>
      ) : (
        <div className="rounded-xl bg-white shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-5 py-3 text-start text-sm font-semibold text-gray-600">#</th>
                <th className="px-5 py-3 text-start text-sm font-semibold text-gray-600">תחפושת</th>
                <th className="px-5 py-3 text-start text-sm font-semibold text-gray-600">מספר הצבעות</th>
              </tr>
            </thead>
            <tbody>
              {results.map((item, index) => {
                const isTop = index === 0 && item._count.votes > 0;
                return (
                  <tr
                    key={item.id}
                    className={`border-b border-gray-100 last:border-b-0 ${
                      isTop ? 'bg-yellow-50' : ''
                    }`}
                  >
                    <td className="px-5 py-3 text-sm text-gray-500">{index + 1}</td>
                    <td className="px-5 py-3">
                      <span className={`font-medium ${isTop ? 'text-yellow-700' : 'text-gray-800'}`}>
                        {item.title}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <span className={`text-lg font-bold ${isTop ? 'text-yellow-700' : 'text-gray-800'}`}>
                          {item._count.votes}
                        </span>
                        {maxVotes > 0 && (
                          <div className="h-2 flex-1 rounded-full bg-gray-100 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                isTop ? 'bg-yellow-400' : 'bg-blue-400'
                              }`}
                              style={{
                                width: `${(item._count.votes / maxVotes) * 100}%`,
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
