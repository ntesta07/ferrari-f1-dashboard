/**
 * InsightsSection.jsx — Chapter 06  "Season Insights"
 */

import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Flag, Trophy, TrendingUp, Star } from 'lucide-react';
import { EmptyState }     from '../components/EmptyState';
import { ErrorState }     from '../components/ErrorState';
import { LoadingSkeleton } from '../components/LoadingSkeleton';

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
};

// Per-card config: icon + accent color
const CARD_META = [
  { icon: Trophy,    color: '#c0261d', bg: 'rgba(255,40,0,0.07)'      },
  { icon: Star,      color: '#d8dde6', bg: 'rgba(216,221,230,0.05)'  },
  { icon: TrendingUp,color: '#c0261d', bg: 'rgba(255,40,0,0.07)'     },
  { icon: Flag,      color: '#d8dde6', bg: 'rgba(216,221,230,0.05)'  },
];

// Animated counter for numeric values
function Counter({ value }) {
  const ref    = useRef(null);
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
    const start = performance.now();
    let raf;
    const step = (now) => {
      const t = Math.min((now - start) / 1800, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setCount(target % 1 === 0 ? Math.round(eased * target) : parseFloat((eased * target).toFixed(1)));
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, isNum, target]);

  return <span ref={ref}>{isNum ? `${prefix}${count}${suffix}` : value}</span>;
}

function InsightCard({ label, value, detail, index }) {
  const meta = CARD_META[index] ?? CARD_META[0];
  const Icon = meta.icon;

  return (
    <motion.div
      className="group relative flex flex-col border border-off-white/[0.07] bg-surface overflow-hidden transition-colors hover:border-off-white/[0.15]"
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.65, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
    >
      {/* Colored glow bg */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `radial-gradient(ellipse at top left, ${meta.bg}, transparent 70%)` }}
      />

      {/* Top accent bar that grows on scroll */}
      <motion.div
        className="absolute top-0 left-0 h-[2px]"
        style={{ background: meta.color }}
        initial={{ width: 0 }}
        whileInView={{ width: '100%' }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: index * 0.1 + 0.3, ease: [0.22, 1, 0.36, 1] }}
      />

      <div className="relative flex flex-col gap-5 p-7 flex-1">
        {/* Icon + label row */}
        <div className="flex items-center justify-between">
          <p className="font-body text-[0.58rem] uppercase tracking-[0.3em] text-off-white/28">
            {label}
          </p>
          <div
            className="flex h-8 w-8 items-center justify-center rounded-sm shrink-0"
            style={{ background: meta.bg, color: meta.color }}
          >
            <Icon size={15} strokeWidth={1.5} />
          </div>
        </div>

        {/* Value — big animated number */}
        <p
          className="font-display leading-none"
          style={{
            fontSize: 'clamp(2.8rem, 5vw, 4.2rem)',
            letterSpacing: '0.02em',
            color: meta.color,
          }}
        >
          <Counter value={value} />
        </p>

        {/* Detail */}
        {detail && (
          <p className="font-body text-[0.78rem] leading-5 text-off-white/38 mt-auto">
            {detail}
          </p>
        )}
      </div>

      {/* Bottom ghost index */}
      <div className="absolute bottom-3 right-4 pointer-events-none select-none">
        <span
          className="font-display text-off-white/[0.04]"
          style={{ fontSize: '4rem', letterSpacing: '-0.04em' }}
        >
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>
    </motion.div>
  );
}

export function InsightsSection({ insightsState }) {
  const { data, loading, error } = insightsState;

  const cards = data
    ? [
        { label: 'Best Finish',          value: data.bestFinish.value,         detail: data.bestFinish.detail },
        { label: 'Highest-Scoring Race', value: data.highestScoringRace.value, detail: data.highestScoringRace.detail },
        { label: 'Average Finish',       value: data.averageFinish.value,      detail: data.averageFinish.detail },
        { label: 'Strongest Driver',     value: data.strongestDriver.value,    detail: data.strongestDriver.detail },
      ]
    : [];

  return (
    <section
      id="insights"
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
        06
      </motion.span>

      {/* Red line */}
      <motion.div className="mb-4 h-px w-16 bg-racing-red" {...fadeInUp} />

      <div className="mb-14 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <motion.p
            className="mb-3 font-body text-xs uppercase tracking-[0.32em] text-off-white/35"
            {...fadeInUp}
            transition={{ duration: 0.6, delay: 0.05 }}
          >
            Data-driven
          </motion.p>
          <motion.h2
            className="font-display uppercase text-off-white leading-[0.9]"
            style={{ fontSize: 'clamp(2.6rem, 5vw, 4.5rem)', letterSpacing: '0.02em' }}
            {...fadeInUp}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Season <span className="text-racing-red">Insights</span>
          </motion.h2>
        </div>

        <motion.p
          className="font-body text-sm text-off-white/35 max-w-xs leading-6"
          {...fadeInUp}
          transition={{ duration: 0.6, delay: 0.18 }}
        >
          Key performance metrics distilled from every classified Ferrari result this season.
        </motion.p>
      </div>

      {loading && <LoadingSkeleton rows={4} className="grid gap-4 md:grid-cols-2 xl:grid-cols-4" />}
      {error   && <ErrorState message={error.message} />}

      {!loading && !error && !cards.length && (
        <EmptyState
          title="Insights unavailable"
          message="Insight cards will appear after Ferrari race data has been processed."
        />
      )}

      {!loading && !error && cards.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {cards.map((card, i) => (
            <InsightCard key={card.label} {...card} index={i} />
          ))}
        </div>
      )}
    </section>
  );
}
