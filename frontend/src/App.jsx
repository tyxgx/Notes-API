import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider.jsx';
import Header from './components/Header.jsx';
import GlobalHotkeys from './components/GlobalHotkeys.jsx';
import Login from './pages/Login.jsx';
import Profile from './pages/Profile.jsx';
import NotesList from './pages/NotesList.jsx';
import Board from './pages/Board.jsx';
import Landing from './pages/Landing.jsx';
import NoteNew from './pages/NoteNew.jsx';
import NoteEdit from './pages/NoteEdit.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <Header />
        <GlobalHotkeys />
        <main className="p-0">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/" element={<Landing />} />
            <Route path="/board" element={<ProtectedRoute><Board /></ProtectedRoute>} />
            <Route
              path="/list"
              element={
                <ProtectedRoute>
                  <div className="max-w-3xl mx-auto p-4"><NotesList /></div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/notes/new"
              element={
                <ProtectedRoute>
                  <NoteNew />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notes/:id"
              element={
                <ProtectedRoute>
                  <NoteEdit />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}
