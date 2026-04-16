/**
 * StatCard.jsx — Animated stat counter
 *
 * Ported from zkatz-website Stats.jsx animated counter:
 * - requestAnimationFrame with ease-out cubic (1 - (1-t)^3)
 * - useInView({ once: true }) to trigger once on scroll
 * - cancelAnimationFrame cleanup
 * - Big racing-red number + small label
 */

import { motion, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

function AnimatedCounter({ value }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const [count, setCount] = useState(0);

  // Extract numeric part, e.g. "P2" → prefix "P", num 2, suffix ""
  const str   = String(value ?? '');
  const match = str.match(/^([^0-9]*)(\d+(?:\.\d+)?)([^0-9]*)$/);
  const isNum = !!match;
  const target = isNum ? parseFloat(match[2]) : 0;
  const prefix = isNum ? match[1] : '';
  const suffix = isNum ? match[3] : '';

  useEffect(() => {
    if (!isInView || !isNum) return;

    const DURATION = 2000;
    const start = performance.now();
    let rafId;

    const step = (now) => {
      const progress = Math.min((now - start) / DURATION, 1);
      // Ease-out cubic — starts fast, decelerates to a satisfying stop
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [isInView, isNum, target]);

  if (!isNum) return <span ref={ref}>{value}</span>;
  return <span ref={ref}>{prefix}{count}{suffix}</span>;
}

export function StatCard({ label, value, detail, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="group border-t border-off-white/[0.08] pt-6 pb-8 transition-colors hover:border-racing-red"
    >
      <p className="mb-4 font-body text-[0.63rem] uppercase tracking-[0.3em] text-off-white/35">{label}</p>
      <p
        className="font-display uppercase leading-none text-racing-red"
        style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', letterSpacing: '0.02em' }}
      >
        <AnimatedCounter value={value} />
      </p>
      {detail && (
        <p className="mt-4 font-body text-[0.82rem] leading-6 text-off-white/30 max-w-[26ch]">{detail}</p>
      )}
    </motion.div>
  );
}
