import { useCafe } from "../context/CafeContext";
import { ArrowUpRight } from "lucide-react";
import Reveal from "../components/Reveal";
import SectionHeading from "../components/SectionHeading";

export default function About() {
  const { data } = useCafe();
  const a = data.about || {};
  return (
    <section id="about" className="bg-cream px-5 py-28 md:px-8 md:py-36">
      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.1fr_.9fr] lg:gap-20">
        <Reveal className="relative">
          <div className="absolute -left-4 top-10 hidden h-28 w-28 rounded-full border border-gold/30 lg:block" />
          <div className="grid grid-cols-2 gap-4">
            <div className="mt-16 h-[470px] overflow-hidden rounded-[2.5rem] shadow-2xl">
              <img
                loading="lazy"
                src={
                  a.images?.[0] ||
                  "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1000&q=85"
                }
                alt="Cafe atmosphere"
                className="h-full w-full object-cover transition duration-1000 hover:scale-105"
              />
            </div>
            <div className="h-[470px] overflow-hidden rounded-[2.5rem] shadow-2xl">
              <img
                loading="lazy"
                src={
                  a.images?.[1] ||
                  "https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=1000&q=85"
                }
                alt="Freshly brewed coffee"
                className="h-full w-full object-cover transition duration-1000 hover:scale-105"
              />
            </div>
          </div>
        </Reveal>
        <div>
          <SectionHeading
            eyebrow={a.tagline || "Our story"}
            title={a.heading || "A little slower. A lot better."}
            description={
              a.description ||
              "A warm neighbourhood cafe built around carefully brewed coffee, fresh plates and comfortable corners."
            }
          />
          <Reveal delay={0.12}>
            <div className="mt-9 flex items-center gap-4 border-t border-espresso/10 pt-7">
              <div className="grid h-11 w-11 place-items-center rounded-full bg-espresso text-cream font-display text-xl">
                C
              </div>
              <div>
                <p className="text-sm font-bold">Made for lingering.</p>
                <p className="text-xs text-espresso/45">
                  Coffee, conversations & quiet corners.
                </p>
              </div>
              <ArrowUpRight className="ml-auto text-gold" size={20} />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
