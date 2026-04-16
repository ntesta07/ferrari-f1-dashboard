/**
 * Footer.jsx
 * Matches zkatz-website footer aesthetic: minimal, dark, clean links.
 * Contact section style: centered headline + link buttons with border-hover-red
 */

import { motion } from 'framer-motion';

const LINKS = [
  { label: 'Team',     href: '#team' },
  { label: 'Stats',    href: '#performance' },
  { label: 'Drivers',  href: '#drivers' },
  { label: 'Results',  href: '#results' },
  { label: 'Chart',    href: '#chart' },
  { label: 'Insights', href: '#insights' },
  { label: 'Gallery',  href: '#gallery' },
];

export function Footer() {
  return (
    <footer className="border-t border-off-white/[0.07] bg-primary-black px-6 py-16 md:px-12 lg:px-24">
      <div className="mx-auto max-w-7xl">

        {/* Top: brand + nav */}
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <svg width="18" height="22" viewBox="0 0 22 28" fill="none">
                <path d="M0 0h22v18L11 28 0 18V0z" fill="#ff2800" />
                <path d="M4 7h3V4h2v3h4V4h2v3h3v2h-3v4h-2V9H9v4H7V9H4V7z" fill="#f4eee4" />
              </svg>
              <span className="font-display text-2xl uppercase tracking-[0.18em] text-off-white">
                Scuderia Ferrari
              </span>
            </div>
            <p className="font-body text-[0.68rem] uppercase tracking-[0.28em] text-off-white/25">
              Ferrari, translated into data.
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-8 gap-y-3">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="font-body text-sm uppercase tracking-wide text-off-white/35 transition-colors hover:text-racing-red"
              >
                {l.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex items-center justify-between border-t border-off-white/[0.07] pt-6 text-[0.62rem] uppercase tracking-[0.2em] text-off-white/18">
          <span>Hack4Impact BU · 2025</span>
          <a href="#hero" className="transition-colors hover:text-off-white/45">↑ Back to top</a>
        </div>
      </div>
    </footer>
  );
}
