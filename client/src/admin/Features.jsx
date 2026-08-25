import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Field, inputClass, SaveButton } from './ui';

const blank = { title: '', description: '', icon: 'Coffee', displayOrder: 0, isActive: true };

export default function Features() {
  const [items, setItems] = useState([]);
  const [f, setF] = useState(blank);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setError('');
      const { data } = await api.get('/admin/features');
      setItems(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load features.');
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
      if (editing) await api.put(`/admin/features/${editing}`, f);
      else await api.post('/admin/features', f);
      setF(blank);
      setEditing(null);
      await load();
    } catch (err) {
      alert(err.response?.data?.message || 'Unable to save feature.');
    }
  };

  const del = async (id) => {
    if (!confirm('Delete feature?')) return;
    try {
      await api.delete(`/admin/features/${id}`);
      await load();
    } catch (err) {
      alert(err.response?.data?.message || 'Unable to delete feature.');
    }
  };

  return (
    <>
      <h1 className="font-display text-5xl">Features</h1>

      <form onSubmit={save} className="mt-8 grid gap-4 rounded-3xl bg-white p-6 ring-1 ring-black/5 md:grid-cols-2">
        <Field label="Title"><input className={inputClass} value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} required /></Field>
        <Field label="Icon name (Lucide)"><input className={inputClass} value={f.icon} onChange={(e) => setF({ ...f, icon: e.target.value })} /></Field>
        <Field label="Description"><input className={inputClass} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} /></Field>
        <Field label="Display order"><input type="number" className={inputClass} value={f.displayOrder} onChange={(e) => setF({ ...f, displayOrder: e.target.value })} /></Field>
        <label className="text-sm"><input type="checkbox" checked={f.isActive} onChange={(e) => setF({ ...f, isActive: e.target.checked })} /> <span className="ml-2 font-semibold">Active</span></label>
        <div><SaveButton>{editing ? 'Update' : 'Add feature'}</SaveButton></div>
      </form>

      {error && <p className="mt-6 rounded-2xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}

      <div className="mt-8 space-y-3">
        {loading ? (
          <div className="rounded-2xl bg-white p-5 ring-1 ring-black/5">Loading features…</div>
        ) : items.length === 0 ? (
          <div className="rounded-2xl bg-white p-5 text-sm text-espresso/50 ring-1 ring-black/5">No features yet.</div>
        ) : (
          items.map((x) => (
            <div key={x._id} className="flex items-center justify-between rounded-2xl bg-white p-5 ring-1 ring-black/5">
              <div><b>{x.title}</b><p className="text-sm text-espresso/50">{x.description}</p></div>
              <div>
                <button type="button" className="mr-4 font-bold text-coffee" onClick={() => { setEditing(x._id); setF(x); }}>Edit</button>
                <button type="button" className="font-bold text-red-600" onClick={() => del(x._id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
