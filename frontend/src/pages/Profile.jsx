import { useAuth } from '../context/AuthProvider.jsx';

export default function Profile() {
  const { user } = useAuth();
  return (
    <div className="bg-white border rounded p-4">
      <h1 className="text-lg font-semibold mb-2">Profile</h1>
      <div>Email: {user?.email}</div>
      <div>Role: {user?.role}</div>
      <div>ID: {user?.id || user?._id}</div>
    </div>
  );
}

