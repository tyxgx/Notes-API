import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client.js';
import { useAuth } from '../context/AuthProvider.jsx';
import CommandPalette from './CommandPalette.jsx';

const isTypingTarget = (target) => {
  if (!target) return false;
  const tag = target.tagName?.toLowerCase();
  return ['input', 'textarea', 'select'].includes(tag) || target.isContentEditable;
};

export default function GlobalHotkeys() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [captureOpen, setCaptureOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const canCreate = ['creator', 'admin'].includes(user?.role);

  const openCapture = () => {
    if (!user || !canCreate) return;
    setCaptureOpen(true);
    setTimeout(() => document.getElementById('quick-capture-title')?.focus(), 0);
  };

  useEffect(() => {
    const handler = (e) => {
      if (isTypingTarget(e.target)) return;
      if (user && canCreate && !e.metaKey && !e.ctrlKey && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        openCapture();
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [user]);

  const closeCapture = () => {
    setCaptureOpen(false);
    setError('');
    setTitle('');
    setContent('');
  };

  const onCreate = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    setPending(true);
    try {
      const { data } = await client.post('/notes', {
        title: title.trim(),
        content,
        x: 24,
        y: 24
      });
      const note = data.note || data;
      window.dispatchEvent(new CustomEvent('note-created', { detail: note }));
      closeCapture();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create note');
    } finally {
      setPending(false);
    }
  };

  const actions = [];
  if (user) {
    actions.push(
      { id: 'board', label: 'Open board', shortcut: 'B', onSelect: () => navigate('/board') },
      { id: 'list', label: 'Open list view', shortcut: 'L', onSelect: () => navigate('/list') },
      ...(canCreate ? [{ id: 'quick', label: 'Quick capture', shortcut: 'N', description: 'Create a note from anywhere', onSelect: openCapture }] : []),
      { id: 'profile', label: 'Profile', onSelect: () => navigate('/profile') },
      { id: 'logout', label: 'Sign out', onSelect: () => { logout(); navigate('/login'); } }
    );
  } else {
    actions.push(
      { id: 'login', label: 'Sign in', onSelect: () => navigate('/login') },
      { id: 'register', label: 'Create account', onSelect: () => navigate('/register') }
    );
  }

  return (
    <>
      {captureOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur" onMouseDown={closeCapture}>
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-gray-100 p-6" onMouseDown={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Quick capture</h2>
              <button className="text-sm text-gray-500" onClick={closeCapture}>Esc</button>
            </div>
            <form className="space-y-3" onSubmit={onCreate}>
              <div>
                <label className="text-xs text-gray-500">Title</label>
                <input
                  id="quick-capture-title"
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Content</label>
                <textarea
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
              {error && <div className="text-sm text-red-600">{error}</div>}
              <button
                type="submit"
                disabled={pending}
                className="w-full rounded-lg bg-blue-600 text-white py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-60"
              >
                {pending ? 'Saving…' : 'Paste to board'}
              </button>
            </form>
          </div>
        </div>
      )}
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} actions={actions} />
    </>
  );
}
