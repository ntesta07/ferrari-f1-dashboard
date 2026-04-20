/**
 * LoadingScreen.jsx — Ferrari intro overlay with local video background
 * Local /intro.mp4 plays muted/looped behind the text, auto-advances after 6s.
 */

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const INTRO_DURATION = 6000;

export function LoadingScreen({ onDone }) {
  const [started,    setStarted]    = useState(false);
  const [visible,    setVisible]    = useState(true);
  const [videoReady, setVideoReady] = useState(false);
  const timerRef = useRef(null);
  const videoRef = useRef(null);

  // Auto-advance after INTRO_DURATION
  useEffect(() => {
    timerRef.current = setTimeout(() => handleStart(), INTRO_DURATION);
    return () => clearTimeout(timerRef.current);
  }, []);

  // Fade in video after a brief moment
  useEffect(() => {
    const t = setTimeout(() => setVideoReady(true), 400);
    return () => clearTimeout(t);
  }, []);

  function handleStart() {
    if (started) return;
    setStarted(true);
    clearTimeout(timerRef.current);
    setTimeout(() => {
      setVisible(false);
      onDone?.();
    }, 900);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9999] overflow-hidden select-none"
          exit={{ y: '-100%' }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* ── Local video background ──────────────────────────────── */}
          <motion.div
            className="absolute inset-0 z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: videoReady ? 1 : 0 }}
            transition={{ duration: 1.2 }}
          >
            <video
              ref={videoRef}
              src="/intro.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="absolute"
              style={{
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '177.78vh',
                minWidth: '100vw',
                height: '56.25vw',
                minHeight: '100vh',
                objectFit: 'cover',
                pointerEvents: 'none',
              }}
            />
          </motion.div>

          {/* ── Dark overlay so text is always readable ─────────────── */}
          <div className="absolute inset-0 z-10 bg-primary-black/60" />

          {/* ── Vignette edges ──────────────────────────────────────── */}
          <div className="absolute inset-0 z-10"
               style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(16,14,24,0.80) 100%)' }} />

          {/* ── Content ─────────────────────────────────────────────── */}
          <div className="relative z-20 flex h-full flex-col items-center justify-center">

            {/* Ferrari logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="mb-8"
            >
              <img
                src="/logo.png"
                alt="Ferrari"
                className="h-20 w-auto drop-shadow-2xl"
                style={{ imageRendering: 'high-quality' }}
              />
            </motion.div>

            {/* "Scuderia" */}
            <div className="overflow-hidden">
              <motion.p
                className="font-display text-5xl md:text-7xl uppercase tracking-[0.18em] text-off-white leading-none drop-shadow-lg"
                initial={{ y: '105%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                Scuderia
              </motion.p>
            </div>

            {/* "Ferrari" */}
            <div className="overflow-hidden">
              <motion.p
                className="font-display text-5xl md:text-7xl uppercase tracking-[0.18em] text-racing-red leading-none drop-shadow-lg"
                initial={{ y: '105%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 0.8, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
              >
                Ferrari
              </motion.p>
            </div>

          </div>

          {/* ── Red accent line at top ───────────────────────────────── */}
          <div className="absolute top-0 left-0 right-0 h-[2px] z-30 bg-racing-red" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
