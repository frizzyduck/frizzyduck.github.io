import { useState } from 'react';
import type { NavItem, ThemeName } from '../types';

const themes: { label: string; value: ThemeName }[] = [
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
  { label: 'Catppuccin', value: 'catppuccin' },
];

interface NavBarProps {
  nav: NavItem[];
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
}

export function NavBar({ nav, theme, setTheme }: NavBarProps) {
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
