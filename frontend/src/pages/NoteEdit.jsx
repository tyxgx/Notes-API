import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import client from '../api/client.js';
import NoteForm from '../components/NoteForm.jsx';

export default function NoteEdit() {
  const { id } = useParams();
  const nav = useNavigate();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const { data } = await client.get(`/notes/${id}`);
        setNote(data.note || data);
      } catch (e) {
        setError(e.response?.data?.message || 'Failed to load note');
      } finally { setLoading(false); }
    };
    fetchNote();
  }, [id]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const title = e.target.title.value;
    const content = e.target.content.value;
    try {
      await client.put(`/notes/${id}`, { title, content });
      nav('/');
    } catch (e2) {
      setError(e2.response?.data?.message || 'Update failed');
    } finally { setSubmitting(false); }
  };

  const onDelete = async () => {
    if (!confirm('Delete this note?')) return;
    try {
      await client.delete(`/notes/${id}`);
      nav('/');
    } catch (e2) {
      setError(e2.response?.data?.message || 'Delete failed');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600 text-sm">{error}</div>;
  if (!note) return null;

  return (
    <div className="bg-white border rounded p-4 space-y-3">
      <h1 className="text-lg font-semibold">Edit Note</h1>
      <NoteForm initial={{ title: note.title, content: note.content }} onSubmit={onSubmit} submitting={submitting} />
      <button onClick={onDelete} className="text-red-600 border border-red-600 px-3 py-1 rounded">Delete</button>
    </div>
  );
}
