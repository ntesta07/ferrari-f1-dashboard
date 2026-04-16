/**
 * InsightsSection.jsx — Chapter 06
 * zkatz patterns: ghost number, red line, animated stat counters via StatCard
 */

import { motion } from 'framer-motion';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { StatCard } from '../components/StatCard';

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.6 },
};

export function InsightsSection({ insightsState }) {
  const { data, loading, error } = insightsState;

  const cards = data
    ? [
        ['Best finish',          data.bestFinish.value,          data.bestFinish.detail],
        ['Highest-scoring race', data.highestScoringRace.value,  data.highestScoringRace.detail],
        ['Average finish',       data.averageFinish.value,       data.averageFinish.detail],
        ['Strongest driver',     data.strongestDriver.value,     data.strongestDriver.detail],
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
      <motion.div className="mb-12 h-px w-16 bg-racing-red" {...fadeInUp} />

      <motion.h2
        className="font-display uppercase text-off-white mb-16 leading-[0.9]"
        style={{ fontSize: 'clamp(2.6rem, 5vw, 4.5rem)', letterSpacing: '0.02em' }}
        {...fadeInUp}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        Season <span className="text-racing-red">Insights</span>
      </motion.h2>

      {loading && <LoadingSkeleton rows={4} className="grid gap-0 md:grid-cols-4" />}
      {error   && <ErrorState message={error.message} />}

      {!loading && !error && !cards.length && (
        <EmptyState
          title="Insights unavailable"
          message="Insight cards will appear after Ferrari race data has been processed."
        />
      )}

      {!loading && !error && cards.length > 0 && (
        <div className="grid grid-cols-1 gap-0 md:grid-cols-2 xl:grid-cols-4 md:divide-x md:divide-off-white/[0.06]">
          {cards.map(([label, value, detail], i) => (
            <div key={label} className="px-0 md:px-8 md:first:pl-0 md:last:pr-0">
              <StatCard label={label} value={value} detail={detail} index={i} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
