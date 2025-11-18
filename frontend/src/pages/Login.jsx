import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider.jsx';
import GoogleSignInButton from '../components/GoogleSignInButton.jsx';

export default function Login() {
  const { loginWithGoogle } = useAuth();
  const nav = useNavigate();
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCredential = useCallback(async (credential) => {
    if (!credential) return;
    setErr('');
    setLoading(true);
    try {
      await loginWithGoogle(credential);
      nav('/board', { replace: true });
    } catch (e2) {
      const apiError = e2.response?.data;
      const message = typeof apiError?.error === 'string'
        ? apiError.error
        : typeof apiError?.message === 'string'
          ? apiError.message
          : 'Google sign-in failed';
      setErr(message);
    } finally {
      setLoading(false);
    }
  }, [loginWithGoogle, nav]);

  return (
    <div className="max-w-sm mx-auto mt-12 bg-white p-6 rounded-2xl border shadow-sm text-center">
      <h1 className="text-2xl font-semibold mb-2">Welcome back</h1>
      <p className="text-sm text-gray-500 mb-4">Sign in to your notes with Google.</p>
      {err && <div className="text-red-600 text-sm mb-3">{err}</div>}
      <GoogleSignInButton onCredential={handleCredential} disabled={loading} />
      {loading && <div className="text-xs text-gray-400 mt-3">Finishing sign-in…</div>}
      <p className="text-xs text-gray-400 mt-6">Securely powered by Google.</p>
    </div>
  );
}
