import { useEffect, useState, useRef } from 'react';
import type { ReactNode } from 'react';

export function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
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
