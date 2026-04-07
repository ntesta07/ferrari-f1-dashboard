import { motion } from "framer-motion";

const TEAM_IMG =
  "https://images.unsplash.com/photo-1541773367336-d3a8738ca6f0?auto=format&fit=crop&w=1200&q=80";

export function TeamIntro() {
  return (
    <section id="team" className="py-24 md:py-32">
      <div className="site-container">

        {/* Section label row */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 flex items-center gap-4"
        >
          <span className="section-number">01</span>
          <div className="h-px flex-1 bg-white/8" />
          <span className="text-[0.62rem] uppercase tracking-[0.3em] text-white/25">The team</span>
        </motion.div>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 lg:items-center">

          {/* Left: image panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative aspect-[4/5] overflow-hidden"
          >
            <img
              src={TEAM_IMG}
              alt="Ferrari team"
              className="h-full w-full object-cover"
              style={{ filter: "brightness(0.75) saturate(0.9)" }}
              onError={(e) => { e.currentTarget.style.display = "none"; }}
            />
            {/* Red tint overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(255,40,0,0.18)] via-transparent to-transparent" />
            {/* Caption */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#0a0a0a] to-transparent">
              <p className="text-[0.62rem] uppercase tracking-[0.3em] text-white/40">Maranello, Italy</p>
            </div>
            {/* Corner accent */}
            <div
              className="absolute top-0 left-0 w-12 h-12"
              style={{ background: "linear-gradient(135deg, var(--color-ferrari) 0%, transparent 50%)" }}
            />
          </motion.div>

          {/* Right: text */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.75, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-8"
          >
            <h2
              className="font-display uppercase text-white leading-[0.88]"
              style={{ fontSize: "clamp(3.5rem, 6vw, 5.5rem)", letterSpacing: "0.01em" }}
            >
              Not a
              <br />
              <span className="text-[var(--color-ferrari)]">spreadsheet.</span>
              <br />
              A story.
            </h2>

            <p className="text-base leading-8 text-white/50 max-w-lg">
              Ferrari is not presented here as rows and columns. It is presented as pressure, velocity, and accumulation — a historic red silhouette translated into standings movement and race-by-race momentum.
            </p>

            {/* Stats strip */}
            <div className="grid grid-cols-3 border-t border-white/8 pt-8">
              {[
                ["1950", "Founded"],
                ["16", "Constructors' Titles"],
                ["240+", "Race Victories"],
              ].map(([val, label]) => (
                <div key={label} className="border-r border-white/8 last:border-r-0 pr-6 last:pr-0 pl-0 first:pl-0">
                  <p
                    className="font-display text-white leading-none"
                    style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)", letterSpacing: "0.02em" }}
                  >
                    {val}
                  </p>
                  <p className="mt-2 text-[0.62rem] uppercase tracking-[0.24em] text-white/30">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
