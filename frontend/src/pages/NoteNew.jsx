import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client.js';
import NoteForm from '../components/NoteForm.jsx';

export default function NoteNew() {
  const nav = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const title = e.target.title.value;
    const content = e.target.content.value;
    try {
      const { data } = await client.post('/notes', { title, content });
      nav(`/notes/${data.note?._id || data._id}`);
    } finally { setSubmitting(false); }
  };

  return (
    <div className="bg-white border rounded p-4">
      <h1 className="text-lg font-semibold mb-3">New Note</h1>
      <NoteForm onSubmit={onSubmit} submitting={submitting} />
    </div>
  );
}
