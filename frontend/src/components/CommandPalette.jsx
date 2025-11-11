import { useEffect, useMemo, useState } from 'react';

export default function CommandPalette({ open, onClose, actions = [] }) {
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!open) {
      setQuery('');
      setIndex(0);
    }
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return actions;
    return actions.filter(action =>
      action.label.toLowerCase().includes(q) || action.description?.toLowerCase().includes(q)
    );
  }, [actions, query]);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setIndex((prev) => (prev + 1) % Math.max(filtered.length, 1));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setIndex((prev) => (prev - 1 + Math.max(filtered.length, 1)) % Math.max(filtered.length, 1));
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        const action = filtered[index];
        if (action) {
          action.onSelect();
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, filtered, index, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/20 backdrop-blur-sm p-4" onMouseDown={onClose}>
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-gray-100" onMouseDown={(e) => e.stopPropagation()}>
        <input
          autoFocus
          value={query}
          onChange={(e) => { setQuery(e.target.value); setIndex(0); }}
          placeholder="Search actions or type a command..."
          className="w-full border-b border-gray-100 px-4 py-3 text-sm focus:outline-none"
        />
        <div className="max-h-72 overflow-y-auto">
          {filtered.length === 0 && (
            <div className="px-4 py-6 text-sm text-gray-500">No actions found.</div>
          )}
          {filtered.map((action, i) => (
            <button
              key={action.id}
              className={`w-full text-left px-4 py-3 text-sm transition ${i === index ? 'bg-gray-50' : ''}`}
              onClick={() => {
                action.onSelect();
                onClose();
              }}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-800">{action.label}</span>
                {action.shortcut && <span className="text-xs text-gray-400">{action.shortcut}</span>}
              </div>
              {action.description && <div className="text-xs text-gray-500">{action.description}</div>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

