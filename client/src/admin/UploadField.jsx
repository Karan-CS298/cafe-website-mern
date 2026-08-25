import { useRef, useState } from 'react';
import { api } from '../services/api';
import { inputClass } from './ui';

export default function UploadField({ label, value, onChange, accept = 'image/jpeg,image/png,image/webp', help = 'JPG, PNG or WebP · max 8 MB' }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const upload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    if (file.size > 8 * 1024 * 1024) {
      setError('File is larger than 8 MB.');
      e.target.value = '';
      return;
    }
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      if (value) fd.append('oldUrl', value);
      const { data } = await api.post('/admin/assets', fd);
      onChange(data.url);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setBusy(false);
      e.target.value = '';
    }
  };

  return (
    <div className="md:col-span-1">
      <div className="flex items-center justify-between gap-3">
        <label className="text-sm font-semibold">{label}</label>
        <span className="text-[10px] font-bold uppercase tracking-[.18em] text-espresso/35">{busy ? 'Uploading' : 'Media'}</span>
      </div>
      <div className="mt-2 overflow-hidden rounded-2xl border border-black/10 bg-cream/40">
        <div className="flex min-h-28 items-center gap-4 p-3">
          <div className="grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-xl bg-white ring-1 ring-black/5">
            {value ? <img src={value} alt={`${label} preview`} className="h-full w-full object-contain" /> : <span className="px-2 text-center text-[11px] font-semibold text-espresso/30">No preview</span>}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs text-espresso/50">{value || 'Choose a local file to upload'}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" disabled={busy} onClick={() => inputRef.current?.click()} className="rounded-full bg-espresso px-4 py-2 text-xs font-bold text-white transition hover:-translate-y-0.5 hover:bg-coffee disabled:opacity-50">
                {busy ? 'Uploading…' : 'Choose file'}
              </button>
              {value && <button type="button" onClick={() => onChange('')} className="rounded-full bg-white px-4 py-2 text-xs font-bold text-red-600 ring-1 ring-black/10">Remove</button>}
            </div>
            <p className="mt-2 text-[11px] text-espresso/35">{help}</p>
          </div>
        </div>
      </div>
      <input ref={inputRef} className="hidden" type="file" accept={accept} onChange={upload} />
      {error && <p className="mt-2 text-xs font-semibold text-red-600">{error}</p>}
    </div>
  );
}
