import { motion, useScroll, useTransform } from "framer-motion";

const FERRARI_CAR_URL =
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1600&q=80";

export function HeroSection() {
  const { scrollY } = useScroll();
  const imgY = useTransform(scrollY, [0, 700], [0, 120]);
  const textY = useTransform(scrollY, [0, 700], [0, 55]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <section id="hero" className="relative min-h-screen overflow-hidden bg-[#0a0a0a]">

      {/* Background image with parallax */}
      <motion.div
        style={{ y: imgY }}
        className="absolute inset-0 z-0"
      >
        <img
          src={FERRARI_CAR_URL}
          alt="Ferrari F1"
          className="h-full w-full object-cover object-center"
          style={{ filter: "brightness(0.32) saturate(1.2)" }}
          onError={(e) => { e.currentTarget.style.display = "none"; }}
        />
        {/* Fallback gradient if image fails */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a0000] via-[#0a0a0a] to-[#0a0a0a]" />
      </motion.div>

      {/* Red accent line at very top */}
      <div className="absolute top-0 left-0 right-0 h-[3px] z-20 bg-[var(--color-ferrari)]" />

      {/* Vignette */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#0a0a0a] via-[rgba(10,10,10,0.35)] to-transparent" />

      {/* Content */}
      <motion.div
        style={{ y: textY, opacity }}
        className="relative z-20 flex min-h-screen flex-col justify-end pb-16 pt-32 site-container"
      >
        {/* Season badge */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 flex items-center gap-3"
        >
          <span
            className="h-1.5 w-1.5 rounded-full bg-[var(--color-ferrari)] shrink-0"
            style={{ animation: "pulse-dot 2s ease-in-out infinite" }}
          />
          <span className="text-[0.68rem] uppercase tracking-[0.36em] text-white/50">
            2025 Formula 1 Season — Live Data
          </span>
        </motion.div>

        {/* Main headline */}
        <div className="overflow-hidden">
          <motion.h1
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="font-display uppercase leading-[0.85] text-white"
            style={{ fontSize: "clamp(5.5rem, 14vw, 14rem)", letterSpacing: "0.01em" }}
          >
            Scuderia
          </motion.h1>
        </div>
        <div className="overflow-hidden">
          <motion.h1
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            transition={{ duration: 0.9, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
            className="font-display uppercase leading-[0.85] text-[var(--color-ferrari)]"
            style={{ fontSize: "clamp(5.5rem, 14vw, 14rem)", letterSpacing: "0.01em" }}
          >
            Ferrari
          </motion.h1>
        </div>

        {/* Bottom row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"
        >
          <p className="max-w-md text-base leading-7 text-white/50">
            A live performance dashboard for the Scuderia — race results, constructor standings, and driver data updated in real time.
          </p>
          <div className="flex gap-3 shrink-0">
            <a href="#performance" className="btn btn-primary">
              Explore stats
            </a>
            <a href="#results" className="btn btn-ghost">
              Race archive
            </a>
          </div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="absolute bottom-8 right-8 flex items-center gap-2 text-[0.62rem] uppercase tracking-[0.3em] text-white/25"
        >
          <span>Scroll</span>
          <div className="h-px w-8 bg-white/20" />
        </motion.div>
      </motion.div>

      {/* Marquee strip at bottom of hero */}
      <div className="absolute bottom-0 left-0 right-0 z-20 border-t border-white/8 bg-[rgba(10,10,10,0.85)] py-3 overflow-hidden backdrop-blur-sm">
        <div className="marquee-track">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="marquee-item text-[0.62rem] uppercase tracking-[0.28em] text-white/30">
              {[
                "Scuderia Ferrari",
                "·",
                "Constructor Championship",
                "·",
                "Maranello",
                "·",
                "Formula 1",
                "·",
                "Race Intelligence",
                "·",
                "Live Data",
                "·",
              ].map((word, j) => (
                <span key={j} style={{ color: word === "·" ? "var(--color-ferrari)" : undefined }}>
                  {word}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
