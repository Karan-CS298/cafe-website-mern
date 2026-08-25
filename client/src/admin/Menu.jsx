import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { SaveButton } from './ui';

export default function Menu() {
  const [menu, setMenu] = useState(null);
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setError('');
      const { data } = await api.get('/admin/menu');
      setMenu(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load menu PDF.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const upload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const { data } = await api.post('/admin/menu', fd);
      setMenu(data);
      setFile(null);
      e.target.reset();
    } catch (err) {
      alert(err.response?.data?.message || 'Upload failed.');
    } finally {
      setBusy(false);
    }
  };

  const del = async () => {
    if (!confirm('Remove current menu PDF?')) return;
    try {
      await api.delete('/admin/menu');
      setMenu(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Unable to delete menu PDF.');
    }
  };

  return (
    <>
      <h1 className="font-display text-5xl">Menu PDF</h1>
      <p className="mt-2 text-sm text-espresso/50">Upload the latest full menu. Only PDFs are accepted.</p>

      {error && <p className="mt-6 rounded-2xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}

      <form onSubmit={upload} className="mt-8 rounded-3xl bg-white p-6 ring-1 ring-black/5">
        <input type="file" accept="application/pdf,.pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} className="block w-full text-sm" />
        <div className="mt-5">
          <SaveButton disabled={!file || busy}>{busy ? 'Uploading…' : 'Upload / replace PDF'}</SaveButton>
        </div>
      </form>

      {loading ? (
        <div className="mt-6 rounded-2xl bg-white p-5 ring-1 ring-black/5">Loading menu…</div>
      ) : menu?.pdfUrl ? (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-5 ring-1 ring-black/5">
          <div>
            <b>{menu.fileName}</b>
            <p className="text-xs text-espresso/40">Updated {new Date(menu.uploadedAt).toLocaleString()}</p>
          </div>
          <div>
            <a className="mr-4 font-bold text-coffee" href={menu.pdfUrl} target="_blank" rel="noreferrer">View</a>
            <button type="button" className="font-bold text-red-600" onClick={del}>Delete</button>
          </div>
        </div>
      ) : (
        <div className="mt-6 rounded-2xl bg-white p-5 text-sm text-espresso/50 ring-1 ring-black/5">No menu PDF uploaded yet.</div>
      )}
    </>
  );
}
