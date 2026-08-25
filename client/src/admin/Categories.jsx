import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { inputClass, SaveButton } from './ui';

export default function Categories() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setError('');
      const { data } = await api.get('/admin/categories');
      setItems(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load categories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const save = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/admin/categories/${editing}`, { name });
      } else {
        await api.post('/admin/categories', { name });
      }
      setName('');
      setEditing(null);
      await load();
    } catch (err) {
      alert(err.response?.data?.message || 'Unable to save category.');
    }
  };

  const del = async (id) => {
    if (!confirm('Delete this category?')) return;
    try {
      await api.delete(`/admin/categories/${id}`);
      await load();
    } catch (err) {
      alert(err.response?.data?.message || 'Unable to delete category.');
    }
  };

  return (
    <>
      <h1 className="font-display text-5xl">Categories</h1>

      <form onSubmit={save} className="mt-8 flex max-w-2xl gap-3 rounded-3xl bg-white p-5 ring-1 ring-black/5">
        <input
          className={inputClass}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Category name"
          required
        />
        <SaveButton>{editing ? 'Update' : 'Add'}</SaveButton>
        {editing && (
          <button type="button" onClick={() => { setEditing(null); setName(''); }} className="rounded-full bg-cream px-4 font-bold">
            Cancel
          </button>
        )}
      </form>

      {error && <p className="mt-6 rounded-2xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}

      <div className="mt-8 space-y-3">
        {loading ? (
          <div className="rounded-2xl bg-white p-5 ring-1 ring-black/5">Loading categories…</div>
        ) : items.length === 0 ? (
          <div className="rounded-2xl bg-white p-5 text-sm text-espresso/50 ring-1 ring-black/5">No categories yet.</div>
        ) : (
          items.map((c) => (
            <div key={c._id} className="flex items-center justify-between rounded-2xl bg-white p-5 ring-1 ring-black/5">
              <div>
                <b>{c.name}</b>
                <span className="ml-3 text-xs text-espresso/40">{c.isActive ? 'Active' : 'Disabled'}</span>
              </div>
              <div>
                <button type="button" className="mr-4 font-bold text-coffee" onClick={() => { setEditing(c._id); setName(c.name); }}>Edit</button>
                <button type="button" className="font-bold text-red-600" onClick={() => del(c._id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
