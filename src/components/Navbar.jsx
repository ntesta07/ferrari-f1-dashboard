/**
 * Navbar.jsx — Fixed top navigation
 *
 * Ported from zkatz-website Navbar.jsx pattern:
 * - Transparent over hero, gains bg-primary-black/90 + backdrop-blur on scroll
 * - Slides down from above on mount (delayed to sync with LoadingScreen exit)
 * - Ferrari shield logo left, nav links right
 */

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const SCROLL_THRESHOLD = 80;
const ENTRANCE_DELAY   = 2.4; // syncs with LoadingScreen exit

const NAV_LINKS = [
  { label: 'Team',     href: '#team' },
  { label: 'Stats',    href: '#performance' },
  { label: 'Drivers',  href: '#drivers' },
  { label: 'Results',  href: '#results' },
  { label: 'Chart',    href: '#chart' },
  { label: 'Insights', href: '#insights' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-40 px-6 md:px-12 py-4 flex items-center justify-between transition-colors duration-300 ${
        scrolled ? 'bg-primary-black/92 backdrop-blur-sm' : 'bg-transparent'
      }`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: ENTRANCE_DELAY }}
    >
      {/* Logo */}
      <a href="#hero" className="flex items-center gap-3 group">
        <img src="/logo.png" alt="Ferrari" className="h-8 w-auto" style={{ imageRendering: 'high-quality' }} />
        <span className="font-display text-2xl uppercase tracking-[0.18em] text-off-white group-hover:text-racing-red transition-colors">
          Scuderia Ferrari
        </span>
      </a>

      {/* Links */}
      <div className="hidden md:flex gap-8">
        {NAV_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="font-body text-sm text-off-white/60 hover:text-racing-red transition-colors tracking-wide uppercase"
          >
            {link.label}
          </a>
        ))}
      </div>
    </motion.nav>
  );
}
