import { useMemo, useState } from 'react';
import { ContentBlock } from './ContentBlock';
import type { PageData } from '../types';

interface PageSectionProps {
  data: PageData;
  onPreviewImage: (image: { src: string; alt: string }) => void;
  isStandalone?: boolean;
}

export function PageSection({ data, onPreviewImage, isStandalone = false }: PageSectionProps) {
  const tags = useMemo(() => {
    const tagSet = new Set<string>();
    data.items?.forEach((item) => item.tags?.forEach((tag) => tagSet.add(tag)));
    return Array.from(tagSet);
  }, [data.items]);
  const [activeTag, setActiveTag] = useState('All');
  const visibleItems =
    activeTag === 'All' ? data.items : data.items?.filter((item) => item.tags?.includes(activeTag));

  return (
    <section id={data.id} className="scroll-mt-20 py-18">
      <div className="mx-auto mb-12 max-w-6xl px-5">
        {isStandalone && (
          <div className="mb-6">
            <a
              href="#home"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-[var(--text-muted)] transition hover:text-[var(--accent)]"
            >
              <span className="transition-transform group-hover:-translate-x-1">&larr;</span> Back to Main Page
            </a>
          </div>
        )}
        <div className="grid gap-5 border-t border-[var(--border)] pt-8 md:grid-cols-[260px_1fr]">
          <h2 className="heading-font text-3xl font-black tracking-normal text-[var(--text-strong)]">{data.title}</h2>
          {data.description && <p className="max-w-3xl text-lg leading-8 text-[var(--text-muted)]">{data.description}</p>}
        </div>
      </div>

      {data.blocks && data.blocks.length > 0 && (
        <div className="mx-auto mb-16 flex max-w-6xl flex-col gap-12 px-5">
          {data.blocks.map((block, idx) => (
            <ContentBlock key={idx} block={block} onPreviewImage={onPreviewImage} />
          ))}
        </div>
      )}

      {data.items && data.items.length > 0 && tags.length > 0 && (
        <div className="mx-auto mb-12 flex max-w-6xl flex-wrap gap-2 px-5">
          {['All', ...tags].map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setActiveTag(tag)}
              className={`filter-chip rounded-full border px-4 py-2 text-sm font-semibold transition ${activeTag === tag ? 'is-active' : ''}`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {visibleItems && visibleItems.length > 0 && (
        <div className="mx-auto flex max-w-6xl flex-col gap-20 px-5">
          {visibleItems.map((item, idx) => (
            <ContentBlock key={idx} block={item} compact onPreviewImage={onPreviewImage} />
          ))}
        </div>
      )}
    </section>
  );
}
