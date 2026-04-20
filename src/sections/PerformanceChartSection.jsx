/**
 * PerformanceChartSection.jsx — Chapter 05
 * Dual-line chart: per-race points bars + cumulative points line.
 */

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import {
  Area, AreaChart, Bar, CartesianGrid, ComposedChart,
  Line, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { LoadingSkeleton } from '../components/LoadingSkeleton';

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.6 },
};

// ── Custom tooltip ────────────────────────────────────────────────────
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const racePoints = payload.find(p => p.dataKey === 'points');
  const cumPoints  = payload.find(p => p.dataKey === 'cumulativePoints');
  return (
    <div className="border border-off-white/10 bg-[#08090c] px-5 py-4 shadow-2xl min-w-[180px]">
      <p className="font-body text-[0.58rem] uppercase tracking-[0.3em] text-off-white/35 mb-3">
        {payload[0]?.payload?.raceName || label}
      </p>
      {racePoints && (
        <div className="flex items-baseline justify-between gap-6 mb-1">
          <span className="font-body text-[0.6rem] uppercase tracking-[0.2em] text-off-white/35">Race Pts</span>
          <span className="font-display text-2xl text-racing-red" style={{ letterSpacing: '0.02em' }}>
            {racePoints.value}
          </span>
        </div>
      )}
      {cumPoints && (
        <div className="flex items-baseline justify-between gap-6 border-t border-off-white/[0.07] pt-2 mt-2">
          <span className="font-body text-[0.6rem] uppercase tracking-[0.2em] text-off-white/35">Total</span>
          <span className="font-display text-2xl text-off-white" style={{ letterSpacing: '0.02em' }}>
            {cumPoints.value}
          </span>
        </div>
      )}
    </div>
  );
}

// ── View toggle button ────────────────────────────────────────────────
function ViewBtn({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`font-body text-[0.6rem] uppercase tracking-[0.24em] px-4 py-2 transition-all duration-200 border ${
        active
          ? 'border-racing-red text-racing-red bg-racing-red/10'
          : 'border-off-white/[0.1] text-off-white/35 hover:border-off-white/25 hover:text-off-white/60'
      }`}
    >
      {children}
    </button>
  );
}

export function PerformanceChartSection({ chartState }) {
  const sectionRef = useRef(null);
  const { data, loading, error } = chartState;
  const chart = data?.chart || [];

  const [view, setView] = useState('both'); // 'race' | 'cumulative' | 'both'

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 80%', 'end 30%'],
  });
  const tracerX = useTransform(scrollYProgress, [0, 1], ['-5%', '105%']);

  // Summary stats
  const totalPts  = chart.reduce((s, r) => s + r.points, 0);
  const bestRace  = chart.reduce((best, r) => r.points > (best?.points ?? -1) ? r : best, null);
  const races     = chart.length;

  return (
    <section
      id="chart"
      ref={sectionRef}
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
        05
      </motion.span>

      {/* Red line */}
      <motion.div className="mb-12 h-px w-16 bg-racing-red" {...fadeInUp} />

      {/* Header */}
      <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <motion.h2
          className="font-display uppercase text-off-white leading-[0.9]"
          style={{ fontSize: 'clamp(2.6rem, 5vw, 4.5rem)', letterSpacing: '0.02em' }}
          {...fadeInUp}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Points <span className="text-racing-red">Trajectory</span>
        </motion.h2>

        {/* View toggle */}
        {chart.length > 0 && (
          <motion.div
            className="flex gap-2"
            {...fadeInUp}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <ViewBtn active={view === 'race'}       onClick={() => setView('race')}>Per Race</ViewBtn>
            <ViewBtn active={view === 'cumulative'} onClick={() => setView('cumulative')}>Cumulative</ViewBtn>
            <ViewBtn active={view === 'both'}       onClick={() => setView('both')}>Both</ViewBtn>
          </motion.div>
        )}
      </div>

      {/* Summary stat pills */}
      {chart.length > 0 && (
        <motion.div
          className="mb-8 grid grid-cols-3 gap-px bg-off-white/[0.06] border border-off-white/[0.06]"
          {...fadeInUp}
          transition={{ duration: 0.6, delay: 0.25 }}
        >
          {[
            { label: 'Races Scored', value: races },
            { label: 'Total Points', value: totalPts },
            { label: 'Best Race',    value: bestRace ? `${bestRace.points} pts` : '—', sub: bestRace?.shortLabel },
          ].map(({ label, value, sub }) => (
            <div key={label} className="bg-surface px-5 py-4">
              <p className="font-body text-[0.58rem] uppercase tracking-[0.24em] text-off-white/30 mb-1">{label}</p>
              <p className="font-display leading-none text-off-white" style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', letterSpacing: '0.02em' }}>
                {value}
              </p>
              {sub && <p className="font-body text-[0.58rem] text-off-white/25 mt-1">{sub}</p>}
            </div>
          ))}
        </motion.div>
      )}

      {/* Chart card */}
      <motion.div
        className="relative overflow-hidden border border-off-white/[0.07] bg-surface"
        {...fadeInUp}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        {/* Scroll tracer line */}
        <motion.div
          style={{ x: tracerX }}
          className="pointer-events-none absolute left-0 top-0 z-10 h-[2px] w-[10%] bg-gradient-to-r from-transparent via-racing-red to-transparent"
        />

        {loading && <LoadingSkeleton rows={1} className="min-h-[420px]" />}
        {error   && <ErrorState message={error.message} />}

        {!loading && !error && !chart.length && (
          <EmptyState
            title="Chart waiting on data"
            message="Ferrari points will be plotted once race results are available."
          />
        )}

        {!loading && !error && chart.length > 0 && (
          <div className="p-6 md:p-8">

            {/* Legend */}
            <div className="mb-6 flex items-center gap-6">
              {(view === 'race' || view === 'both') && (
                <div className="flex items-center gap-2">
                  <span className="block h-3 w-3 rounded-sm bg-racing-red/60" />
                  <span className="font-body text-[0.6rem] uppercase tracking-[0.22em] text-off-white/40">Race Points</span>
                </div>
              )}
              {(view === 'cumulative' || view === 'both') && (
                <div className="flex items-center gap-2">
                  <span className="block h-0.5 w-6 bg-off-white/50" style={{ borderTop: '2px dashed rgba(216,221,230,0.5)' }} />
                  <span className="font-body text-[0.6rem] uppercase tracking-[0.22em] text-off-white/40">Cumulative</span>
                </div>
              )}
            </div>

            <div className="h-[380px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chart} margin={{ top: 10, right: 12, left: -10, bottom: 20 }}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor="#c0261d" stopOpacity={0.85} />
                      <stop offset="100%" stopColor="#c0261d" stopOpacity={0.25} />
                    </linearGradient>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor="#d8dde6" stopOpacity={0.1} />
                      <stop offset="100%" stopColor="#d8dde6" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    stroke="rgba(216,221,230,0.04)"
                    vertical={false}
                    strokeDasharray="4 4"
                  />
                  <XAxis
                    dataKey="shortLabel"
                    tick={{ fill: 'rgba(216,221,230,0.25)', fontSize: 10, fontFamily: 'Inter Tight' }}
                    axisLine={false} tickLine={false}
                    angle={-30} textAnchor="end" height={52}
                    interval={0} minTickGap={12}
                  />
                  {/* Left Y — race points */}
                  <YAxis
                    yAxisId="race"
                    tick={{ fill: 'rgba(216,221,230,0.25)', fontSize: 10, fontFamily: 'Inter Tight' }}
                    axisLine={false} tickLine={false}
                    width={28}
                  />
                  {/* Right Y — cumulative */}
                  {(view === 'cumulative' || view === 'both') && (
                    <YAxis
                      yAxisId="cum"
                      orientation="right"
                      tick={{ fill: 'rgba(216,221,230,0.18)', fontSize: 10, fontFamily: 'Inter Tight' }}
                      axisLine={false} tickLine={false}
                      width={36}
                    />
                  )}

                  <Tooltip
                    content={<ChartTooltip />}
                    cursor={{ fill: 'rgba(255,40,0,0.04)' }}
                  />

                  {/* Per-race bars */}
                  {(view === 'race' || view === 'both') && (
                    <Bar
                      yAxisId="race"
                      dataKey="points"
                      fill="url(#barGradient)"
                      radius={[2, 2, 0, 0]}
                      maxBarSize={36}
                      animationDuration={1200}
                      animationEasing="ease-out"
                    />
                  )}

                  {/* Cumulative area line */}
                  {(view === 'cumulative' || view === 'both') && (
                    <Area
                      yAxisId="cum"
                      type="monotone"
                      dataKey="cumulativePoints"
                      stroke="rgba(216,221,230,0.7)"
                      strokeWidth={2}
                      strokeDasharray="6 3"
                      fill="url(#areaGradient)"
                      dot={false}
                      activeDot={{ r: 5, fill: '#d8dde6', stroke: '#c0261d', strokeWidth: 2 }}
                      animationDuration={1800}
                      animationEasing="ease-out"
                    />
                  )}
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </motion.div>
    </section>
  );
}
