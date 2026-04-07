import { motion } from "framer-motion";

const IMAGES = {
  main:  "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1400&q=80",
  pit:   "https://images.unsplash.com/photo-1541773367336-d3a8738ca6f0?auto=format&fit=crop&w=900&q=80",
  livery:"https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80",
};

function GalleryImage({ src, alt, className, children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`relative overflow-hidden group bg-[#111] ${className}`}
    >
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        style={{ filter: "brightness(0.55) saturate(0.85)" }}
        onError={(e) => { e.currentTarget.style.display = "none"; }}
      />
      <div
        className="absolute top-0 left-0 w-10 h-10 z-10"
        style={{ background: "linear-gradient(135deg, var(--color-ferrari) 0%, transparent 55%)" }}
      />
      {children}
    </motion.div>
  );
}

export function GallerySection() {
  return (
    <section id="gallery" className="py-24 md:py-32">
      <div className="site-container">

        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 flex items-center gap-4"
        >
          <span className="section-number">06</span>
          <div className="h-px flex-1 bg-white/8" />
          <span className="text-[0.62rem] uppercase tracking-[0.3em] text-white/25">Visual chapter</span>
        </motion.div>

        <div className="mb-10">
          <h2
            className="font-display uppercase text-white leading-[0.88]"
            style={{ fontSize: "clamp(2.8rem, 5vw, 4.5rem)", letterSpacing: "0.02em" }}
          >
            Built for<br /><span className="text-[var(--color-ferrari)]">speed.</span>
          </h2>
        </div>

        {/* Main image grid */}
        <div className="grid gap-3 lg:grid-cols-[1.4fr_0.6fr]">
          <GalleryImage src={IMAGES.main} alt="Ferrari F1 at speed" className="aspect-[16/10]">
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 z-10">
              <p className="text-[0.62rem] uppercase tracking-[0.3em] text-white/40 mb-2">Race pace</p>
              <p className="font-editorial text-2xl text-white leading-tight">
                Speed that reads before any number does.
              </p>
            </div>
          </GalleryImage>

          <div className="flex flex-col gap-3">
            <GalleryImage src={IMAGES.pit} alt="Ferrari pit wall" className="flex-1 aspect-[4/3] lg:aspect-auto" delay={0.08}>
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 z-10">
                <p className="text-[0.62rem] uppercase tracking-[0.3em] text-white/40 mb-1">Pit wall</p>
                <p className="font-display text-xl uppercase tracking-wide text-white">Strategy layer</p>
              </div>
            </GalleryImage>

            <GalleryImage src={IMAGES.livery} alt="Ferrari livery" className="flex-1 aspect-[4/3] lg:aspect-auto" delay={0.14}>
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
              <div className="absolute inset-0 bg-[rgba(255,40,0,0.08)]" />
              <div className="absolute bottom-5 left-5 z-10">
                <p className="text-[0.62rem] uppercase tracking-[0.3em] text-white/40 mb-1">Livery</p>
                <p className="font-display text-xl uppercase tracking-wide text-[var(--color-ferrari)]">Rosso Corsa</p>
              </div>
            </GalleryImage>
          </div>
        </div>

        {/* Quote strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8 border-t border-white/8 pt-8 flex items-center justify-between gap-8"
        >
          <p className="font-editorial text-xl md:text-2xl text-white/45 leading-relaxed max-w-xl">
            "Ferrari is not a sponsor. Ferrari is a mythology."
          </p>
          <div className="hidden md:flex items-center gap-3 text-[0.62rem] uppercase tracking-[0.3em] text-white/25 shrink-0">
            <div className="h-px w-8 bg-[var(--color-ferrari)]" />
            Maranello, Italy
          </div>
        </motion.div>
      </div>
    </section>
  );
}
