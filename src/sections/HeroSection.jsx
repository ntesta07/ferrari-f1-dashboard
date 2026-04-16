/**
 * HeroSection.jsx — Chapter 00
 *
 * Full-viewport hero with parallax background image, staggered
 * headline reveal, and a bottom marquee strip — all using the
 * fadeInUp / parallax patterns from zkatz-website.
 */

import { motion, useScroll, useTransform } from 'framer-motion';

const FERRARI_IMG =
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1800&q=80';

export function HeroSection() {
  const { scrollY } = useScroll();
  // Parallax: image drifts down as we scroll (same pattern as zkatz About)
  const imgY   = useTransform(scrollY, [0, 700], [0, 140]);
  const textY  = useTransform(scrollY, [0, 600], [0, 60]);
  const fade   = useTransform(scrollY, [0, 480], [1, 0]);

  return (
    <section id="hero" className="relative min-h-screen overflow-hidden bg-primary-black">

      {/* Parallax background */}
      <motion.div style={{ y: imgY }} className="absolute inset-0 z-0">
        <img
          src={FERRARI_IMG}
          alt="Ferrari F1 at speed"
          className="h-full w-full object-cover object-center"
          style={{ filter: 'brightness(0.3) saturate(1.1)' }}
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
        {/* Fallback gradient if image fails */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a0000] via-primary-black to-primary-black" />
      </motion.div>

      {/* Vignette overlays */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-primary-black via-transparent to-transparent" />
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-primary-black via-primary-black/30 to-transparent" />

      {/* Red accent bar at very top */}
      <div className="absolute top-0 left-0 right-0 h-[2px] z-20 bg-racing-red" />

      {/* Content */}
      <motion.div
        style={{ y: textY, opacity: fade }}
        className="relative z-20 flex min-h-screen flex-col justify-end px-6 pb-20 pt-32 md:px-12 lg:px-24"
      >
        {/* Season badge — zkatz uses red line + small label */}
        <motion.div
          className="mb-8 flex items-center gap-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 2.6 }}
        >
          <div className="h-px w-10 bg-racing-red" />
          <span className="font-body text-xs uppercase tracking-[0.36em] text-off-white/50">
            2025 Formula 1 Season · Live Data
          </span>
        </motion.div>

        {/* Headline — each line clips out from below */}
        <div className="overflow-hidden">
          <motion.h1
            className="font-display uppercase leading-[0.85] text-off-white"
            style={{ fontSize: 'clamp(5rem, 13vw, 13rem)', letterSpacing: '0.01em' }}
            initial={{ y: '105%' }}
            animate={{ y: '0%' }}
            transition={{ duration: 0.9, delay: 2.7, ease: [0.22, 1, 0.36, 1] }}
          >
            Scuderia
          </motion.h1>
        </div>
        <div className="overflow-hidden">
          <motion.h1
            className="font-display uppercase leading-[0.85] text-racing-red"
            style={{ fontSize: 'clamp(5rem, 13vw, 13rem)', letterSpacing: '0.01em' }}
            initial={{ y: '105%' }}
            animate={{ y: '0%' }}
            transition={{ duration: 0.9, delay: 2.82, ease: [0.22, 1, 0.36, 1] }}
          >
            Ferrari
          </motion.h1>
        </div>

        {/* Subline + CTA */}
        <motion.div
          className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 3.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-body max-w-md text-base leading-7 text-off-white/50">
            A live performance dashboard — constructor standings, race results,
            and driver analytics updated in real time from the Scuderia.
          </p>
          <div className="flex shrink-0 gap-3">
            <a href="#performance" className="btn btn-primary">Explore stats</a>
            <a href="#results"     className="btn btn-ghost">Race archive</a>
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom marquee strip */}
      <div className="absolute bottom-0 left-0 right-0 z-20 overflow-hidden border-t border-off-white/[0.07] bg-primary-black/80 py-3 backdrop-blur-sm">
        <div className="flex w-max animate-[marquee_24s_linear_infinite]">
          {[0, 1].map((i) => (
            <div key={i} className="flex shrink-0 items-center gap-10 pr-10 font-body text-[0.6rem] uppercase tracking-[0.3em] text-off-white/25">
              {['Scuderia Ferrari', '·', 'Constructor Championship', '·', 'Maranello', '·', 'Formula 1', '·', 'Live Race Data', '·', 'Season 2025', '·'].map((word, j) => (
                <span key={j} className={word === '·' ? 'text-racing-red' : ''}>{word}</span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
