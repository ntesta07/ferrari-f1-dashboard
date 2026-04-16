/**
 * TeamIntro.jsx — Chapter 01
 *
 * Direct port of zkatz-website About.jsx:
 * - Ghost "01" chapter number in top-right corner (opacity 0.03)
 * - Red separator line + section heading
 * - Two-column: parallax image left, text right
 * - fadeInUp on all text content
 */

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const TEAM_IMG =
  'https://images.unsplash.com/photo-1541773367336-d3a8738ca6f0?auto=format&fit=crop&w=1000&q=80';

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.6 },
};

export function TeamIntro() {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Parallax — photo shifts ±50px as section scrolls (same as zkatz)
  const imageY = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <section
      id="team"
      ref={sectionRef}
      className="relative min-h-screen px-6 py-24 md:px-12 lg:px-24 md:py-32 bg-primary-black"
    >
      {/* Ghost chapter number */}
      <motion.span
        className="pointer-events-none absolute right-8 top-8 select-none font-display leading-none text-off-white/[0.03] md:right-16"
        style={{ fontSize: 'clamp(6rem, 14vw, 12rem)' }}
        initial={{ opacity: 0, x: 80 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        01
      </motion.span>

      {/* Red line */}
      <motion.div className="mb-12 h-px w-16 bg-racing-red" {...fadeInUp} />

      <motion.h2
        className="font-display uppercase text-off-white mb-16 leading-[0.9]"
        style={{ fontSize: 'clamp(2.6rem, 5vw, 4.5rem)', letterSpacing: '0.02em' }}
        {...fadeInUp}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        The Team
      </motion.h2>

      <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-20 items-center">

        {/* Parallax image — same as zkatz portrait */}
        <motion.div
          className="relative aspect-[3/4] overflow-hidden"
          style={{ y: imageY }}
        >
          <img
            src={TEAM_IMG}
            alt="Ferrari team at the circuit"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ filter: 'brightness(0.8) saturate(0.9)' }}
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
          {/* Red gradient overlay — matches zkatz's white/dark gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-racing-red/10 via-transparent to-off-white/5" />
          {/* Bottom caption */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary-black/60 to-transparent p-6">
            <p className="font-body text-xs uppercase tracking-[0.3em] text-off-white/40">Maranello, Italy</p>
          </div>
        </motion.div>

        {/* Text content */}
        <motion.div
          {...fadeInUp}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-6"
        >
          <p className="font-body text-lg leading-relaxed text-off-white/80">
            Ferrari is not presented here as a spreadsheet. It is presented as
            pressure, velocity, and accumulation — a historic red silhouette
            translated into standings movement and race-by-race momentum.
          </p>
          <p className="font-body leading-relaxed text-off-white/55">
            This dashboard frames the Scuderia as both legacy brand and active
            machine. Every performance module below is normalized from live
            external race data and filtered to Ferrari only — standings, driver
            execution, and the story of each race in numbers.
          </p>

          {/* Stats strip */}
          <div className="mt-10 grid grid-cols-3 border-t border-off-white/[0.08] pt-8 gap-4">
            {[['1950', 'Founded'], ['16', "Constructors' Titles"], ['240+', 'Race Wins']].map(([val, label]) => (
              <div key={label}>
                <p
                  className="font-display text-off-white leading-none"
                  style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', letterSpacing: '0.02em' }}
                >
                  {val}
                </p>
                <p className="mt-2 font-body text-[0.62rem] uppercase tracking-[0.24em] text-off-white/30">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
