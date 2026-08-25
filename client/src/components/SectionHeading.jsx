import Reveal from './Reveal';

export default function SectionHeading({ eyebrow, title, description, center = false, light = false }) {
  return <Reveal className={center ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
    <div className={`mb-4 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[.34em] ${center ? 'justify-center' : ''} ${light ? 'text-gold' : 'text-gold'}`}>
      <span className="h-px w-8 bg-current opacity-60" />
      <span>{eyebrow}</span>
      <span className="h-px w-8 bg-current opacity-60" />
    </div>
    <h2 className={`font-display text-[3.1rem] font-semibold leading-[.9] tracking-[-.035em] md:text-[4.8rem] ${light ? 'text-white' : 'text-espresso'}`}>{title}</h2>
    {description && <p className={`mt-6 max-w-2xl text-sm leading-7 md:text-base ${center ? 'mx-auto' : ''} ${light ? 'text-white/60' : 'text-espresso/55'}`}>{description}</p>}
  </Reveal>;
}
