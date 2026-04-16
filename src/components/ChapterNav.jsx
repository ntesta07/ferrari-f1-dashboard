/**
 * ChapterNav.jsx — Fixed right-side vertical chapter indicator
 *
 * Ported from zkatz-website ChapterNav.jsx:
 * - IntersectionObserver watches each section (30% threshold)
 * - Active chapter number turns racing-red and shifts right
 * - Decorative vertical line connects all markers
 * - Hidden on mobile, visible md+
 */

import { useEffect, useState } from 'react';

const CHAPTERS = [
  { id: 'hero',        number: '00', label: 'Home' },
  { id: 'team',        number: '01', label: 'Team' },
  { id: 'performance', number: '02', label: 'Stats' },
  { id: 'drivers',     number: '03', label: 'Drivers' },
  { id: 'results',     number: '04', label: 'Results' },
  { id: 'chart',       number: '05', label: 'Chart' },
  { id: 'insights',    number: '06', label: 'Insights' },
  { id: 'gallery',     number: '07', label: 'Gallery' },
];

export function ChapterNav() {
  const [active, setActive] = useState('hero');

  useEffect(() => {
    const observers = [];

    CHAPTERS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id);
        },
        { threshold: 0.3 }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <nav className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-0 md:flex">
      {/* Vertical connector line */}
      <div className="absolute right-[5px] top-0 bottom-0 w-px bg-off-white/[0.08]" />

      {CHAPTERS.map(({ id, number, label }) => {
        const isActive = active === id;
        return (
          <a
            key={id}
            href={`#${id}`}
            className="group relative flex items-center gap-3 py-2 pr-4"
            aria-label={label}
          >
            {/* Label — appears on hover */}
            <span
              className={`font-body text-[0.6rem] uppercase tracking-[0.22em] transition-all duration-200 ${
                isActive
                  ? 'text-racing-red opacity-100 translate-x-0'
                  : 'text-off-white/0 group-hover:text-off-white/50 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0'
              }`}
            >
              {label}
            </span>

            {/* Dot */}
            <span
              className={`relative z-10 block h-[6px] w-[6px] rounded-full transition-all duration-200 ${
                isActive
                  ? 'bg-racing-red scale-125'
                  : 'bg-off-white/25 group-hover:bg-off-white/50'
              }`}
            />
          </a>
        );
      })}
    </nav>
  );
}
