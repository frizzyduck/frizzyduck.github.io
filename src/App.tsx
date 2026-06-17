import { useState } from 'react';
import portfolioData from './data/portfolio.json';

// --- Types ---
type SectionType = 'hero' | 'text' | 'projects';

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
  subtitle: string;
  description: string;
  image?: string;
  email?: string;
  linkedin?: string;
}

interface TextData extends BaseSection {
  type: 'text';
  content: string;
}

interface ProjectItem {
  title: string;
  subtitle: string;
  description: string;
  image?: string;
  imagePosition: 'left' | 'right';
  tags: string[];
  assets?: { label: string; href: string }[];
}

interface ProjectsData extends BaseSection {
  type: 'projects';
  description: string;
  items: ProjectItem[];
}

type PortfolioSection = HeroData | TextData | ProjectsData;

interface PortfolioJSON {
  nav: NavItem[];
  sections: PortfolioSection[];
}

const data = portfolioData as PortfolioJSON;

// --- Helper Functions ---
// Simple parser to render **bold** and handle newlines as paragraphs.
function renderFormattedText(text: string) {
  const paragraphs = text.split('\n').filter((p) => p.trim() !== '');
  return paragraphs.map((para, i) => {
    const parts = para.split(/(\*\*.*?\*\*)/g);
    return (
      <p key={i} className="text-gray-700 leading-relaxed mb-4">
        {parts.map((part, j) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={j} className="font-bold text-gray-900">{part.slice(2, -2)}</strong>;
          }
          return part;
        })}
      </p>
    );
  });
}

// --- Components ---

function NavBar({ nav }: { nav: NavItem[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-50 shadow-sm">
      <div className="max-w-5xl mx-auto px-5 py-4 flex justify-between items-center">
        <a href="#home" className="font-bold text-xl tracking-tight text-gray-900">Portfolio.</a>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6 items-center">
          {nav.map((item, idx) => (
            <div key={idx} className="relative group">
              {item.dropdown ? (
                <div className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 py-2">
                  {item.label} ▾
                  <div className="absolute left-0 top-full mt-0 hidden w-48 bg-white border border-gray-100 shadow-lg rounded-md group-hover:block transition-all">
                    {item.dropdown.map((drop, dIdx) => (
                      <a key={dIdx} href={drop.href} className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600">
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

        {/* Mobile Nav Toggle */}
        <button className="md:hidden p-2 text-gray-700" onClick={() => setIsOpen(!isOpen)}>
          ☰
        </button>
      </div>

      {/* Mobile Nav Menu */}
      {isOpen && (
        <nav className="md:hidden bg-white border-t border-gray-100 px-6 py-4 flex flex-col gap-4">
          {nav.map((item, idx) => (
             <div key={idx}>
              {item.dropdown ? (
                <div className="flex flex-col gap-2">
                  <span className="font-medium text-gray-900">{item.label}</span>
                  <div className="pl-4 flex flex-col gap-2 border-l-2 border-gray-100 ml-2">
                    {item.dropdown.map((drop, dIdx) => (
                      <a key={dIdx} href={drop.href} onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-blue-600">
                        {drop.label}
                      </a>
                    ))}
                  </div>
                </div>
              ) : (
                <a href={item.href} onClick={() => setIsOpen(false)} className="font-medium text-gray-700 hover:text-blue-600">
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
    <section id={data.id} className="max-w-5xl mx-auto py-20 px-5 text-center md:text-left flex flex-col md:flex-row items-center gap-10 scroll-mt-20">
      {data.image && (
        <img
          src={data.image}
          alt={data.title}
          className="w-48 h-48 rounded-full object-cover shadow-lg border-4 border-white"
        />
      )}
      <div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">{data.title}</h1>
        <h2 className="text-xl text-blue-600 font-semibold mb-5">{data.subtitle}</h2>
        <p className="text-gray-700 text-lg leading-relaxed mb-8 max-w-2xl">{data.description}</p>
        
        <div className="flex justify-center md:justify-start gap-4">
          {data.email && (
            <a href={`mailto:${data.email}`} className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition shadow-sm font-medium">
              Email Me
            </a>
          )}
          {data.linkedin && (
            <a href={data.linkedin} target="_blank" rel="noreferrer" className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition shadow-sm font-medium">
              LinkedIn
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

function TextSection({ data }: { data: TextData }) {
  return (
    <section id={data.id} className="max-w-5xl mx-auto py-16 px-5 scroll-mt-20">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 border-b border-gray-200 pb-4">{data.title}</h2>
      <div className="max-w-4xl">
        {renderFormattedText(data.content)}
      </div>
    </section>
  );
}

function ProjectsSection({ data }: { data: ProjectsData }) {
  return (
    <section id={data.id} className="py-16 scroll-mt-20">
      <div className="max-w-5xl mx-auto px-5 mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-4">{data.title}</h2>
        <p className="text-lg text-gray-600">{data.description}</p>
      </div>

      <div className="max-w-6xl mx-auto px-5 flex flex-col gap-20">
        {data.items.map((item, idx) => {
          const isLeft = item.imagePosition === 'left';
          return (
            <div key={idx} className={`grid gap-8 md:gap-12 items-center ${isLeft ? 'md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]' : 'md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]'}`}>
              {/* Image */}
              {item.image && (
                <div className={isLeft ? 'md:order-1' : 'md:order-2'}>
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full object-cover border border-gray-200 shadow-sm"
                  />
                </div>
              )}
              
              {/* Content */}
              <div className={isLeft ? 'md:order-2' : 'md:order-1'}>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <h4 className="text-md text-blue-600 font-semibold mb-4">{item.subtitle}</h4>
                {renderFormattedText(item.description)}

                {item.assets && item.assets.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium">
                    {item.assets.map((asset, assetIdx) => (
                      <a key={assetIdx} href={asset.href} target="_blank" rel="noreferrer" className="text-gray-900 underline decoration-gray-300 underline-offset-4 hover:text-blue-600 hover:decoration-blue-600">
                        {asset.label}
                      </a>
                    ))}
                  </div>
                )}
                
                {/* Tags */}
                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-6">
                    {item.tags.map((tag, tIdx) => (
                     <span key={tIdx} className="text-blue-700 text-sm font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// --- Main App ---

function App() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 pb-20">
      <NavBar nav={data.nav} />

      <main>
        {data.sections.map((section, index) => {
          if (section.type === 'hero') {
            return (
              <div key={index} className="bg-blue-50/30 border-b border-gray-200">
                <HeroSection data={section as HeroData} />
              </div>
            );
          } else if (section.type === 'text') {
            return (
              <div key={index}>
                <TextSection data={section as TextData} />
              </div>
            );
          } else if (section.type === 'projects') {
            return (
              <div key={index} className="bg-white border-y border-gray-100">
                <ProjectsSection data={section as ProjectsData} />
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
