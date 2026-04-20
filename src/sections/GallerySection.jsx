/**
 * GallerySection.jsx — Chapter 07
 *
 * Ported from zkatz-website Gallery.jsx:
 * - Horizontal scroll container with scroll-snap
 * - Left / Right arrow buttons (useRef + scrollBy)
 * - Each image fades + scales in on mount (staggered)
 * - Hover: slight brightness lift + red corner accent
 * - scrollbar-hide class hides the scrollbar
 */

import { motion } from 'framer-motion';
import { useRef } from 'react';

const IMAGES = [
  { src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80', alt: 'Ferrari F1 at speed' },
  { src: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=900&q=80', alt: 'F1 racing action' },
  { src: 'https://images.unsplash.com/photo-1541773367336-d3a8738ca6f0?auto=format&fit=crop&w=900&q=80', alt: 'Ferrari pit lane' },
  { src: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80', alt: 'Ferrari livery close-up' },
  { src: 'https://images.unsplash.com/photo-1607220614504-c0c0c1d07ee5?auto=format&fit=crop&w=900&q=80', alt: 'F1 car detail' },
  { src: 'https://images.unsplash.com/photo-1600712242805-5f78671b24da?auto=format&fit=crop&w=900&q=80', alt: 'Race start' },
];

const SCROLL_AMOUNT = 420;

export function GallerySection() {
  const scrollRef = useRef(null);

  const scrollLeft  = () => scrollRef.current?.scrollBy({ left: -SCROLL_AMOUNT, behavior: 'smooth' });
  const scrollRight = () => scrollRef.current?.scrollBy({ left:  SCROLL_AMOUNT, behavior: 'smooth' });

  return (
    <section
      id="gallery"
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
        07
      </motion.span>

      {/* Header row */}
      <div className="mb-10 flex items-end justify-between">
        <div>
          <motion.div
            className="mb-8 h-px w-16 bg-racing-red"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          />
          <motion.h2
            className="font-display uppercase text-off-white leading-[0.9]"
            style={{ fontSize: 'clamp(2.6rem, 5vw, 4.5rem)', letterSpacing: '0.02em' }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            The <span className="text-racing-red">Gallery</span>
          </motion.h2>
        </div>

        {/* Scroll buttons — same pattern as zkatz */}
        <motion.div
          className="flex gap-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <button
            type="button"
            onClick={scrollLeft}
            className="flex h-10 w-10 items-center justify-center border border-off-white/20 text-off-white/60 transition-colors hover:border-racing-red hover:text-racing-red"
            aria-label="Scroll left"
          >
            ←
          </button>
          <button
            type="button"
            onClick={scrollRight}
            className="flex h-10 w-10 items-center justify-center border border-off-white/20 text-off-white/60 transition-colors hover:border-racing-red hover:text-racing-red"
            aria-label="Scroll right"
          >
            →
          </button>
        </motion.div>
      </div>

      {/* Horizontal scroll container */}
      <div
        ref={scrollRef}
        className="scrollbar-hide flex gap-4 overflow-x-auto scroll-smooth"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {IMAGES.map((img, i) => (
          <motion.div
            key={i}
            className="group relative shrink-0 overflow-hidden"
            style={{
              width: 'clamp(260px, 38vw, 480px)',
              aspectRatio: '3/4',
              scrollSnapAlign: 'start',
            }}
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.65, delay: i * 0.08 }}
          >
            {/* Image — zoom on hover */}
            <img
              src={img.src}
              alt={img.alt}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              style={{ filter: 'brightness(0.7) saturate(0.9)' }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement.style.background = '#111';
              }}
            />

            {/* Red corner accent — zkatz style */}
            <div
              className="absolute top-0 left-0 z-10 h-8 w-8"
              style={{ background: 'linear-gradient(135deg, #ff2800 0%, transparent 55%)' }}
            />

            {/* Bottom caption */}
            <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-primary-black/80 to-transparent p-5">
              <p className="font-body text-[0.6rem] uppercase tracking-[0.28em] text-off-white/40">{img.alt}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom quote — same as zkatz Contact's editorial text */}
      <motion.div
        className="mt-16 border-t border-off-white/[0.07] pt-10 flex items-center justify-between gap-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <p className="font-editorial text-xl md:text-2xl leading-relaxed text-off-white/40 max-w-xl">
          "There are two religions in Italy. There's the Catholic Church and there's Ferrari."
        </p>
        <div className="hidden md:flex items-center gap-3 shrink-0">
          <div className="h-px w-8 bg-racing-red" />
          <span className="font-body text-[0.6rem] uppercase tracking-[0.3em] text-off-white/22">— Will Buxton</span>
        </div>
      </motion.div>
    </section>
  );
}
