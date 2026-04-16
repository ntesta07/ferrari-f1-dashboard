/**
 * OverviewStats.jsx — Chapter 02
 *
 * Ported from zkatz-website Stats.jsx layout:
 * - Ghost "02" chapter number corner
 * - Red separator line + heading
 * - 2-col mobile / 3-col desktop stat grid
 * - Each StatCard animates its number with ease-out cubic on scroll
 * - Stagger: index * 0.15 (same as zkatz)
 */

import { motion } from 'framer-motion';
import { ErrorState } from '../components/ErrorState';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { SectionHeading } from '../components/SectionHeading';
import { StatCard } from '../components/StatCard';

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.6 },
};

export function OverviewStats({ overviewState }) {
  const { data, loading, error } = overviewState;

  const cards = data
    ? [
        ['Standing',       `P${data.standing}`,  'Constructor championship rank'],
        ['Points',          data.points,           'Total points this season'],
        ['Wins',            data.wins,             'Race victories secured'],
        ['Podiums',         data.podiums,          'Combined podium finishes'],
        ['Rounds',          data.racesProcessed,   'Races processed'],
        ['Points Leader',   data.leadingDriver,    "Ferrari's top scorer"],
      ]
    : [];

  return (
    <section
      id="performance"
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
        02
      </motion.span>

      <SectionHeading
        eyebrow="Season overview"
        title="By the numbers"
        description="Constructor standings, points haul, and race-by-race execution condensed into headline figures."
      />

      <div className="mt-16">
        {loading && <LoadingSkeleton rows={6} className="grid gap-0 md:grid-cols-3" />}
        {error   && <ErrorState message={error.message} />}

        {!loading && !error && (
          <div className="grid grid-cols-2 md:grid-cols-3">
            {cards.map(([label, value, detail], i) => (
              <div
                key={label}
                className="px-0 md:px-8 md:first:pl-0 border-r border-off-white/[0.06] last:border-r-0 md:[&:nth-child(3n)]:border-r-0"
              >
                <StatCard label={label} value={value} detail={detail} index={i} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
