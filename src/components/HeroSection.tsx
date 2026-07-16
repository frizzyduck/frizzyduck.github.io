import { Reveal } from './features/Reveal';
import type { HeroData } from '../types';

interface HeroSectionProps {
  data: HeroData;
  isStandalone?: boolean;
}

export function HeroSection({ data, isStandalone = false }: HeroSectionProps) {
  return (
    <section
      id={data.id}
      className="mx-auto grid min-h-[calc(100svh-65px)] max-w-6xl scroll-mt-20 items-center gap-12 px-5 py-14 md:grid-cols-[minmax(0,1fr)_340px]"
    >
      <Reveal className="text-center md:text-left">
        {isStandalone && (
          <div className="mb-6 flex justify-center md:justify-start">
            <a
              href="#home"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-[var(--text-muted)] transition hover:text-[var(--accent)]"
            >
              <span className="transition-transform group-hover:-translate-x-1">&larr;</span> Back to Main Page
            </a>
          </div>
        )}
        {data.subtitle && <p className="eyebrow mb-4 inline-flex rounded-full border px-3 py-1 text-sm font-semibold">{data.subtitle}</p>}
        <h1 className="heading-font mb-5 max-w-4xl text-5xl font-black leading-[0.96] tracking-normal text-[var(--text-strong)] md:text-7xl">
          {data.title.replace('Hi, ', '')}
        </h1>
        {data.description && <p className="mx-auto mb-8 max-w-2xl text-lg leading-8 text-[var(--text-muted)] md:mx-0">{data.description}</p>}

        <div className="flex flex-wrap justify-center gap-3 md:justify-start">
          {data.email && (
            <a href={`mailto:${data.email}`} className="primary-action rounded-md px-5 py-3 font-semibold shadow-sm transition">
              Email
            </a>
          )}
          {data.linkedin && (
            <a href={data.linkedin} target="_blank" rel="noreferrer" className="secondary-action rounded-md border px-5 py-3 font-semibold transition">
              LinkedIn
            </a>
          )}
        </div>
      </Reveal>

      {data.image && (
        <Reveal className="mx-auto w-full max-w-[300px] md:max-w-none">
          <div className="profile-frame aspect-[4/5] overflow-hidden rounded-md shadow-2xl ring-1">
            <img src={data.image} alt={data.title} className="h-full w-full object-cover" />
          </div>
        </Reveal>
      )}
    </section>
  );
}
