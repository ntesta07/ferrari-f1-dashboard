import { motion } from "framer-motion";
import { EmptyState } from "../components/EmptyState";
import { ErrorState } from "../components/ErrorState";
import { LoadingSkeleton } from "../components/LoadingSkeleton";

// Known Ferrari driver portrait image — Unsplash fallback
const DRIVER_BG =
  "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=80";

function DriverCard({ driver, index }) {
  const initials = driver.name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2);

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.65, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group relative border border-white/8 overflow-hidden transition-colors hover:border-[var(--color-ferrari)]"
    >
      {/* Top accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] bg-[var(--color-ferrari)] origin-left transition-transform duration-500"
        style={{ transform: "scaleX(0.3)" }}
      />

      <div className="grid md:grid-cols-[280px_1fr]">
        {/* Portrait */}
        <div className="relative aspect-[3/4] md:aspect-auto bg-[#111] overflow-hidden">
          {/* Giant initials as visual */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="font-display text-white/5 select-none"
              style={{ fontSize: "clamp(8rem, 18vw, 16rem)", letterSpacing: "0.02em" }}
            >
              {initials}
            </span>
          </div>
          {/* Number */}
          <div className="absolute top-5 left-5">
            <span
              className="font-display text-[var(--color-ferrari)] leading-none"
              style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", letterSpacing: "0.02em" }}
            >
              #{driver.number}
            </span>
          </div>
          {/* Red gradient bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-[rgba(255,40,0,0.12)] to-transparent" />
          {/* Name at bottom */}
          <div className="absolute bottom-5 left-5 right-5">
            <p
              className="font-display uppercase text-white leading-none"
              style={{ fontSize: "clamp(2.2rem, 4vw, 3.2rem)", letterSpacing: "0.02em" }}
            >
              {driver.name}
            </p>
          </div>
        </div>

        {/* Data panel */}
        <div className="p-8 flex flex-col justify-between gap-8">
          {/* Nationality */}
          <div className="flex items-center justify-between border-b border-white/8 pb-5">
            <span className="text-[0.65rem] uppercase tracking-[0.3em] text-white/35">Nationality</span>
            <span className="text-sm text-white/70">{driver.nationality}</span>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-y-8 gap-x-4">
            {[
              ["Points", driver.points],
              ["Wins", driver.wins],
              ["Podiums", driver.podiums],
              ["Avg Finish", driver.averageFinish || "—"],
            ].map(([label, val]) => (
              <div key={label}>
                <p className="mb-2 text-[0.62rem] uppercase tracking-[0.28em] text-white/30">{label}</p>
                <p
                  className="font-display text-white leading-none"
                  style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)", letterSpacing: "0.02em" }}
                >
                  {val}
                </p>
              </div>
            ))}
          </div>

          {/* Driver role badge */}
          <div className="border-t border-white/8 pt-5">
            <span className="inline-flex items-center gap-2 text-[0.62rem] uppercase tracking-[0.28em] text-[var(--color-ferrari)]">
              <span className="h-1 w-4 bg-[var(--color-ferrari)]" />
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
    <section id="drivers" className="py-24 md:py-32">
      <div className="site-container">

        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 flex items-center gap-4"
        >
          <span className="section-number">03</span>
          <div className="h-px flex-1 bg-white/8" />
          <span className="text-[0.62rem] uppercase tracking-[0.3em] text-white/25">Drivers</span>
        </motion.div>

        <div className="mb-10">
          <h2
            className="font-display uppercase text-white leading-[0.88]"
            style={{ fontSize: "clamp(2.8rem, 5vw, 4.5rem)", letterSpacing: "0.02em" }}
          >
            The lineup
          </h2>
        </div>

        {loading && <LoadingSkeleton rows={2} className="flex flex-col gap-6" />}
        {error && <ErrorState message={error.message} />}

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
      </div>
    </section>
  );
}
