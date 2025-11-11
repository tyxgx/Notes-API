import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client.js';
import StickyNote from '../components/StickyNote.jsx';
import { useAuth } from '../context/AuthProvider.jsx';

const COLORS = ['yellow', 'mint', 'lilac', 'coral', 'sky'];
const BOARD_SIZE = { width: 2400, height: 1600 };

export default function Board() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newId, setNewId] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [query, setQuery] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  const [grid, setGrid] = useState(true);
  const [viewport, setViewport] = useState({ x: 80, y: 40, scale: 1 });
  const [panning, setPanning] = useState(false);
  const panState = useRef({ startX: 0, startY: 0, originX: 0, originY: 0 });
  const navigate = useNavigate();
  const { user } = useAuth();
  const canCreate = ['creator', 'admin'].includes(user?.role);
  const canMove = ['creator', 'editor', 'admin'].includes(user?.role);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        limit: '200',
        sort: '-updatedAt',
        archived: showArchived ? 'true' : 'false'
      });
      if (query.trim()) params.set('q', query.trim());
      const { data } = await client.get(`/notes?${params.toString()}`);
      setNotes(data.notes || []);
      setError('');
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load notes');
    } finally {
      setLoading(false);
    }
  }, [query, showArchived]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    const timer = setTimeout(() => setQuery(searchInput), 250);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    const handler = (event) => {
      const note = event.detail;
      if (!note) return;
      setNotes((prev) => [note, ...prev]);
      setNewId(note._id);
      setTimeout(() => setNewId(null), 1200);
    };
    window.addEventListener('note-created', handler);
    return () => window.removeEventListener('note-created', handler);
  }, []);

  const onCreate = async () => {
    if (!canCreate) return;
    try {
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      const body = { title: 'Untitled', content: '', x: 32, y: 32, color };
      const { data } = await client.post('/notes', body);
      const created = data.note || data;
      setNotes((n) => [created, ...n]);
      setNewId(created._id);
      setTimeout(() => setNewId(null), 1200);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to create note');
    }
  };

  const onUpdatePos = async (id, pos) => {
    if (!canMove) return;
    setNotes((n) => n.map((x) => (x._id === id ? { ...x, ...pos } : x)));
    try {
      await client.patch(`/notes/${id}/position`, pos);
    } catch (e) {
      // ignore transient errors
    }
  };

  const onUpdateStyle = async (id, style) => {
    if (!canMove) return;
    setNotes((n) => n.map((x) => (x._id === id ? { ...x, ...style } : x)));
    try {
      await client.patch(`/notes/${id}/style`, style);
    } catch (e) {}
  };

  const clampScale = (value) => Math.min(Math.max(value, 0.6), 1.8);

  const handleWheel = (e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.08 : 0.08;
      setViewport((v) => ({ ...v, scale: clampScale(v.scale + delta) }));
    } else {
      setViewport((v) => ({ ...v, x: v.x - e.deltaX, y: v.y - e.deltaY }));
    }
  };

  const startPan = (clientX, clientY) => {
    setPanning(true);
    panState.current = { startX: clientX, startY: clientY, originX: viewport.x, originY: viewport.y };
  };

  const handlePointerDown = (e) => {
    if (e.target.closest('[data-note]')) return;
    e.preventDefault();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    startPan(clientX, clientY);
  };

  useEffect(() => {
    const move = (e) => {
      if (!panning) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const { startX, startY, originX, originY } = panState.current;
      setViewport((v) => ({ ...v, x: originX + (clientX - startX), y: originY + (clientY - startY) }));
    };
    const up = () => setPanning(false);
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
    window.addEventListener('touchmove', move, { passive: false });
    window.addEventListener('touchend', up);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
      window.removeEventListener('touchmove', move);
      window.removeEventListener('touchend', up);
    };
  }, [panning]);

  const boardBackground = grid
    ? 'bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.08)_1px,transparent_0)] bg-[length:40px_40px]'
    : 'bg-neutral-100';

  return (
    <div className="w-screen h-[calc(100vh-56px)] bg-neutral-50">
      <div className="border-b bg-white/80 backdrop-blur px-4 py-3 flex flex-wrap gap-3 items-center">
        <button
          onClick={onCreate}
          disabled={!canCreate}
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-white shadow ${canCreate ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'}`}
        >
          <span>New note</span>
          <span className="text-[10px] uppercase opacity-70">N</span>
        </button>
        <div className="flex items-center rounded-full border border-gray-200 px-3 py-1.5 text-sm">
          <input
            className="bg-transparent focus:outline-none text-sm"
            placeholder="Search notes"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          {loading ? <span className="ml-2 text-xs text-gray-400">Loading…</span> : null}
        </div>
        <button
          onClick={() => setShowArchived((v) => !v)}
          className={`rounded-full px-3 py-1.5 text-sm border ${showArchived ? 'border-gray-900 text-gray-900' : 'border-gray-200 text-gray-600'}`}
        >
          {showArchived ? 'Viewing archived' : 'Active notes'}
        </button>
        <button
          onClick={() => setGrid((v) => !v)}
          className={`rounded-full px-3 py-1.5 text-sm border ${grid ? 'border-gray-900 text-gray-900' : 'border-gray-200 text-gray-600'}`}
        >
          {grid ? 'Grid on' : 'Grid off'}
        </button>
        <div className="ml-auto flex items-center gap-2">
          <button className="rounded-full border border-gray-200 px-2 py-1 text-sm" onClick={() => setViewport((v) => ({ ...v, scale: clampScale(v.scale - 0.1) }))}>-</button>
          <span className="text-xs text-gray-500 w-10 text-center">{Math.round(viewport.scale * 100)}%</span>
          <button className="rounded-full border border-gray-200 px-2 py-1 text-sm" onClick={() => setViewport((v) => ({ ...v, scale: clampScale(v.scale + 0.1) }))}>+</button>
          <button className="rounded-full border border-gray-200 px-3 py-1 text-sm" onClick={() => setViewport({ x: 80, y: 40, scale: 1 })}>Center</button>
        </div>
      </div>

      {error && <div className="px-4 py-2 text-sm text-red-600">{error}</div>}

      <div
        className={`relative h-[calc(100vh-112px)] overflow-hidden ${boardBackground}`}
        onWheel={handleWheel}
        onMouseDown={handlePointerDown}
        onTouchStart={handlePointerDown}
      >
        <div
          className="origin-top-left"
          style={{
            width: BOARD_SIZE.width,
            height: BOARD_SIZE.height,
            transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.scale})`,
            transformOrigin: '0 0',
            transition: panning ? 'none' : 'transform 120ms linear'
          }}
        >
          {notes.map((n) => (
            <StickyNote
              key={n._id}
              note={n}
              animatePaste={newId === n._id}
              onMove={(pos) => onUpdatePos(n._id, pos)}
              onStyle={(style) => onUpdateStyle(n._id, style)}
              onOpen={() => navigate(`/notes/${n._id}`)}
              readOnly={!canMove}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
