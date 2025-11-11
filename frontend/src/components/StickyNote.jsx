import { useEffect, useRef, useState } from 'react';

const colorClasses = {
  yellow: 'bg-yellow-200 border-yellow-300',
  mint: 'bg-green-200 border-green-300',
  lilac: 'bg-purple-200 border-purple-300',
  coral: 'bg-rose-200 border-rose-300',
  sky: 'bg-sky-200 border-sky-300'
};

export default function StickyNote({ note, animatePaste, onMove, onStyle, onOpen, readOnly = false }) {
  const [pos, setPos] = useState({ x: note.x ?? 16, y: note.y ?? 16, z: note.z ?? 0 });
  const [drag, setDrag] = useState(null);
  const [anim, setAnim] = useState(animatePaste);
  const ref = useRef(null);

  useEffect(() => {
    setPos({ x: note.x ?? 16, y: note.y ?? 16, z: note.z ?? 0 });
  }, [note.x, note.y, note.z]);

  useEffect(() => {
    if (animatePaste) {
      setAnim(true);
      const t = setTimeout(() => setAnim(false), 800);
      return () => clearTimeout(t);
    }
  }, [animatePaste]);

  useEffect(() => {
    const move = (e) => {
      if (!drag) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const dx = clientX - drag.startX;
      const dy = clientY - drag.startY;
      let nx = Math.round((drag.origX + dx) / 8) * 8;
      let ny = Math.round((drag.origY + dy) / 8) * 8;
      if (nx < 0) nx = 0; if (ny < 0) ny = 0;
      setPos(p => ({ ...p, x: nx, y: ny }));
    };
    const up = () => {
      if (drag) {
        onMove({ x: pos.x, y: pos.y, z: Date.now() });
      }
      setDrag(null);
    };
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
  }, [drag, pos.x, pos.y, onMove]);

  const onDown = (e) => {
    if (readOnly) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setDrag({ startX: clientX, startY: clientY, origX: pos.x, origY: pos.y });
    e.preventDefault();
    e.stopPropagation();
  };

  const cls = colorClasses[note.color] || colorClasses.yellow;
  const rot = note.rotation ?? 0;
  const tags = Array.isArray(note.tags) ? note.tags : [];
  const zIndex = note.pinned ? 100000 : pos.z || 0;

  return (
    <div
      data-note
      ref={ref}
      onDoubleClick={() => onOpen?.()}
      className={`absolute select-none w-64 min-h-40 ${cls} border shadow-sm rounded-md transition-[transform,box-shadow,opacity] ${drag ? 'shadow-2xl' : 'shadow-md'} ${anim ? 'opacity-0 scale-90 -translate-x-3 -translate-y-3' : 'opacity-100 scale-100'}`}
      style={{ left: pos.x, top: pos.y, transform: `rotate(${rot}deg)`, zIndex }}
    >
      <div className="relative h-7 flex items-center justify-between px-2 cursor-move" onMouseDown={onDown} onTouchStart={onDown}>
        <div className="text-xs font-semibold text-gray-800 truncate pr-2 flex items-center gap-1">
          {note.pinned && <span className="text-[10px]">📌</span>}
          <span>{note.title || 'Untitled'}</span>
        </div>
        <div className="flex items-center gap-1">
          {['yellow','mint','lilac','coral','sky'].map(c => (
            <button
              type="button"
              key={c}
              onClick={(e) => { e.stopPropagation(); if (!readOnly) onStyle({ color: c }); }}
              disabled={readOnly}
              className={`w-3 h-3 rounded-full border ${colorClasses[c]?.split(' ')[0]} ${readOnly ? 'opacity-40 cursor-not-allowed' : ''}`}
              title={c}
            />
          ))}
        </div>
      </div>
      <div className="px-3 pb-3 text-sm text-gray-800 whitespace-pre-wrap">
        {(note.content || '').slice(0, 400)}
        {tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1 text-[10px] uppercase tracking-wide text-gray-600">
            {tags.map((tag) => (
              <span key={tag} className="rounded-full bg-black/10 px-2 py-0.5">#{tag}</span>
            ))}
          </div>
        )}
      </div>
      <div className="flex items-center justify-between px-3 pb-3 text-[11px] text-gray-600">
        <button type="button" className="underline" onClick={(e) => { e.stopPropagation(); onOpen?.(); }}>Open</button>
        <button
          type="button"
          className={`underline ${readOnly ? 'opacity-40 cursor-not-allowed' : ''}`}
          disabled={readOnly}
          onClick={(e) => { e.stopPropagation(); if (!readOnly) onStyle({ pinned: !note.pinned }); }}
        >
          {note.pinned ? 'Unpin' : 'Pin'}
        </button>
      </div>
    </div>
  );
}
