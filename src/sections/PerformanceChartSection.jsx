/**
 * PerformanceChartSection.jsx — Chapter 05
 * zkatz patterns: ghost number, red line, fadeInUp, scroll-tracer line
 */

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import {
  CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { LoadingSkeleton } from '../components/LoadingSkeleton';

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="border border-off-white/10 bg-[#0f0f0f] px-4 py-3 shadow-2xl">
      <p className="font-body text-[0.6rem] uppercase tracking-[0.3em] text-off-white/35">{label}</p>
      <p className="mt-1 font-display text-3xl uppercase tracking-wide text-off-white">
        {payload[0].value} <span className="text-racing-red">pts</span>
      </p>
      <p className="mt-1 font-body text-xs text-off-white/35">{payload[0].payload.raceName}</p>
    </div>
  );
}

export function PerformanceChartSection({ chartState }) {
  const sectionRef = useRef(null);
  const { data, loading, error } = chartState;
  const chart = data?.chart || [];

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 80%', 'end 30%'],
  });
  const tracerX = useTransform(scrollYProgress, [0, 1], ['-5%', '105%']);

  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-100px' },
    transition: { duration: 0.6 },
  };

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

      <motion.h2
        className="font-display uppercase text-off-white mb-16 leading-[0.9]"
        style={{ fontSize: 'clamp(2.6rem, 5vw, 4.5rem)', letterSpacing: '0.02em' }}
        {...fadeInUp}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        Points <span className="text-racing-red">Trajectory</span>
      </motion.h2>

      <motion.div
        className="relative overflow-hidden border border-off-white/[0.07] bg-surface p-6 md:p-8"
        {...fadeInUp}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {/* Scroll-triggered tracer line */}
        <motion.div
          style={{ x: tracerX }}
          className="pointer-events-none absolute left-0 top-0 z-10 h-[2px] w-[10%] bg-gradient-to-r from-transparent via-racing-red to-transparent"
        />

        {loading && <LoadingSkeleton rows={1} className="min-h-[360px]" />}
        {error   && <ErrorState message={error.message} />}

        {!loading && !error && !chart.length && (
          <EmptyState
            title="Chart waiting on data"
            message="Ferrari points will be plotted once race results are available."
          />
        )}

        {!loading && !error && chart.length > 0 && (
          <div className="h-[360px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chart} margin={{ top: 20, right: 8, left: -16, bottom: 14 }}>
                <CartesianGrid stroke="rgba(244,238,228,0.04)" vertical={false} />
                <XAxis
                  dataKey="axisLabel"
                  interval={0} minTickGap={16}
                  tick={{ fill: 'rgba(244,238,228,0.28)', fontSize: 10, fontFamily: 'Inter Tight' }}
                  axisLine={false} tickLine={false} angle={-18} textAnchor="end" height={55}
                />
                <YAxis
                  tick={{ fill: 'rgba(244,238,228,0.28)', fontSize: 11, fontFamily: 'Inter Tight' }}
                  axisLine={false} tickLine={false}
                />
                <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'rgba(244,238,228,0.06)' }} />
                <Line
                  type="monotone" dataKey="points"
                  stroke="#ff2800" strokeWidth={2.5}
                  dot={{ r: 3.5, fill: '#0a0a0a', stroke: '#ff2800', strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: '#ff2800', stroke: '#f4eee4', strokeWidth: 2 }}
                  animationDuration={1400}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </motion.div>
    </section>
  );
}
