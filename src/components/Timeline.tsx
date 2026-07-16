import { Reveal } from './features/Reveal';
import type { TimelineItem } from '../types';

export function Timeline({ items }: { items: TimelineItem[] }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="relative mx-auto max-w-4xl px-5 py-10">
      {/* Central Line */}
      <div className="absolute left-8 top-0 h-full w-0.5 bg-[var(--border)] md:left-1/2 md:-translate-x-1/2" />

      <div className="flex flex-col gap-12">
        {items.map((item, idx) => {
          const isEven = idx % 2 === 0;

          return (
            <Reveal key={idx} className="relative flex flex-col md:flex-row md:items-center">
              {/* Timeline dot */}
              <div className="absolute left-8 top-1.5 z-10 h-4.5 w-4.5 -translate-x-[9px] rounded-full border-4 border-[var(--bg)] bg-gradient-to-tr from-[var(--accent)] to-[var(--accent-strong)] transition-transform hover:scale-130 md:left-1/2 md:top-1/2 md:-translate-y-1/2 md:-translate-x-1/2" />

              {/* Left Column: holds Card for even items, holds Date for odd items */}
              <div className={`ml-16 md:ml-0 md:w-1/2 md:pr-12 ${isEven ? 'text-left md:text-right' : 'hidden md:block md:text-right'}`}>
                {isEven ? (
                  // Card Component (Even Index: Left Side)
                  <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6 shadow-md transition-all hover:border-[var(--accent)] hover:shadow-lg">
                    {/* Mobile Only Header */}
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold uppercase tracking-wider md:hidden mb-3">
                      <span className="text-[var(--accent-strong)]">{item.date}</span>
                      {item.startDate && (
                        <>
                          <span className="text-[var(--border)]">•</span>
                          <span className="text-[var(--text-muted)]">{item.startDate}</span>
                        </>
                      )}
                    </div>

                    {/* Desktop Week Label */}
                    <span className="hidden md:inline-block text-xs font-semibold uppercase tracking-wider text-[var(--accent-strong)] mb-2">{item.date}</span>
                    
                    <h3 className="text-xl font-bold text-[var(--text-strong)]">{item.title}</h3>
                    {item.subtitle && <p className="text-sm text-[var(--text-muted)] mt-1">{item.subtitle}</p>}
                    <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">{item.description}</p>
                    {item.tags && item.tags.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2 md:justify-end justify-start">
                        {item.tags.map((t, i) => (
                          <span key={i} className="rounded-full bg-[var(--surface-hover)] px-2.5 py-0.5 text-xs text-[var(--text-muted)]">{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  // Date Component (Odd Index: Left Side of Timeline, pointing to Card on Right Side)
                  <div className="py-2">
                    <span className="block text-xl font-bold tracking-tight text-[var(--text-strong)]">{item.startDate}</span>
                  </div>
                )}
              </div>

              {/* Right Column: holds Date for even items, holds Card for odd items */}
              <div className={`ml-16 md:ml-0 md:w-1/2 md:pl-12 ${!isEven ? 'text-left' : 'hidden md:block'}`}>
                {!isEven ? (
                  // Card Component (Odd Index: Right Side)
                  <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6 shadow-md transition-all hover:border-[var(--accent)] hover:shadow-lg">
                    {/* Mobile Only Header */}
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold uppercase tracking-wider md:hidden mb-3">
                      <span className="text-[var(--accent-strong)]">{item.date}</span>
                      {item.startDate && (
                        <>
                          <span className="text-[var(--border)]">•</span>
                          <span className="text-[var(--text-muted)]">{item.startDate}</span>
                        </>
                      )}
                    </div>

                    {/* Desktop Week Label */}
                    <span className="hidden md:inline-block text-xs font-semibold uppercase tracking-wider text-[var(--accent-strong)] mb-2">{item.date}</span>

                    <h3 className="text-xl font-bold text-[var(--text-strong)]">{item.title}</h3>
                    {item.subtitle && <p className="text-sm text-[var(--text-muted)] mt-1">{item.subtitle}</p>}
                    <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">{item.description}</p>
                    {item.tags && item.tags.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2 justify-start">
                        {item.tags.map((t, i) => (
                          <span key={i} className="rounded-full bg-[var(--surface-hover)] px-2.5 py-0.5 text-xs text-[var(--text-muted)]">{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  // Date Component (Even Index: Right Side of Timeline, pointing to Card on Left Side)
                  <div className="py-2">
                    <span className="block text-xl font-bold tracking-tight text-[var(--text-strong)]">{item.startDate}</span>
                  </div>
                )}
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
