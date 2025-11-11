import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import client from '../api/client.js';
import { useAuth } from '../context/AuthProvider.jsx';

export default function NotesList() {
  const [sp, setSp] = useSearchParams();
  const [data, setData] = useState({ notes: [], totalPages: 1, currentPage: 1, totalNotes: 0 });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const page = Number(sp.get('page') || 1);
  const limit = Number(sp.get('limit') || 10);
  const sort = sp.get('sort') || '-createdAt';
  const q = sp.get('q') || '';
  const archived = sp.get('archived') === 'true';

  const load = async () => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit, sort });
    if (q.trim()) params.set('q', q.trim());
    params.set('archived', archived ? 'true' : 'false');
    const { data } = await client.get(`/notes?${params.toString()}`);
    setData(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, [page, limit, sort, q, archived]);

  const canCreate = ['creator', 'admin'].includes(user?.role);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">My Notes</h1>
        {canCreate && <Link to="/notes/new" className="bg-blue-600 text-white px-3 py-2 rounded">New Note</Link>}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <input
          value={q}
          onChange={(e) => { sp.set('q', e.target.value); sp.set('page', '1'); setSp(sp, { replace: true }); }}
          placeholder="Search title or content"
          className="border rounded px-3 py-1 text-sm"
        />
        <label className="text-sm">Sort:</label>
        <select value={sort} onChange={(e)=>{ sp.set('sort', e.target.value); setSp(sp, { replace: true }); }} className="border rounded px-2 py-1">
          <option value="-createdAt">Newest</option>
          <option value="createdAt">Oldest</option>
        </select>
        <label className="text-sm ml-4">Limit:</label>
        <select value={String(limit)} onChange={(e)=>{ sp.set('limit', e.target.value); setSp(sp, { replace: true }); }} className="border rounded px-2 py-1">
          <option>5</option>
          <option>10</option>
          <option>20</option>
        </select>
        <button
          className={`text-sm border rounded px-3 py-1 ${archived ? 'border-gray-900 text-gray-900' : 'border-gray-200 text-gray-600'}`}
          onClick={()=>{ sp.set('archived', archived ? 'false' : 'true'); sp.set('page', '1'); setSp(sp, { replace: true }); }}
        >
          {archived ? 'Viewing archived' : 'Active only'}
        </button>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="space-y-2">
          {data.notes.map(n => (
            <Link key={n._id} to={`/notes/${n._id}`} className="block bg-white border rounded p-3 hover:bg-gray-50">
              <div className="font-medium">{n.title}</div>
              <div className="text-sm text-gray-600 line-clamp-2">{n.content}</div>
              <div className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString()}</div>
              {n.tags?.length ? (
                <div className="mt-2 flex flex-wrap gap-1 text-[11px] text-gray-500">
                  {n.tags.map(tag => <span key={tag} className="px-2 py-0.5 rounded-full bg-gray-100">#{tag}</span>)}
                </div>
              ) : null}
            </Link>
          ))}
          <div className="flex items-center gap-2 pt-2">
            <button disabled={page<=1} onClick={()=>{ sp.set('page', String(page-1)); setSp(sp, { replace: true }); }} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
            <span className="text-sm">Page {data.currentPage} / {data.totalPages}</span>
            <button disabled={page>=data.totalPages} onClick={()=>{ sp.set('page', String(page+1)); setSp(sp, { replace: true }); }} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
          </div>
        </div>
      )}
    </div>
  );
}
