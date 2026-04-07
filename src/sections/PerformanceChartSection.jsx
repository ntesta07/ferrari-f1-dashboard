import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { EmptyState } from "../components/EmptyState";
import { ErrorState } from "../components/ErrorState";
import { LoadingSkeleton } from "../components/LoadingSkeleton";

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="border border-white/12 bg-[#0f0f0f] px-4 py-3 shadow-2xl">
      <p className="text-[0.6rem] uppercase tracking-[0.3em] text-white/35">{label}</p>
      <p className="mt-1 font-display text-3xl uppercase tracking-wide text-white">
        {payload[0].value} <span className="text-[var(--color-ferrari)]">pts</span>
      </p>
      <p className="mt-1 text-xs text-white/40">{payload[0].payload.raceName}</p>
    </div>
  );
}

export function PerformanceChartSection({ chartState }) {
  const sectionRef = useRef(null);
  const { data, loading, error } = chartState;
  const chart = data?.chart || [];

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 80%", "end 30%"],
  });
  const tracerX = useTransform(scrollYProgress, [0, 1], ["-5%", "105%"]);

  return (
    <section id="chart" ref={sectionRef} className="py-24 md:py-32">
      <div className="site-container">

        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 flex items-center gap-4"
        >
          <span className="section-number">05</span>
          <div className="h-px flex-1 bg-white/8" />
          <span className="text-[0.62rem] uppercase tracking-[0.3em] text-white/25">Performance</span>
        </motion.div>

        <div className="mb-8">
          <h2
            className="font-display uppercase text-white leading-[0.88]"
            style={{ fontSize: "clamp(2.8rem, 5vw, 4.5rem)", letterSpacing: "0.02em" }}
          >
            Points<br /><span className="text-[var(--color-ferrari)]">trajectory</span>
          </h2>
        </div>

        <div className="relative border border-white/8 bg-[#0d0d0d] overflow-hidden">
          {/* Tracer line */}
          <motion.div
            style={{ x: tracerX }}
            className="pointer-events-none absolute left-0 top-0 z-10 h-[2px] w-[12%] bg-gradient-to-r from-transparent via-[var(--color-ferrari)] to-transparent"
          />

          <div className="p-6 md:p-8">
            {loading && <LoadingSkeleton rows={1} className="min-h-[380px]" />}
            {error && <ErrorState message={error.message} />}
            {!loading && !error && !chart.length && (
              <EmptyState
                title="Chart waiting on data"
                message="Ferrari points will be plotted as soon as race results are available."
              />
            )}
            {!loading && !error && chart.length > 0 && (
              <div className="h-[380px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chart} margin={{ top: 20, right: 8, left: -16, bottom: 14 }}>
                    <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis
                      dataKey="axisLabel"
                      interval={0}
                      minTickGap={16}
                      tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10, fontFamily: "Inter Tight" }}
                      axisLine={false}
                      tickLine={false}
                      angle={-18}
                      textAnchor="end"
                      height={55}
                    />
                    <YAxis
                      tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11, fontFamily: "Inter Tight" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<ChartTooltip />} cursor={{ stroke: "rgba(255,255,255,0.08)" }} />
                    <Line
                      type="monotone"
                      dataKey="points"
                      stroke="var(--color-ferrari)"
                      strokeWidth={2.5}
                      dot={{ r: 3.5, fill: "#0d0d0d", stroke: "var(--color-ferrari)", strokeWidth: 2 }}
                      activeDot={{ r: 6, fill: "var(--color-ferrari)", stroke: "#ffffff", strokeWidth: 2 }}
                      animationDuration={1400}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
