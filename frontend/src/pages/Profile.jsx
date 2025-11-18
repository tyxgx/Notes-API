import { useAuth } from '../context/AuthProvider.jsx';

export default function Profile() {
  const { user } = useAuth();

  const initials = (user?.name || user?.email || '?')
    .split(' ')
    .map((chunk) => chunk[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="bg-white border rounded p-4 space-y-4">
      <h1 className="text-lg font-semibold mb-2">Profile</h1>
      <div className="flex items-center gap-4">
        {user?.picture ? (
          <img src={user.picture} alt={user?.name || user?.email} className="h-16 w-16 rounded-full object-cover border" />
        ) : (
          <div className="h-16 w-16 rounded-full bg-gray-900 text-white grid place-items-center text-lg font-semibold">
            {initials}
          </div>
        )}
        <div className="text-left">
          <div className="text-xl font-semibold">{user?.name || 'New teammate'}</div>
          <div className="text-sm text-gray-500">{user?.email}</div>
        </div>
      </div>
      <div className="text-sm text-gray-400">User ID: {user?.id || user?._id}</div>
    </div>
  );
}
