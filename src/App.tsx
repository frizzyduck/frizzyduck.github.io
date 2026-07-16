import { useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import portfolioData from './data/portfolio.json';

type SectionType = 'hero' | 'page';
type ContentBlockType = 'text' | 'imageText';
type ImagePosition = 'left' | 'right';
type ThemeName = 'light' | 'dark' | 'catppuccin';
type SectionBackground = 'plain' | 'fade';

interface NavItem {
  label: string;
  href?: string;
  dropdown?: { label: string; href: string }[];
}

interface BaseSection {
  id: string;
  type: SectionType;
  title: string;
  background?: SectionBackground;
}

interface HeroData extends BaseSection {
  type: 'hero';
  subtitle?: string;
  description?: string;
  image?: string;
  email?: string;
  linkedin?: string;
}

interface AssetLink {
  label: string;
  href: string;
}

interface ContentImage {
  src: string;
  alt?: string;
}

interface ContentBlock {
  type: ContentBlockType;
  title?: string;
  subtitle?: string;
  content: string;
  image?: string;
  images?: (string | ContentImage)[];
  imageAlt?: string;
  imagePosition?: ImagePosition;
  tags?: string[];
  assets?: AssetLink[];
}

interface PageData extends BaseSection {
  type: 'page';
  description?: string;
  blocks?: ContentBlock[];
  items?: ContentBlock[];
}

type PortfolioSection = HeroData | PageData;

interface PortfolioJSON {
  nav: NavItem[];
  sections: PortfolioSection[];
}

const data = portfolioData as PortfolioJSON;
const themes: { label: string; value: ThemeName }[] = [
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
  { label: 'Catppuccin', value: 'catppuccin' },
];

function getSectionClass(section: PortfolioSection) {
  const background = section.background ?? (section.type === 'hero' ? 'fade' : 'plain');
  return background === 'fade' ? 'section-fade' : 'section-plain';
}

function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { rootMargin: '-8% 0px -12% 0px', threshold: 0.18 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`scroll-reveal ${isVisible ? 'is-visible' : ''} ${className}`}>
      {children}
    </div>
  );
}

function renderFormattedText(text: string, className = 'body-copy mb-4') {
  const paragraphs = text.split('\n').filter((p) => p.trim() !== '');

  return paragraphs.map((para, i) => {
    const parts = para.split(/(\*\*.*?\*\*)/g);

    return (
      <p key={i} className={className}>
        {parts.map((part, j) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <strong key={j} className="font-semibold text-[var(--text-strong)]">
                {part.slice(2, -2)}
              </strong>
            );
          }

          return part;
        })}
      </p>
    );
  });
}

function getBlockImages(block: ContentBlock): ContentImage[] {
  const images = block.images?.map((image) => (typeof image === 'string' ? { src: image } : image)) ?? [];

  if (images.length > 0) {
    return images.slice(0, 4).filter((image) => image.src);
  }

  return block.image ? [{ src: block.image, alt: block.imageAlt }] : [];
}

function NavBar({
  nav,
  theme,
  setTheme,
}: {
  nav: NavItem[];
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="site-header sticky top-0 z-50 border-b backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <a href="#home" className="group flex items-center gap-3 font-semibold tracking-tight text-[var(--text-strong)]">
          <span className="brand-mark grid h-9 w-9 place-items-center rounded-md text-sm font-bold transition">M</span>
          <span className="hidden sm:block">Miles Portfolio</span>
        </a>

        <nav className="hidden items-center gap-6 md:flex">
          {nav.map((item, idx) => (
            <div key={idx} className="group relative">
              {item.dropdown ? (
                <div className="cursor-pointer py-2 text-sm font-medium text-[var(--text-muted)] transition hover:text-[var(--text-strong)]">
                  {item.label}
                  <span className="ml-1 text-xs text-[var(--text-muted)]">v</span>
                  <div className="menu-popover absolute left-0 top-full hidden w-52 rounded-md border p-2 shadow-xl transition-all group-hover:block">
                    {item.dropdown.map((drop, dIdx) => (
                      <a
                        key={dIdx}
                        href={drop.href}
                        className="block rounded px-3 py-2 text-sm text-[var(--text-muted)] transition hover:bg-[var(--surface-hover)] hover:text-[var(--text-strong)]"
                      >
                        {drop.label}
                      </a>
                    ))}
                  </div>
                </div>
              ) : (
                <a href={item.href} className="py-2 text-sm font-medium text-[var(--text-muted)] transition hover:text-[var(--text-strong)]">
                  {item.label}
                </a>
              )}
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="theme-switcher hidden rounded-md border p-1 sm:flex">
            {themes.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setTheme(item.value)}
                className={`rounded px-3 py-1.5 text-xs font-semibold transition ${theme === item.value ? 'is-active' : ''}`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <button
            className="rounded-md border border-[var(--border)] px-3 py-2 text-sm font-medium text-[var(--text)] md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-label="Toggle navigation"
          >
            Menu
          </button>
        </div>
      </div>

      {isOpen && (
        <nav className="mobile-nav flex flex-col gap-4 border-t px-6 py-4 md:hidden">
          <div className="theme-switcher flex w-fit rounded-md border p-1">
            {themes.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setTheme(item.value)}
                className={`rounded px-3 py-1.5 text-xs font-semibold transition ${theme === item.value ? 'is-active' : ''}`}
              >
                {item.label}
              </button>
            ))}
          </div>
          {nav.map((item, idx) => (
            <div key={idx}>
              {item.dropdown ? (
                <div className="flex flex-col gap-2">
                  <span className="font-medium text-[var(--text-strong)]">{item.label}</span>
                  <div className="ml-2 flex flex-col gap-2 border-l-2 border-[var(--border)] pl-4">
                    {item.dropdown.map((drop, dIdx) => (
                      <a
                        key={dIdx}
                        href={drop.href}
                        onClick={() => setIsOpen(false)}
                        className="text-[var(--text-muted)] hover:text-[var(--accent)]"
                      >
                        {drop.label}
                      </a>
                    ))}
                  </div>
                </div>
              ) : (
                <a
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="font-medium text-[var(--text)] hover:text-[var(--accent)]"
                >
                  {item.label}
                </a>
              )}
            </div>
          ))}
        </nav>
      )}
    </header>
  );
}

function HeroSection({ data }: { data: HeroData }) {
  return (
    <section
      id={data.id}
      className="mx-auto grid min-h-[calc(100svh-65px)] max-w-6xl scroll-mt-20 items-center gap-12 px-5 py-14 md:grid-cols-[minmax(0,1fr)_340px]"
    >
      <Reveal className="text-center md:text-left">
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

function ImagePreview({
  image,
  onClose,
}: {
  image: { src: string; alt: string } | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!image) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [image, onClose]);

  if (!image) return null;

  return (
    <div className="image-modal fixed inset-0 z-[80] grid place-items-center px-4 py-8" role="dialog" aria-modal="true">
      <button type="button" className="image-modal-backdrop absolute inset-0" onClick={onClose} aria-label="Close image preview" />
      <div className="image-modal-panel relative z-10 w-full max-w-5xl rounded-md border p-3 shadow-2xl">
        <button type="button" className="image-modal-close absolute right-3 top-3 rounded-md border px-3 py-1.5 text-sm font-semibold" onClick={onClose}>
          Close
        </button>
        <img src={image.src} alt={image.alt} className="max-h-[82vh] w-full rounded object-contain" />
      </div>
    </div>
  );
}

function ContentBlock({
  block,
  compact = false,
  onPreviewImage,
}: {
  block: ContentBlock;
  compact?: boolean;
  onPreviewImage: (image: { src: string; alt: string }) => void;
}) {
  const isImageLeft = block.imagePosition === 'left';
  const blockImages = getBlockImages(block);
  const hasImageLayout = block.type === 'imageText' && blockImages.length > 0;
  const imageGridClass =
    blockImages.length === 1
      ? 'grid-cols-1'
      : blockImages.length === 2
        ? 'grid-cols-2'
        : 'grid-cols-2 grid-rows-2';
  const textContent = (
    <div>
      {block.subtitle && <p className="mb-3 text-sm font-semibold uppercase tracking-normal text-[var(--accent)]">{block.subtitle}</p>}
      {block.title && <h3 className="heading-font mb-4 text-2xl font-bold text-[var(--text-strong)] md:text-3xl">{block.title}</h3>}
      {renderFormattedText(block.content)}

      {block.assets && block.assets.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
          {block.assets.map((asset, assetIdx) => (
            <a key={assetIdx} href={asset.href} target="_blank" rel="noreferrer" className="asset-link transition">
              {asset.label}
            </a>
          ))}
        </div>
      )}

      {block.tags && block.tags.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {block.tags.map((tag, tagIdx) => (
            <span key={tagIdx} className="tag-pill rounded-full px-3 py-1 text-sm font-medium">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );

  if (!hasImageLayout) {
    return <Reveal className={compact ? '' : 'max-w-4xl'}>{textContent}</Reveal>;
  }

  return (
    <Reveal>
      <div
        className={`grid items-center gap-8 md:gap-12 ${
          isImageLeft
            ? 'md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]'
            : 'md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]'
        }`}
      >
        <div className={isImageLeft ? 'md:order-1' : 'md:order-2'}>
          <div className={`media-frame image-preview-grid grid aspect-[5/3] ${imageGridClass} overflow-hidden rounded-md border shadow-xl`}>
            {blockImages.map((image, imageIdx) => {
              const imageAlt = image.alt || block.imageAlt || block.title || `Portfolio image ${imageIdx + 1}`;

              return (
                <button
                  key={`${image.src}-${imageIdx}`}
                  type="button"
                  className="image-preview-trigger overflow-hidden"
                  onClick={() => onPreviewImage({ src: image.src, alt: imageAlt })}
                  aria-label={`Open larger preview of ${imageAlt}`}
                >
                  <img
                    src={image.src}
                    alt={imageAlt}
                    className="h-full w-full object-cover"
                  />
                </button>
              );
            })}
          </div>
        </div>
        <div className={isImageLeft ? 'md:order-2' : 'md:order-1'}>{textContent}</div>
      </div>
    </Reveal>
  );
}

function PageSection({
  data,
  onPreviewImage,
}: {
  data: PageData;
  onPreviewImage: (image: { src: string; alt: string }) => void;
}) {
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

function App() {
  const [theme, setTheme] = useState<ThemeName>('dark');
  const [previewImage, setPreviewImage] = useState<{ src: string; alt: string } | null>(null);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return (
    <div data-theme={theme} className="app-shell min-h-screen pb-20 font-sans">
      <NavBar nav={data.nav} theme={theme} setTheme={setTheme} />

      <main>
        {data.sections.map((section, index) => {
          if (section.type === 'hero') {
            return (
              <div key={index} className={`${getSectionClass(section)} border-b border-[var(--border)]`}>
                <HeroSection data={section} />
              </div>
            );
          }

          if (section.type === 'page') {
            return (
              <div key={index} className={getSectionClass(section)}>
                <PageSection data={section} onPreviewImage={setPreviewImage} />
              </div>
            );
          }

          return null;
        })}
      </main>
      <ImagePreview image={previewImage} onClose={() => setPreviewImage(null)} />
    </div>
  );
}

export default App;
