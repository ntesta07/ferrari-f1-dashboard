/**
 * DriverSpotlight.jsx — Chapter 03
 *
 * Ported from zkatz-website FeaturedWork.jsx card patterns:
 * - Ghost "03" chapter number corner
 * - Cards fade-in + shift up 40px on scroll, stagger by index * 0.1
 * - Hover: lift -8px + subtle rotate (same as zkatz article cards)
 * - Red underline sweeps in on hover (scaleX 0→1)
 * - Image zoom to 105% on hover
 */

import { motion } from 'framer-motion';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { LoadingSkeleton } from '../components/LoadingSkeleton';

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
};

function DriverCard({ driver, index }) {
  const initials = driver.name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2);

  return (
    <motion.article
      {...fadeInUp}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -8, rotate: 0.3 }}
      className="group relative overflow-hidden border border-off-white/[0.07] bg-surface transition-colors hover:border-racing-red/40"
    >
      <div className="grid md:grid-cols-[260px_1fr]">

        {/* Portrait panel */}
        <div className="relative aspect-[3/4] md:aspect-auto overflow-hidden bg-[#0f0f0f]">
          {/* Background image — zoom on hover (zkatz pattern) */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-racing-red/20 via-transparent to-transparent"
            whileHover={{ opacity: 0.7 }}
          />

          {/* Giant faint initials as background art */}
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
            <span
              className="font-display text-off-white/[0.04] select-none leading-none"
              style={{ fontSize: 'clamp(7rem, 16vw, 14rem)', letterSpacing: '0.02em' }}
            >
              {initials}
            </span>
          </div>

          {/* Driver number */}
          <div className="absolute top-5 left-5 z-10">
            <span
              className="font-display text-racing-red leading-none"
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '0.02em' }}
            >
              #{driver.number}
            </span>
          </div>

          {/* Name at bottom */}
          <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-primary-black to-transparent p-5">
            <p
              className="font-display uppercase text-off-white leading-none"
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '0.02em' }}
            >
              {driver.name}
            </p>
            {/* Red underline sweep — scaleX 0→1 on hover */}
            <motion.div
              className="mt-2 h-[2px] w-full origin-left bg-racing-red"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 0 }}
              whileHover={{ scaleX: 1 }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Data panel */}
        <div className="flex flex-col justify-between gap-6 p-7">
          <div className="flex items-center justify-between border-b border-off-white/[0.07] pb-5">
            <span className="font-body text-[0.63rem] uppercase tracking-[0.3em] text-off-white/30">Nationality</span>
            <span className="font-body text-sm text-off-white/70">{driver.nationality}</span>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-7">
            {[
              ['Points',     driver.points],
              ['Wins',       driver.wins],
              ['Podiums',    driver.podiums],
              ['Avg Finish', driver.averageFinish || '—'],
            ].map(([lbl, val]) => (
              <div key={lbl}>
                <p className="mb-1 font-body text-[0.6rem] uppercase tracking-[0.28em] text-off-white/28">{lbl}</p>
                <p
                  className="font-display text-off-white leading-none"
                  style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', letterSpacing: '0.02em' }}
                >
                  {val}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t border-off-white/[0.07] pt-5">
            <span className="inline-flex items-center gap-2 font-body text-[0.6rem] uppercase tracking-[0.26em] text-racing-red">
              <span className="h-px w-5 bg-racing-red" />
              Scuderia Ferrari Driver
            </span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export function DriverSpotlight({ driversState }) {
  const { data, loading, error } = driversState;
  const drivers = data?.drivers || [];

  return (
    <section
      id="drivers"
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
        03
      </motion.span>

      {/* Red line */}
      <motion.div
        className="mb-12 h-px w-16 bg-racing-red"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
      />

      <motion.h2
        className="font-display uppercase text-off-white mb-16 leading-[0.9]"
        style={{ fontSize: 'clamp(2.6rem, 5vw, 4.5rem)', letterSpacing: '0.02em' }}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        The Lineup
      </motion.h2>

      {loading && <LoadingSkeleton rows={2} className="flex flex-col gap-6" />}
      {error   && <ErrorState message={error.message} />}

      {!loading && !error && !drivers.length && (
        <EmptyState
          title="No drivers yet"
          message="Driver cards will appear once Ferrari race results are available."
        />
      )}

      {!loading && !error && drivers.length > 0 && (
        <div className="flex flex-col gap-6">
          {drivers.map((driver, i) => (
            <DriverCard key={driver.id} driver={driver} index={i} />
          ))}
        </div>
      )}
    </section>
  );
}
