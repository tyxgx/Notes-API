import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider.jsx';

function Avatar({ email }) {
  const initials = (email || '?').slice(0, 2).toUpperCase();
  return (
    <div className="w-8 h-8 rounded-full bg-gray-900 text-white grid place-items-center text-xs font-semibold">
      {initials}
    </div>
  );
}

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="inline-flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-amber-400" />
          <span className="font-semibold tracking-tight">Notes</span>
        </Link>
        <nav className="flex items-center gap-2">
          {user ? (
            <>
              <Link className="hidden sm:inline-flex items-center h-9 px-3 rounded-full border border-gray-200 text-sm text-gray-700 hover:bg-gray-50" to="/board">Board</Link>
              <Link className="hidden sm:inline-flex items-center h-9 px-3 rounded-full border border-gray-200 text-sm text-gray-700 hover:bg-gray-50" to="/list">List</Link>
              <Link className="hidden sm:inline-flex items-center h-9 px-3 rounded-full border border-gray-200 text-sm text-gray-700 hover:bg-gray-50" to="/profile">Profile</Link>
              <button className="hidden sm:inline-flex items-center h-9 px-3 rounded-full text-sm text-gray-700 hover:bg-gray-50" onClick={onLogout}>Logout</button>
              <Link to="/profile" className="sm:hidden"><Avatar email={user.email} /></Link>
            </>
          ) : (
            <>
              <Link className="inline-flex items-center h-9 px-3 rounded-full text-sm text-gray-700 hover:bg-gray-50" to="/login">Sign in</Link>
              <Link className="inline-flex items-center h-9 px-4 rounded-full text-sm text-white bg-gray-900 hover:bg-black" to="/register">Get started</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
