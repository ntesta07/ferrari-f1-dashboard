/**
 * LoadingScreen.jsx — Ferrari-branded intro overlay
 *
 * Ported from zkatz-website LoadingScreen pattern:
 * - Shows a full-screen black overlay
 * - "Scuderia" (off-white) + "Ferrari" (racing-red) animate in
 * - User clicks or it auto-advances after 2.8s
 * - Slides UP to reveal the site beneath (AnimatePresence exit)
 */

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const INTRO_DURATION = 2800; // ms before auto-advance

export function LoadingScreen({ onDone }) {
  const [started, setStarted] = useState(false);
  const [visible, setVisible] = useState(true);
  const timerRef = useRef(null);

  // Auto-advance after INTRO_DURATION
  useEffect(() => {
    timerRef.current = setTimeout(() => handleStart(), INTRO_DURATION);
    return () => clearTimeout(timerRef.current);
  }, []);

  function handleStart() {
    if (started) return;
    setStarted(true);
    clearTimeout(timerRef.current);
    // Small delay lets exit animation begin before we signal done
    setTimeout(() => {
      setVisible(false);
      onDone?.();
    }, 850);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-primary-black cursor-pointer select-none"
          // Exit: slide up (same as zkatz)
          exit={{ y: '-100%' }}
          transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
          onClick={handleStart}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleStart(); }}
          role="button"
          tabIndex={0}
          aria-label="Click to enter the Ferrari dashboard"
        >
          {/* Ferrari shield */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <svg width="42" height="52" viewBox="0 0 22 28" fill="none">
              <path d="M0 0h22v18L11 28 0 18V0z" fill="#ff2800" />
              <path d="M4 7h3V4h2v3h4V4h2v3h3v2h-3v4h-2V9H9v4H7V9H4V7z" fill="#f4eee4" />
            </svg>
          </motion.div>

          {/* "Scuderia" */}
          <div className="overflow-hidden">
            <motion.p
              className="font-display text-5xl md:text-7xl uppercase tracking-[0.18em] text-off-white leading-none"
              initial={{ y: '100%' }}
              animate={{ y: '0%' }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              Scuderia
            </motion.p>
          </div>

          {/* "Ferrari" */}
          <div className="overflow-hidden">
            <motion.p
              className="font-display text-5xl md:text-7xl uppercase tracking-[0.18em] text-racing-red leading-none"
              initial={{ y: '100%' }}
              animate={{ y: '0%' }}
              transition={{ duration: 0.7, delay: 0.42, ease: [0.22, 1, 0.36, 1] }}
            >
              Ferrari
            </motion.p>
          </div>

          {/* Click prompt */}
          <motion.p
            className="absolute bottom-10 font-body text-xs uppercase tracking-[0.32em] text-off-white/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            Click anywhere to continue
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
