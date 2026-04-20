/**
 * TeamIntro.jsx — Chapter 01
 * Driver showcase: Hamilton slides in from the left, Leclerc from the right.
 */

import { useState } from 'react';
import { motion } from 'framer-motion';

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
};

const DRIVERS = [
  {
    id: 'hamilton',
    number: '44',
    name: 'Lewis Hamilton',
    nationality: 'British',
    from: 'left',
    img: '/hamilton.avif',
    imgPosition: 'center 12%',
    url: 'https://www.lewishamilton.com/',
    accent: '#e8e8e8',
    bio: 'Seven-time World Champion and the most decorated driver in Formula 1 history. Hamilton arrives at Scuderia Ferrari for 2026 with 103 race wins, a relentless hunger, and one goal — a record eighth title in red.',
    stats: [
      { value: '7',   label: 'World Titles' },
      { value: '103', label: 'Race Wins' },
      { value: '104', label: 'Pole Positions' },
    ],
  },
  {
    id: 'leclerc',
    number: '16',
    name: 'Charles Leclerc',
    nationality: 'Monégasque',
    from: 'right',
    img: '/leclerc.jpg',
    imgPosition: 'center 8%',
    url: 'https://charlesleclerc.com/en/',
    accent: '#ff2800',
    bio: "The Prince of Monaco and Ferrari's standard-bearer. Leclerc has driven the Scuderia's resurgence with blistering qualifying laps and fierce race craft — a born Ferrari driver chasing the title that has eluded him.",
    stats: [
      { value: '8',  label: 'Race Wins' },
      { value: '24', label: 'Pole Positions' },
      { value: '39', label: 'Podiums' },
    ],
  },
];

function DriverCard({ driver, index }) {
  const [imgOk, setImgOk] = useState(Boolean(driver.img));

  const slideX = driver.from === 'left' ? -120 : 120;

  return (
    <motion.div
      initial={{ opacity: 0, x: slideX, y: 30 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.85, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col"
    >
      {/* ── Large hero photo (clicks through to driver's site) ── */}
      <a href={driver.url} target="_blank" rel="noopener noreferrer" className="block relative overflow-hidden" style={{ aspectRatio: '3/4' }}>

        {/* Ghost number watermark */}
        <span
          className="pointer-events-none absolute inset-0 flex items-center justify-center select-none font-display leading-none"
          style={{ fontSize: 'clamp(8rem, 18vw, 16rem)', color: driver.accent, opacity: 0.06, letterSpacing: '-0.04em' }}
        >
          {driver.number}
        </span>

        {/* Gradient base */}
        <div className="absolute inset-0"
             style={{ background: `linear-gradient(160deg, #1a1824 0%, #110f1a 60%, ${driver.accent}15 100%)` }} />

        {/* Hero photo */}
        {imgOk && (
          <img
            src={driver.img}
            alt={driver.name}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            style={{
              objectPosition: driver.imgPosition || 'center top',
              filter: driver.id === 'hamilton'
                ? 'brightness(0.97) saturate(1.1) contrast(1.05)'
                : 'brightness(0.92) saturate(1.15) contrast(1.04)',
              imageRendering: 'high-quality',
            }}
            onError={() => setImgOk(false)}
          />
        )}

        {/* Bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-primary-black via-primary-black/40 to-transparent" />

        {/* "Visit site" hint on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
          <span className="font-body text-[0.6rem] uppercase tracking-[0.3em] text-off-white/70 border border-off-white/20 px-4 py-2 backdrop-blur-sm bg-primary-black/40">
            Visit Site ↗
          </span>
        </div>

        {/* Sweep accent line */}
        <motion.div
          className="absolute bottom-0 left-0 h-[3px]"
          style={{ background: driver.accent }}
          initial={{ width: '0%' }}
          whileInView={{ width: '100%' }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: index * 0.15 + 0.5, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Number badge */}
        <div className="absolute top-4 left-4 flex items-baseline gap-1">
          <span className="font-body text-[0.55rem] uppercase tracking-[0.28em]"
                style={{ color: driver.accent, opacity: 0.7 }}>No.</span>
          <span className="font-display leading-none text-off-white"
                style={{ fontSize: '2.2rem', letterSpacing: '0.01em' }}>{driver.number}</span>
        </div>

        {/* Nationality badge */}
        <div className="absolute top-4 right-4">
          <span className="font-body text-[0.55rem] uppercase tracking-[0.26em] text-off-white/40">
            {driver.nationality}
          </span>
        </div>
      </a>

      {/* ── Text ─────────────────────────────────────────────── */}
      <div className="mt-6 space-y-4">

        {/* Name */}
        <div>
          <motion.h3
            className="font-display uppercase leading-[0.9] text-off-white"
            style={{ fontSize: 'clamp(2.4rem, 4vw, 3.6rem)', letterSpacing: '0.02em' }}
            {...fadeInUp}
            transition={{ duration: 0.6, delay: index * 0.15 + 0.25 }}
          >
            {driver.name}
          </motion.h3>
          <motion.div
            className="mt-2 h-px w-10"
            style={{ background: driver.accent }}
            initial={{ scaleX: 0, originX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.15 + 0.4 }}
          />
        </div>

        {/* Bio */}
        <motion.p
          className="font-body text-sm leading-7 text-off-white/55"
          {...fadeInUp}
          transition={{ duration: 0.6, delay: index * 0.15 + 0.35 }}
        >
          {driver.bio}
        </motion.p>

        {/* Stats row */}
        <motion.div
          className="grid grid-cols-3 border-t border-off-white/[0.07] pt-5 mt-6"
          {...fadeInUp}
          transition={{ duration: 0.6, delay: index * 0.15 + 0.45 }}
        >
          {driver.stats.map(({ value, label }) => (
            <div key={label} className="space-y-1">
              <p
                className="font-display leading-none text-off-white"
                style={{
                  fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)',
                  letterSpacing: '0.02em',
                  color: driver.accent === '#ff2800' ? driver.accent : undefined,
                }}
              >
                {value}
              </p>
              <p className="font-body text-[0.58rem] uppercase tracking-[0.22em] text-off-white/30">
                {label}
              </p>
            </div>
          ))}
        </motion.div>

      </div>
    </motion.div>
  );
}

export function TeamIntro() {
  return (
    <section
      id="team"
      className="relative bg-primary-black px-6 py-24 md:px-12 lg:px-24 md:py-32 overflow-hidden"
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

      {/* Section label */}
      <motion.div className="mb-4 h-px w-16 bg-racing-red" {...fadeInUp} />
      <motion.h2
        className="font-display uppercase text-off-white mb-16 leading-[0.9]"
        style={{ fontSize: 'clamp(2.6rem, 5vw, 4.5rem)', letterSpacing: '0.02em' }}
        {...fadeInUp}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        The Drivers
      </motion.h2>

      {/* Two-column driver cards */}
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16 lg:gap-24 max-w-6xl">
        {DRIVERS.map((driver, i) => (
          <DriverCard key={driver.id} driver={driver} index={i} />
        ))}
      </div>
    </section>
  );
}
