/**
 * HeroSection.jsx — Chapter 00
 *
 * Full-viewport hero with parallax background image, staggered
 * headline reveal, and a bottom marquee strip — all using the
 * fadeInUp / parallax patterns from zkatz-website.
 *
 * PLACEHOLDER: Replace /hero.jpg in the /public folder with your
 * Ferrari photo to swap out the placeholder background.
 */

import { motion, useScroll, useTransform } from 'framer-motion';
import { Camera } from 'lucide-react';
import { useState } from 'react';

// ─── Hero background image ────────────────────────────────────────────
// Source file lives at /public/hero.jpg
const HERO_IMAGE = '/hero.avif';

export function HeroSection() {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError]   = useState(!HERO_IMAGE);

  const { scrollY } = useScroll();
  // Parallax: image drifts down as we scroll (same pattern as zkatz About)
  const imgY   = useTransform(scrollY, [0, 700], [0, 140]);
  const textY  = useTransform(scrollY, [0, 600], [0, 60]);
  const fade   = useTransform(scrollY, [0, 480], [1, 0]);

  return (
    <section id="hero" className="relative min-h-screen overflow-hidden bg-primary-black">

      {/* Parallax background */}
      <motion.div style={{ y: imgY }} className="absolute inset-0 z-0">

        {/* ── Placeholder (shown when no image is set or image fails) ── */}
        {imgError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4"
               style={{ background: 'linear-gradient(135deg, #15121e 0%, #110f1a 50%, #131520 100%)' }}>
            {/* subtle grid overlay */}
            <div className="absolute inset-0 opacity-[0.04]"
                 style={{
                   backgroundImage: 'linear-gradient(#ff2800 1px, transparent 1px), linear-gradient(90deg, #ff2800 1px, transparent 1px)',
                   backgroundSize: '60px 60px',
                 }} />
            {/* placeholder label */}
            <div className="relative z-10 flex flex-col items-center gap-3 rounded border border-dashed border-off-white/20 px-10 py-8 text-center">
              <Camera size={32} className="text-racing-red/60" strokeWidth={1.5} />
              <p className="font-body text-xs uppercase tracking-[0.3em] text-off-white/30">
                Hero Image Placeholder
              </p>
              <p className="font-body text-[0.65rem] text-off-white/18 max-w-[18rem]">
                Drop <code className="text-racing-red/60">hero.jpg</code> into <code className="text-racing-red/60">/public</code> and set{' '}
                <code className="text-racing-red/60">HERO_IMAGE = '/hero.jpg'</code>
              </p>
            </div>
          </div>
        )}

        {/* ── Actual photo (hidden until loaded, fades in) ── */}
        {HERO_IMAGE && (
          <img
            src={HERO_IMAGE}
            alt="Ferrari SF-25 studio render"
            className="h-full w-full transition-opacity duration-1000"
            style={{
              objectFit: 'cover',
              // Keep the car's body in frame — slightly right-of-center, upper half
              objectPosition: '60% 40%',
              // The studio shot is already dark; just a touch of dimming so
              // text stays readable, saturate to pop the red livery
              filter: 'brightness(0.55) saturate(1.3)',
              opacity: imgLoaded ? 1 : 0,
            }}
            onLoad={() => { setImgLoaded(true); setImgError(false); }}
            onError={() => setImgError(true)}
          />
        )}

        {/* Gradient: left-side shadow so headline text is always readable */}
        <div className="absolute inset-0"
             style={{
               background: 'linear-gradient(105deg, rgba(16,14,24,0.90) 0%, rgba(16,14,24,0.48) 45%, rgba(16,14,24,0.08) 100%)',
             }} />
        {/* Bottom fade into page background */}
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-primary-black to-transparent" />
      </motion.div>

      {/* Top vignette so the red accent bar blends cleanly */}
      <div className="absolute inset-x-0 top-0 h-32 z-10 bg-gradient-to-b from-primary-black/60 to-transparent" />

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
            2026 Formula 1 Season · Live Data
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
              {['Scuderia Ferrari', '·', 'Constructor Championship', '·', 'Maranello', '·', 'Formula 1', '·', 'Live Race Data', '·', '2026 Season', '·'].map((word, j) => (
                <span key={j} className={word === '·' ? 'text-racing-red' : ''}>{word}</span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
