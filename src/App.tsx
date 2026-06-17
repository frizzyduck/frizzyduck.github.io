import { useState } from 'react';
import portfolioData from './data/portfolio.json';

type SectionType = 'hero' | 'page';
type ContentBlockType = 'text' | 'imageText';
type ImagePosition = 'left' | 'right';

interface NavItem {
  label: string;
  href?: string;
  dropdown?: { label: string; href: string }[];
}

interface BaseSection {
  id: string;
  type: SectionType;
  title: string;
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

interface ContentBlock {
  type: ContentBlockType;
  title?: string;
  subtitle?: string;
  content: string;
  image?: string;
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

function renderFormattedText(text: string, className = 'text-gray-700 leading-relaxed mb-4') {
  const paragraphs = text.split('\n').filter((p) => p.trim() !== '');

  return paragraphs.map((para, i) => {
    const parts = para.split(/(\*\*.*?\*\*)/g);

    return (
      <p key={i} className={className}>
        {parts.map((part, j) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <strong key={j} className="font-bold text-gray-900">
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

function NavBar({ nav }: { nav: NavItem[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-50 shadow-sm">
      <div className="max-w-5xl mx-auto px-5 py-4 flex justify-between items-center">
        <a href="#home" className="font-bold text-xl tracking-tight text-gray-900">
          Portfolio.
        </a>

        <nav className="hidden md:flex gap-6 items-center">
          {nav.map((item, idx) => (
            <div key={idx} className="relative group">
              {item.dropdown ? (
                <div className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 py-2">
                  {item.label} v
                  <div className="absolute left-0 top-full mt-0 hidden w-48 bg-white border border-gray-100 shadow-lg rounded-md group-hover:block transition-all">
                    {item.dropdown.map((drop, dIdx) => (
                      <a
                        key={dIdx}
                        href={drop.href}
                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                      >
                        {drop.label}
                      </a>
                    ))}
                  </div>
                </div>
              ) : (
                <a href={item.href} className="font-medium text-gray-700 hover:text-blue-600 py-2">
                  {item.label}
                </a>
              )}
            </div>
          ))}
        </nav>

        <button className="md:hidden p-2 text-gray-700" onClick={() => setIsOpen(!isOpen)}>
          Menu
        </button>
      </div>

      {isOpen && (
        <nav className="md:hidden bg-white border-t border-gray-100 px-6 py-4 flex flex-col gap-4">
          {nav.map((item, idx) => (
            <div key={idx}>
              {item.dropdown ? (
                <div className="flex flex-col gap-2">
                  <span className="font-medium text-gray-900">{item.label}</span>
                  <div className="pl-4 flex flex-col gap-2 border-l-2 border-gray-100 ml-2">
                    {item.dropdown.map((drop, dIdx) => (
                      <a
                        key={dIdx}
                        href={drop.href}
                        onClick={() => setIsOpen(false)}
                        className="text-gray-600 hover:text-blue-600"
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
                  className="font-medium text-gray-700 hover:text-blue-600"
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
      className="max-w-5xl mx-auto py-20 px-5 text-center md:text-left flex flex-col md:flex-row items-center gap-10 scroll-mt-20"
    >
      {data.image && (
        <img
          src={data.image}
          alt={data.title}
          className="w-48 h-48 rounded-full object-cover shadow-lg border-4 border-white"
        />
      )}
      <div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">{data.title}</h1>
        {data.subtitle && <h2 className="text-xl text-blue-600 font-semibold mb-5">{data.subtitle}</h2>}
        {data.description && <p className="text-gray-700 text-lg leading-relaxed mb-8 max-w-2xl">{data.description}</p>}

        <div className="flex justify-center md:justify-start gap-4">
          {data.email && (
            <a
              href={`mailto:${data.email}`}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition shadow-sm font-medium"
            >
              Email Me
            </a>
          )}
          {data.linkedin && (
            <a
              href={data.linkedin}
              target="_blank"
              rel="noreferrer"
              className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition shadow-sm font-medium"
            >
              LinkedIn
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

function ContentBlock({ block, compact = false }: { block: ContentBlock; compact?: boolean }) {
  const isImageLeft = block.imagePosition === 'left';
  const hasImageLayout = block.type === 'imageText' && block.image;
  const textContent = (
    <div>
      {block.title && <h3 className="text-2xl font-bold text-gray-900 mb-2">{block.title}</h3>}
      {block.subtitle && <h4 className="text-md text-blue-600 font-semibold mb-4">{block.subtitle}</h4>}
      {renderFormattedText(block.content)}

      {block.assets && block.assets.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium">
          {block.assets.map((asset, assetIdx) => (
            <a
              key={assetIdx}
              href={asset.href}
              target="_blank"
              rel="noreferrer"
              className="text-gray-900 underline decoration-gray-300 underline-offset-4 hover:text-blue-600 hover:decoration-blue-600"
            >
              {asset.label}
            </a>
          ))}
        </div>
      )}

      {block.tags && block.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-6">
          {block.tags.map((tag, tagIdx) => (
            <span key={tagIdx} className="text-blue-700 text-sm font-medium">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );

  if (!hasImageLayout) {
    return <div className={compact ? '' : 'max-w-4xl'}>{textContent}</div>;
  }

  return (
    <div
      className={`grid gap-8 md:gap-12 items-center ${
        isImageLeft
          ? 'md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]'
          : 'md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]'
      }`}
    >
      <div className={isImageLeft ? 'md:order-1' : 'md:order-2'}>
        <img
          src={block.image}
          alt={block.imageAlt || block.title || ''}
          className="w-full object-cover border border-gray-200 shadow-sm"
        />
      </div>
      <div className={isImageLeft ? 'md:order-2' : 'md:order-1'}>{textContent}</div>
    </div>
  );
}

function PageSection({ data }: { data: PageData }) {
  return (
    <section id={data.id} className="py-16 scroll-mt-20">
      <div className="max-w-5xl mx-auto px-5 mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-4">{data.title}</h2>
        {data.description && <p className="text-lg text-gray-600">{data.description}</p>}
      </div>

      {data.blocks && data.blocks.length > 0 && (
        <div className="max-w-5xl mx-auto px-5 flex flex-col gap-12 mb-16">
          {data.blocks.map((block, idx) => (
            <ContentBlock key={idx} block={block} />
          ))}
        </div>
      )}

      {data.items && data.items.length > 0 && (
        <div className="max-w-6xl mx-auto px-5 flex flex-col gap-20">
          {data.items.map((item, idx) => (
            <ContentBlock key={idx} block={item} compact />
          ))}
        </div>
      )}
    </section>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 pb-20">
      <NavBar nav={data.nav} />

      <main>
        {data.sections.map((section, index) => {
          if (section.type === 'hero') {
            return (
              <div key={index} className="bg-blue-50/30 border-b border-gray-200">
                <HeroSection data={section} />
              </div>
            );
          }

          if (section.type === 'page') {
            return (
              <div key={index} className="bg-white border-y border-gray-100">
                <PageSection data={section} />
              </div>
            );
          }

          return null;
        })}
      </main>
    </div>
  );
}

export default App;
