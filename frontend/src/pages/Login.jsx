import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider.jsx';

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr(''); setLoading(true);
    const email = e.target.email.value;
    const password = e.target.password.value;
    try {
      await login(email, password);
      nav('/');
    } catch (e2) {
      const apiError = e2.response?.data;
      const message = typeof apiError?.error === 'string'
        ? apiError.error
        : typeof apiError?.message === 'string'
          ? apiError.message
          : 'Login failed';
      setErr(message);
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-sm mx-auto mt-12 bg-white p-6 rounded border">
      <h1 className="text-xl font-semibold mb-4">Login</h1>
      {err && <div className="text-red-600 text-sm mb-3">{err}</div>}
      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input name="email" type="email" className="mt-1 w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm font-medium">Password</label>
          <input name="password" type="password" className="mt-1 w-full border rounded px-3 py-2" required />
        </div>
        <button disabled={loading} className="w-full bg-blue-600 text-white px-4 py-2 rounded">{loading ? 'Logging in...' : 'Login'}</button>
      </form>
      <p className="text-sm mt-3">No account? <Link className="text-blue-600" to="/register">Register</Link></p>
    </div>
  );
}
