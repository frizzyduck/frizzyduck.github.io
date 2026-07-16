import { useEffect, useState } from 'react';
import portfolioData from './data/portfolio.json';
import { NavBar } from './components/NavBar';
import { HeroSection } from './components/HeroSection';
import { PageSection } from './components/PageSection';
import { ImagePreview } from './components/features/ImagePreview';
import type { PortfolioJSON, ThemeName, PortfolioSection } from './types';

const data = portfolioData as PortfolioJSON;

function getSectionClass(section: PortfolioSection) {
  const background = section.background ?? (section.type === 'hero' ? 'fade' : 'plain');
  return background === 'fade' ? 'section-fade' : 'section-plain';
}

function App() {
  const [theme, setTheme] = useState<ThemeName>('dark');
  const [previewImage, setPreviewImage] = useState<{ src: string; alt: string } | null>(null);
  const [currentHash, setCurrentHash] = useState(window.location.hash);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const activeSectionId = currentHash.startsWith('#') ? currentHash.slice(1) : currentHash;
  const activeSection = data.sections.find((s) => s.id === activeSectionId);
  const isStandaloneActive = activeSection?.renderMode === 'new-page';

  useEffect(() => {
    if (!currentHash || currentHash === '#home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const targetId = currentHash.startsWith('#') ? currentHash.slice(1) : currentHash;
    if (!targetId) return;

    // Find the section to see if it's standalone or main page
    const section = data.sections.find((s) => s.id === targetId);
    const isStandalone = section?.renderMode === 'new-page';

    if (isStandalone) {
      window.scrollTo({ top: 0, behavior: 'auto' });
    } else {
      const timer = setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [currentHash]);

  const sectionsToRender = isStandaloneActive
    ? (activeSection ? [activeSection] : [])
    : data.sections.filter((s) => s.renderMode !== 'new-page');

  return (
    <div data-theme={theme} className="app-shell min-h-screen pb-20 font-sans">
      <NavBar nav={data.nav} theme={theme} setTheme={setTheme} />

      <main>
        {sectionsToRender.map((section, index) => {
          if (section.type === 'hero') {
            return (
              <div key={index} className={`${getSectionClass(section)} border-b border-[var(--border)]`}>
                <HeroSection data={section} isStandalone={isStandaloneActive} />
              </div>
            );
          }

          if (section.type === 'page') {
            return (
              <div key={index} className={getSectionClass(section)}>
                <PageSection data={section} onPreviewImage={setPreviewImage} isStandalone={isStandaloneActive} />
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
