import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider.jsx';

function Sticky({ color = 'bg-yellow-200', rotate = '-rotate-1', children, style }) {
  return (
    <div className={`w-48 h-40 ${color} rounded-md shadow-md border border-black/5 ${rotate} p-3`} style={style}>
      <div className="text-sm font-medium text-gray-800">{children}</div>
    </div>
  );
}

export default function Landing() {
  const { user } = useAuth();
  const ctaHref = user ? '/board' : '/login';
  const ctaLabel = user ? 'Open Your Board' : 'Get Started';

  return (
    <div className="">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-amber-50 via-white to-white" />
        <div className="max-w-6xl mx-auto px-4 pt-16 pb-20">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
                Your ideas, pasted beautifully.
              </h1>
              <p className="mt-4 text-gray-600 text-lg">
                A minimal, fast notes board that feels like pinning sticky notes to a wall — now with smooth drag, delightful paste, and a clean workspace.
              </p>
              <div className="mt-6 flex items-center gap-3">
                <Link to={ctaHref} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded shadow transition-colors">
                  {ctaLabel}
                </Link>
                <Link to="/register" className="px-5 py-2.5 rounded border text-gray-800 hover:bg-gray-50">
                  Create an Account
                </Link>
              </div>
              <div className="mt-6 text-sm text-gray-500">No clutter, no noise. Just your notes, where you put them.</div>
            </div>
            <div className="relative h-[420px]">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[520px] h-[340px] rounded-xl bg-white/80 backdrop-blur border border-gray-200 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.3)] relative">
                  <div className="absolute inset-0">
                    <Sticky color="bg-yellow-200" rotate="-rotate-1" style={{ left: 24, top: 24, position: 'absolute' }}>Plan sprint</Sticky>
                    <Sticky color="bg-green-200" rotate="rotate-2" style={{ left: 220, top: 50, position: 'absolute' }}>Daily notes</Sticky>
                    <Sticky color="bg-purple-200" rotate="-rotate-2" style={{ left: 120, top: 180, position: 'absolute' }}>Ideas</Sticky>
                    <Sticky color="bg-sky-200" rotate="rotate-1" style={{ left: 320, top: 170, position: 'absolute' }}>Research</Sticky>
                    <Sticky color="bg-rose-200" rotate="-rotate-1" style={{ left: 60, top: 290, position: 'absolute' }}>To‑do</Sticky>
                  </div>
                </div>
              </div>
              <div className="pointer-events-none absolute inset-0 animate-[float_10s_ease-in-out_infinite]" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-6">
          <div className="bg-white border rounded-lg p-5 shadow-sm">
            <div className="text-lg font-semibold">Lightning-fast</div>
            <div className="text-gray-600 mt-1">Built with Vite + React for instant loads and smooth interactions.</div>
          </div>
          <div className="bg-white border rounded-lg p-5 shadow-sm">
            <div className="text-lg font-semibold">Feels real</div>
            <div className="text-gray-600 mt-1">Natural rotations, subtle shadows, and a satisfying paste animation.</div>
          </div>
          <div className="bg-white border rounded-lg p-5 shadow-sm">
            <div className="text-lg font-semibold">Yours</div>
            <div className="text-gray-600 mt-1">Notes are private to your account. Move and style them your way.</div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-b from-white to-amber-50/30">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-8">
            <p className="text-sm uppercase tracking-[0.3em] text-amber-500">workflow</p>
            <h2 className="text-3xl font-bold">An ideal flow for your ideas</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'Capture instantly', body: 'Hit “N” anywhere or tap New — your note lands on the board with a satisfying paste.' },
              { title: 'Arrange visually', body: 'Drag, pin, recolor, zoom, and pan to create your perfect wall of ideas.' },
              { title: 'Refine & search', body: 'Tags, search, list view, and quick jump keep everything within reach.' }
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border bg-white/70 backdrop-blur px-5 py-6 shadow-sm">
                <div className="text-sm text-gray-500">Step</div>
                <div className="text-xl font-semibold">{item.title}</div>
                <p className="text-gray-600 mt-2 text-sm">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <blockquote className="text-2xl font-semibold text-gray-800">
            “This is the first notes app that truly lets me think visually without getting in the way.”
          </blockquote>
          <p className="mt-2 text-sm text-gray-500">Product designer, early access</p>
          <div className="mt-6 flex justify-center gap-3">
            <Link to={ctaHref} className="bg-gray-900 text-white px-5 py-2.5 rounded-full">{ctaLabel}</Link>
            {!user && <Link to="/register" className="px-5 py-2.5 rounded-full border">Create free account</Link>}
          </div>
        </div>
      </section>
    </div>
  );
}
