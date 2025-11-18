# Notes API + Board UI

Modern sticky-board notes experience with JWT-secured API and a Vite + React frontend.

## Run It
1. **Backend**
   ```bash
   cd backend
   npm install
   npm run dev
   ```
2. **Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
3. Open `http://localhost:5173`.

### Backend env vars (Render)

- `MONGODB_URI` – Atlas connection string (SRV)
- `JWT_SECRET` – strong secret
- `CLIENT_ORIGIN` – production frontend URL (e.g. https://notes-api-livid-pi.vercel.app)
- `GOOGLE_CLIENT_ID` – OAuth Client ID from Google Cloud
- `PORT` – managed by host (Render sets automatically)

### Frontend env vars (Vercel)

- `VITE_API_BASE_URL` – backend base URL (e.g. https://notes-api-imkb.onrender.com)
- `VITE_GOOGLE_CLIENT_ID` – same Google OAuth Client ID as backend

## Ideal Workflow (Delivered)
- **Landing → Onboard**: Public landing at `/` with call-to-action. Google Sign-In (button or One Tap) drops you onto `/board`.
- **Quick Capture**: Press `N` anywhere (or use Command Palette `⌘/Ctrl + K`) to open the global capture modal. Submit to “paste” a sticky at the board’s top-left.
- **Sticky Board**: Infinite canvas with zoom (toolbar or pinch) and pan (drag background). Snap-to-grid, color picker, pin toggle, inline tag chips, double-click to open full editor.
- **Toolbar Controls**: Search, archived toggle, grid toggle, zoom %, center view, new-note button (shows shortcut), status hints.
- **Command Palette**: `⌘/Ctrl + K` for command search (Board/List/Profile/Quick Capture/Logout, etc.). Arrow/Enter navigation supported.
- **List View**: `/list` has search, archived switch, pagination, tag chips for quick scanning.
- **Profile & Auth**: Google Sign-In (button + One Tap), `/profile` to view account, logout anywhere.
- Backend hardening includes Helmet, CORS (respecting `CLIENT_ORIGIN`), and auth rate limiting.

## Keyboard & Pointer Cheatsheet
- `N`: Quick capture modal (when signed in).
- `⌘/Ctrl + K`: Command palette.
- Drag sticky header: move + snap. Drag canvas background: pan.
- Scroll wheel: pan; `⌘/Ctrl + wheel`: smooth zoom.
- Buttons: Grid toggle, Archived toggle, Zoom ±, Center.

## API Enhancements
- Notes now support `tags`, `archived`, `pinned`, `x/y/z`, `color`, `rotation`.
- Query `/api/notes` with `q`, `tags`, `archived=true|false|all` + pagination.
- New endpoints:
  - `PATCH /api/notes/:id/position` – update coordinates/layer.
  - `PATCH /api/notes/:id/style` – color, rotation, pinned, tags.
  - `PATCH /api/notes/:id/archive` – archive / restore.

## Next Ideas
- Multi-select + drag groups.
- Inline tag editor on stickies.
- Offline-first cache + sync indicators.
- Collaborative presence / sockets.
