/**
 * SectionHeading.jsx — Reusable section header
 *
 * Matches zkatz-website pattern:
 * - Thin racing-red separator line
 * - Large display headline
 * - Optional muted description
 * - fadeInUp spread
 */

import { motion } from 'framer-motion';

// Reusable animation props — spread with {...fadeInUp}
const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.6 },
};

export function SectionHeading({ eyebrow, title, description, align = 'left' }) {
  const centerClass = align === 'center' ? 'text-center mx-auto items-center' : '';

  return (
    <div className={`max-w-3xl ${align === 'center' ? 'mx-auto text-center' : ''}`}>
      {/* Red separator line — exactly as in zkatz */}
      <motion.div
        className={`mb-8 h-px w-16 bg-racing-red ${align === 'center' ? 'mx-auto' : ''}`}
        {...fadeInUp}
      />

      {eyebrow && (
        <motion.p
          className="mb-3 font-body text-xs uppercase tracking-[0.32em] text-off-white/38"
          {...fadeInUp}
          transition={{ duration: 0.6, delay: 0.05 }}
        >
          {eyebrow}
        </motion.p>
      )}

      <motion.h2
        className="font-display uppercase text-off-white leading-[0.9]"
        style={{ fontSize: 'clamp(2.6rem, 5vw, 4.5rem)', letterSpacing: '0.02em' }}
        {...fadeInUp}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        {title}
      </motion.h2>

      {description && (
        <motion.p
          className="mt-5 font-body text-[0.95rem] leading-7 text-off-white/45"
          {...fadeInUp}
          transition={{ duration: 0.6, delay: 0.18 }}
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}
