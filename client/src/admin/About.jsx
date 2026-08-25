import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Field, inputClass, SaveButton } from './ui';
import UploadField from './UploadField';

export default function About() {
  const [f, setF] = useState({ heading: '', tagline: '', description: '', images: [], isActive: true });
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/admin/about');
        setF((current) => ({ ...current, ...data }));
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load About section.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const save = async (e) => {
    e.preventDefault();
    try {
      await api.put('/admin/about', f);
      setMsg('Saved successfully');
      setTimeout(() => setMsg(''), 2000);
    } catch (err) {
      alert(err.response?.data?.message || 'Unable to save About section.');
    }
  };

  if (loading) return <div className="rounded-2xl bg-white p-6 ring-1 ring-black/5">Loading About section…</div>;

  return (
    <>
      <h1 className="font-display text-5xl">About section</h1>
      {error && <p className="mt-6 rounded-2xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}

      <form onSubmit={save} className="mt-8 grid gap-5 rounded-3xl bg-white p-6 ring-1 ring-black/5">
        <Field label="Tagline"><input className={inputClass} value={f.tagline} onChange={(e) => setF({ ...f, tagline: e.target.value })} /></Field>
        <Field label="Heading"><input className={inputClass} value={f.heading} onChange={(e) => setF({ ...f, heading: e.target.value })} /></Field>
        <Field label="Description"><textarea rows="5" className={inputClass} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} /></Field>
        <UploadField label="Image 1" value={f.images?.[0]} onChange={(v) => setF({ ...f, images: [v, f.images?.[1] || ''] })} />
        <UploadField label="Image 2" value={f.images?.[1]} onChange={(v) => setF({ ...f, images: [f.images?.[0] || '', v] })} />
        <label className="text-sm"><input type="checkbox" checked={f.isActive !== false} onChange={(e) => setF({ ...f, isActive: e.target.checked })} /> <span className="ml-2 font-semibold">Show section</span></label>
        <div className="flex items-center gap-4"><SaveButton />{msg && <span className="text-sm text-green-700">{msg}</span>}</div>
      </form>
    </>
  );
}
