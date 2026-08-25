import { useEffect, useState } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { useCafe } from '../context/CafeContext';

const links=[['Best Sellers','best-sellers'],['Menu','menu'],['About','about'],['Location','location']];
export default function Navbar(){
  const {data}=useCafe(); const [scrolled,setScrolled]=useState(false); const [open,setOpen]=useState(false);
  useEffect(()=>{const f=()=>setScrolled(window.scrollY>40); window.addEventListener('scroll',f,{passive:true}); return()=>window.removeEventListener('scroll',f)},[]);
  const go=id=>{document.getElementById(id)?.scrollIntoView({behavior:'smooth'});setOpen(false)};
  const order=`https://wa.me/${String(data.settings.whatsapp||'').replace(/\D/g,'')}`;
  return <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled||open?'px-3 pt-3 md:px-5':'px-0 pt-0'}`}>
    <div className={`mx-auto max-w-7xl transition-all duration-500 ${scrolled||open?'rounded-full border border-black/5 bg-cream/90 shadow-[0_12px_50px_rgba(43,33,27,.10)] backdrop-blur-xl':'bg-transparent'}`}>
      <div className={`flex items-center justify-between px-5 transition-all duration-500 md:px-7 ${scrolled?'h-16':'h-20'}`}>
        <button onClick={()=>go('home')} className="group flex items-center gap-3 text-left">
          <div className="grid h-10 w-10 place-items-center overflow-hidden rounded-full bg-espresso shadow-lg ring-1 ring-white/20 transition group-hover:rotate-[-5deg]">
            {data.settings.logo?<img src={data.settings.logo} alt="" className="h-full w-full object-contain"/>:<span className="font-display text-2xl text-cream">C</span>}
          </div>
          <span className="font-display text-[1.65rem] font-semibold tracking-[-.02em] text-espresso">{data.settings.cafeName||'Creme Cafe'}</span>
        </button>
        <nav className="hidden items-center gap-8 lg:flex">
          {links.map(([label,id])=><button key={id} onClick={()=>go(id)} className="relative text-[12px] font-bold uppercase tracking-[.14em] text-espresso/55 transition hover:text-espresso after:absolute after:-bottom-2 after:left-0 after:h-px after:w-0 after:bg-gold after:transition-all hover:after:w-full">{label}</button>)}
          <a href={order} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-2 rounded-full bg-espresso px-5 py-3 text-[12px] font-bold uppercase tracking-[.12em] text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-coffee">Order Now <ArrowUpRight size={15} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"/></a>
        </nav>
        <button aria-label="Toggle menu" className="grid h-10 w-10 place-items-center rounded-full bg-espresso text-white lg:hidden" onClick={()=>setOpen(!open)}>{open?<X size={20}/>:<Menu size={20}/>}</button>
      </div>
      {open&&<nav className="border-t border-black/5 px-5 pb-5 pt-2 lg:hidden">{links.map(([label,id])=><button key={id} onClick={()=>go(id)} className="block w-full border-b border-black/5 py-4 text-left text-sm font-bold">{label}</button>)}<a href={order} target="_blank" rel="noreferrer" className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-espresso px-5 py-3 text-sm font-bold text-white">Order Now <ArrowUpRight size={16}/></a></nav>}
    </div>
  </header>
}
