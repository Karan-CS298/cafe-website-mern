import { useEffect, useMemo, useState } from 'react';
import { MapPin, ExternalLink, Navigation } from 'lucide-react';
import { api } from '../services/api';
import { Field, inputClass, SaveButton } from './ui';
import UploadField from './UploadField';
import { directionsUrl, mapEmbedUrl, normalizeCoordinate } from '../utils/maps';

const defaults = { cafeName:'Creme Cafe', logo:'', favicon:'', heroImage:'', description:'', phone:'', whatsapp:'', email:'', address:'', latitude:'', longitude:'', mapUrl:'', directionsUrl:'', openingHours:{}, socialLinks:{instagram:'',facebook:'',other:''} };
const hours=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

export default function Settings(){
  const [f,setF]=useState(defaults),[msg,setMsg]=useState(''),[loading,setLoading]=useState(true),[error,setError]=useState('');
  useEffect(()=>{api.get('/admin/settings').then(r=>setF({...defaults,...r.data})).catch(e=>setError(e.response?.data?.message||'Unable to load settings.')).finally(()=>setLoading(false))},[]);
  const set=(k,v)=>setF(x=>({...x,[k]:v}));
  const embed=useMemo(()=>mapEmbedUrl(f),[f]);
  const autoDirections=useMemo(()=>directionsUrl(f),[f]);
  const submit=async e=>{e.preventDefault();try{await api.put('/admin/settings',{...f,latitude:normalizeCoordinate(f.latitude),longitude:normalizeCoordinate(f.longitude),directionsUrl:f.directionsUrl||autoDirections});setMsg('Changes saved');setTimeout(()=>setMsg(''),2500)}catch(err){setError(err.response?.data?.message||'Unable to save settings.')}};
  if(loading)return <div className="rounded-[2rem] bg-white p-8 ring-1 ring-black/5">Loading cafe settings…</div>;
  return <>
    <div className="flex flex-wrap items-end justify-between gap-5"><div><p className="text-[10px] font-bold uppercase tracking-[.28em] text-gold">Brand control</p><h1 className="mt-2 font-display text-5xl font-semibold">Cafe Settings</h1><p className="mt-2 max-w-2xl text-sm text-espresso/50">Everything visitors see can be updated here — brand, contact, media, location and social presence.</p></div><div className="rounded-full bg-white px-4 py-2 text-xs font-bold text-espresso/50 ring-1 ring-black/5">Live content</div></div>
    {error&&<p className="mt-6 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</p>}
    <form onSubmit={submit} className="mt-8 space-y-6">
      <div className="grid gap-5 rounded-[2rem] bg-white p-6 ring-1 ring-black/5 md:grid-cols-2 md:p-8"><div className="md:col-span-2"><p className="text-xs font-bold uppercase tracking-[.2em] text-espresso/35">Brand identity</p></div>
        <Field label="Cafe name"><input className={inputClass} value={f.cafeName} onChange={e=>set('cafeName',e.target.value)}/></Field>
        <Field label="Email"><input className={inputClass} type="email" value={f.email} onChange={e=>set('email',e.target.value)}/></Field>
        <UploadField label="Logo" value={f.logo} onChange={v=>set('logo',v)} help="PNG, WebP or JPG · transparent logo recommended"/>
        <UploadField label="Favicon" value={f.favicon} onChange={v=>set('favicon',v)} accept="image/png,image/x-icon,image/vnd.microsoft.icon" help="PNG or ICO · 32×32 / 48×48 recommended"/>
        <UploadField label="Hero image" value={f.heroImage} onChange={v=>set('heroImage',v)} help="Landscape image · WebP recommended · max 8 MB"/>
        <Field label="Description"><textarea className={inputClass} rows="4" value={f.description} onChange={e=>set('description',e.target.value)}/></Field>
      </div>

      <div className="grid gap-5 rounded-[2rem] bg-white p-6 ring-1 ring-black/5 md:grid-cols-2 md:p-8"><div className="md:col-span-2"><p className="text-xs font-bold uppercase tracking-[.2em] text-espresso/35">Contact & ordering</p></div>
        <Field label="Phone"><input className={inputClass} value={f.phone} onChange={e=>set('phone',e.target.value)}/></Field>
        <Field label="WhatsApp number (country code, no +)"><input className={inputClass} value={f.whatsapp} onChange={e=>set('whatsapp',e.target.value)} placeholder="919876543210"/></Field>
        <Field label="Address"><textarea className={inputClass} rows="3" value={f.address} onChange={e=>set('address',e.target.value)}/></Field>
      </div>

      <div className="grid gap-6 rounded-[2rem] bg-white p-6 ring-1 ring-black/5 md:p-8"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-espresso/35">Location</p><h2 className="mt-2 font-display text-3xl font-semibold">Put the cafe on the map</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-espresso/50">Enter exact latitude and longitude. The website will automatically create the Google Maps embed and directions link. An optional Google Maps embed URL can also be supplied.</p></div>
        <div className="grid gap-5 md:grid-cols-2"><Field label="Latitude"><input className={inputClass} inputMode="decimal" placeholder="e.g. 27.0238" value={f.latitude||''} onChange={e=>set('latitude',e.target.value)}/></Field><Field label="Longitude"><input className={inputClass} inputMode="decimal" placeholder="e.g. 74.2179" value={f.longitude||''} onChange={e=>set('longitude',e.target.value)}/></Field></div>
        <Field label="Google Maps embed URL (optional)"><input className={inputClass} value={f.mapUrl} onChange={e=>set('mapUrl',e.target.value)} placeholder="https://www.google.com/maps/embed?..."/><p className="mt-2 text-xs text-espresso/35">Leave this blank if you use latitude + longitude.</p></Field>
        <Field label="Directions URL (optional)"><input className={inputClass} value={f.directionsUrl} onChange={e=>set('directionsUrl',e.target.value)} placeholder="Leave blank to generate automatically"/></Field>
        <div className="overflow-hidden rounded-[1.5rem] border border-black/10 bg-cream/50">
          {embed?<iframe title="Admin cafe map preview" src={embed} className="h-[340px] w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade"/>:<div className="grid min-h-[340px] place-items-center p-8 text-center"><div><MapPin className="mx-auto text-gold" size={30}/><p className="mt-3 font-semibold">Map preview will appear here</p><p className="mt-1 max-w-md text-sm text-espresso/45">Add latitude and longitude, then save. You can get both values from Google Maps.</p></div></div>}
        </div>
        <div className="flex flex-wrap gap-3"><a className="inline-flex items-center gap-2 rounded-full bg-cream px-4 py-2.5 text-xs font-bold text-espresso" href={autoDirections} target="_blank" rel="noreferrer"><Navigation size={15}/> Test directions</a>{embed&&<a className="inline-flex items-center gap-2 rounded-full bg-cream px-4 py-2.5 text-xs font-bold text-espresso" href={embed.replace('&output=embed','')} target="_blank" rel="noreferrer"><ExternalLink size={15}/> Open map</a>}</div>
      </div>

      <div className="rounded-[2rem] bg-white p-6 ring-1 ring-black/5 md:p-8"><p className="text-xs font-bold uppercase tracking-[.2em] text-espresso/35">Opening hours</p><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{hours.map(d=><input key={d} className={inputClass} placeholder={`${d}: 9:00 AM – 10:00 PM`} value={f.openingHours?.[d]||''} onChange={e=>set('openingHours',{...f.openingHours,[d]:e.target.value})}/>)}</div></div>

      <div className="rounded-[2rem] bg-white p-6 ring-1 ring-black/5 md:p-8"><p className="text-xs font-bold uppercase tracking-[.2em] text-espresso/35">Social links</p><div className="mt-4 grid gap-3 md:grid-cols-3"><input className={inputClass} placeholder="Instagram URL" value={f.socialLinks?.instagram||''} onChange={e=>set('socialLinks',{...f.socialLinks,instagram:e.target.value})}/><input className={inputClass} placeholder="Facebook URL" value={f.socialLinks?.facebook||''} onChange={e=>set('socialLinks',{...f.socialLinks,facebook:e.target.value})}/><input className={inputClass} placeholder="Other social URL" value={f.socialLinks?.other||''} onChange={e=>set('socialLinks',{...f.socialLinks,other:e.target.value})}/></div></div>
      <div className="sticky bottom-4 z-20 flex items-center justify-between gap-4 rounded-2xl bg-espresso p-3 pl-5 text-white shadow-2xl"><span className="text-xs text-white/60">Changes affect the public website.</span><div className="flex items-center gap-3">{msg&&<span className="text-xs font-bold text-[#c8e6c9]">{msg}</span>}<SaveButton>Save changes</SaveButton></div></div>
    </form>
  </>;
}
