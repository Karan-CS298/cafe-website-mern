import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { useCafe } from '../context/CafeContext';

export default function Hero(){
  const {data}=useCafe(); const r=useReducedMotion(); const s=data.settings;
  const {scrollY}=useScroll(); const imageY=useTransform(scrollY,[0,700],[0,90]);
  const order=`https://wa.me/${String(s.whatsapp||'').replace(/\D/g,'')}`;
  return <section id="home" className="relative flex min-h-[92vh] items-end overflow-hidden bg-espresso pt-24 md:min-h-screen">
    <motion.img style={r?{}:{y:imageY}} src={s.heroImage||'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=2200&q=88'} alt={`${s.cafeName||'Cafe'} interior`} className="absolute inset-0 h-[calc(100%+100px)] w-full object-cover" initial={r?false:{scale:1.08}} animate={r?{}:{scale:1}} transition={{duration:1.5,ease:[.16,1,.3,1]}}/>
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,.16),transparent_30%),linear-gradient(180deg,rgba(27,19,14,.22)_0%,rgba(43,33,27,.32)_35%,rgba(28,20,15,.94)_100%)]"/>
    <div className="absolute inset-0 opacity-[.10] noise"/>
    <div className="relative mx-auto w-full max-w-7xl px-5 pb-10 md:px-8 md:pb-16">
      <div className="grid items-end gap-12 lg:grid-cols-[1fr_auto]">
        <motion.div initial={r?false:{opacity:0,y:40}} animate={r?{}:{opacity:1,y:0}} transition={{duration:.9,delay:.15,ease:[.22,1,.36,1]}} className="max-w-5xl text-white">
          <div className="mb-6 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[.38em] text-white/60"><span className="h-px w-10 bg-gold"/>{s.cafeName||'Creme Cafe'}<span className="h-px w-10 bg-gold"/></div>
          <h1 className="font-display text-[4.5rem] font-semibold leading-[.78] tracking-[-.045em] md:text-[8rem] lg:text-[9.5rem]">Coffee <em className="font-normal text-cream/90">worth</em><br/><span className="ml-[7vw]">staying for.</span></h1>
          <p className="mt-8 max-w-xl text-sm leading-7 text-white/65 md:text-base">{s.description||'Specialty coffee, fresh plates and warm corners made for slow mornings, good conversations and everything in between.'}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button onClick={()=>document.getElementById('menu')?.scrollIntoView({behavior:'smooth'})} className="group inline-flex items-center gap-3 rounded-full bg-cream px-6 py-3.5 text-sm font-bold text-espresso transition hover:-translate-y-1 hover:shadow-2xl">Explore Menu <ArrowUpRight size={17} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"/></button>
            <a href={order} target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-bold text-white backdrop-blur transition hover:-translate-y-1 hover:bg-white/15">Order on WhatsApp</a>
          </div>
        </motion.div>
        <motion.div initial={r?false:{opacity:0,x:25}} animate={r?{}:{opacity:1,x:0}} transition={{duration:.8,delay:.5}} className="hidden w-44 pb-3 text-right lg:block">
          <p className="text-[10px] font-bold uppercase tracking-[.25em] text-white/40">Open today</p>
          <p className="mt-2 text-sm leading-6 text-white/70">Fresh coffee.<br/>Slow moments.</p>
          <button aria-label="Scroll to best sellers" onClick={()=>document.getElementById('best-sellers')?.scrollIntoView({behavior:'smooth'})} className="ml-auto mt-8 grid h-12 w-12 place-items-center rounded-full border border-white/20 text-white transition hover:bg-white hover:text-espresso"><ArrowDown size={17}/></button>
        </motion.div>
      </div>
    </div>
  </section>
}
