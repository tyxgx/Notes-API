export default function NoteForm({ initial = { title: '', content: '' }, onSubmit, submitting }) {
  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div>
        <label className="block text-sm font-medium">Title</label>
        <input name="title" defaultValue={initial.title} className="mt-1 w-full border rounded px-3 py-2" required />
      </div>
      <div>
        <label className="block text-sm font-medium">Content</label>
        <textarea name="content" defaultValue={initial.content} rows="6" className="mt-1 w-full border rounded px-3 py-2" />
      </div>
      <button disabled={submitting} className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-60">
        {submitting ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
}

