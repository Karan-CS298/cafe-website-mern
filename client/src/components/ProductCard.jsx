import { MessageCircle, ArrowUpRight } from 'lucide-react';
import Reveal from './Reveal';
import { productOrderUrl } from '../utils/whatsapp';

export default function ProductCard({ product, settings, delay = 0 }) {
  return <Reveal delay={delay}><article className="group overflow-hidden rounded-[2rem] bg-white ring-1 ring-black/[.06] shadow-[0_12px_50px_rgba(43,33,27,.06)] transition duration-500 hover:-translate-y-2 hover:shadow-[0_24px_70px_rgba(43,33,27,.13)]">
    <div className="relative aspect-[4/3] overflow-hidden bg-cream">
      <img loading="lazy" src={product.image||'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1000&q=85'} alt={product.name} className="h-full w-full object-cover transition duration-[1100ms] ease-out group-hover:scale-110"/>
      <div className="absolute inset-0 bg-gradient-to-t from-espresso/35 via-transparent to-transparent opacity-60"/>
      {product.isBestSeller&&<span className="absolute left-4 top-4 rounded-full border border-white/50 bg-white/85 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.2em] text-espresso backdrop-blur-xl">Best seller</span>}
      {product.isFeatured&&<span className="absolute right-4 top-4 rounded-full bg-gold px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.2em] text-espresso">Featured</span>}
    </div>
    <div className="p-6 md:p-7">
      <div className="mb-3 flex items-start justify-between gap-5"><h3 className="font-display text-[2rem] font-semibold leading-none tracking-[-.02em] text-espresso">{product.name}</h3><span className="shrink-0 rounded-full bg-cream px-3 py-1.5 text-sm font-bold">₹{product.price}</span></div>
      <p className="min-h-[48px] text-sm leading-6 text-espresso/55">{product.description||'Prepared fresh, served with care.'}</p>
      <a className="group/order mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.16em] text-coffee transition hover:text-gold" href={productOrderUrl(settings,product)} target="_blank" rel="noreferrer"><MessageCircle size={15}/> Order on WhatsApp <ArrowUpRight size={14} className="transition group-hover/order:translate-x-0.5 group-hover/order:-translate-y-0.5"/></a>
    </div>
  </article></Reveal>
}
