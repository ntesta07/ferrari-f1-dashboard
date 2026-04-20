/**
 * OverviewStats.jsx — Chapter 02  "By the Numbers"
 */

import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { ErrorState }    from '../components/ErrorState';
import { LoadingSkeleton } from '../components/LoadingSkeleton';

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
};

// ── Animated counter (reused locally so we can pass extra options) ────
function Counter({ value, duration = 2000, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [count, setCount] = useState(0);

  const str    = String(value ?? '');
  const match  = str.match(/^([^0-9]*)(\d+(?:\.\d+)?)([^0-9]*)$/);
  const isNum  = !!match;
  const target = isNum ? parseFloat(match[2]) : 0;
  const prefix = isNum ? match[1] : '';
  const suffix = isNum ? match[3] : '';

  useEffect(() => {
    if (!inView || !isNum) return;
    const timer = setTimeout(() => {
      const start = performance.now();
      let raf;
      const step = (now) => {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        setCount(Math.round(eased * target));
        if (t < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
      return () => cancelAnimationFrame(raf);
    }, delay);
    return () => clearTimeout(timer);
  }, [inView, isNum, target, duration, delay]);

  return <span ref={ref}>{isNum ? `${prefix}${count}${suffix}` : value}</span>;
}

// ── Hero stat — the constructor standing, displayed huge ─────────────
function HeroStat({ standing, points, leadingDriver }) {
  return (
    <motion.div
      className="relative mb-16 border border-off-white/[0.07] bg-surface overflow-hidden"
      {...fadeInUp}
      transition={{ duration: 0.7, delay: 0.15 }}
    >
      {/* Red accent line top */}
      <motion.div
        className="absolute top-0 left-0 h-[2px] bg-racing-red"
        initial={{ width: 0 }}
        whileInView={{ width: '100%' }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
      />

      <div className="grid md:grid-cols-[1fr_auto] items-center gap-8 px-8 py-10 md:py-12">
        {/* Left: big standing */}
        <div className="flex items-baseline gap-6">
          <div>
            <p className="font-body text-[0.6rem] uppercase tracking-[0.32em] text-off-white/30 mb-3">
              Constructor Standing
            </p>
            <div className="flex items-start gap-3 leading-none">
              <span className="font-body text-lg text-racing-red/60 mt-2">P</span>
              <span
                className="font-display text-racing-red"
                style={{ fontSize: 'clamp(5rem, 12vw, 9rem)', letterSpacing: '-0.02em', lineHeight: 1 }}
              >
                <Counter value={standing} duration={1600} />
              </span>
            </div>
          </div>
          <div className="hidden sm:block h-20 w-px bg-off-white/[0.08]" />
          <div className="hidden sm:block">
            <p className="font-body text-[0.6rem] uppercase tracking-[0.3em] text-off-white/30 mb-2">Points</p>
            <p className="font-display text-off-white" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '0.02em' }}>
              <Counter value={points} duration={2000} delay={200} />
            </p>
          </div>
        </div>

        {/* Right: leading driver callout */}
        <div className="border-l border-off-white/[0.07] pl-8 hidden md:block">
          <p className="font-body text-[0.58rem] uppercase tracking-[0.3em] text-off-white/25 mb-2">
            Points Leader
          </p>
          <p className="font-display uppercase text-off-white leading-none" style={{ fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)', letterSpacing: '0.04em' }}>
            {leadingDriver || 'TBD'}
          </p>
          <div className="mt-3 flex items-center gap-2">
            <span className="h-px w-8 bg-racing-red" />
            <span className="font-body text-[0.55rem] uppercase tracking-[0.28em] text-racing-red/60">
              Scuderia Ferrari
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Individual stat tile ──────────────────────────────────────────────
function StatTile({ label, value, detail, index, accent = false }) {
  return (
    <motion.div
      className="group relative border border-off-white/[0.07] bg-surface p-6 overflow-hidden transition-colors hover:border-racing-red/30"
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
    >
      {/* Hover glow corner */}
      <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-racing-red/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />

      <p className="font-body text-[0.58rem] uppercase tracking-[0.28em] text-off-white/28 mb-4">
        {label}
      </p>

      <p
        className={`font-display leading-none ${accent ? 'text-racing-red' : 'text-off-white'}`}
        style={{ fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)', letterSpacing: '0.02em' }}
      >
        <Counter value={value} duration={1800} delay={index * 80} />
      </p>

      {detail && (
        <p className="mt-3 font-body text-[0.75rem] leading-5 text-off-white/28 max-w-[22ch]">
          {detail}
        </p>
      )}

      {/* Bottom sweep line */}
      <motion.div
        className="absolute bottom-0 left-0 h-[1px] bg-racing-red"
        initial={{ width: 0 }}
        whileInView={{ width: '35%' }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: index * 0.08 + 0.4 }}
      />
    </motion.div>
  );
}

export function OverviewStats({ overviewState }) {
  const { data, loading, error } = overviewState;

  const tiles = data
    ? [
        { label: 'Race Wins',      value: data.wins,           detail: 'Race victories this season',          accent: true  },
        { label: 'Podiums',        value: data.podiums,        detail: 'Combined podium finishes',            accent: false },
        { label: 'Rounds Scored',  value: data.racesProcessed, detail: 'Races with processed results',        accent: false },
      ]
    : [];

  return (
    <section
      id="performance"
      className="relative px-6 py-24 md:px-12 lg:px-24 md:py-32 bg-primary-black"
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
        02
      </motion.span>

      {/* Section label */}
      <motion.div className="mb-4 h-px w-16 bg-racing-red" {...fadeInUp} />
      <motion.p
        className="mb-3 font-body text-xs uppercase tracking-[0.32em] text-off-white/35"
        {...fadeInUp}
        transition={{ duration: 0.6, delay: 0.05 }}
      >
        Season overview
      </motion.p>
      <motion.h2
        className="font-display uppercase text-off-white mb-12 leading-[0.9]"
        style={{ fontSize: 'clamp(2.6rem, 5vw, 4.5rem)', letterSpacing: '0.02em' }}
        {...fadeInUp}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        By the <span className="text-racing-red">Numbers</span>
      </motion.h2>

      {loading && <LoadingSkeleton rows={4} className="space-y-4" />}
      {error   && <ErrorState message={error.message} />}

      {!loading && !error && data && (
        <>
          {/* Hero standing block */}
          <HeroStat
            standing={data.standing}
            points={data.points}
            leadingDriver={data.leadingDriver}
          />

          {/* Supporting tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {tiles.map((t, i) => (
              <StatTile key={t.label} {...t} index={i} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
