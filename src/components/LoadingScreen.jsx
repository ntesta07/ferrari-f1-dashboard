/**
 * LoadingScreen.jsx — Ferrari intro overlay with YouTube background
 * YouTube video plays muted/looped behind the text.
 * Click anywhere to enter — slides the whole screen upward.
 */

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const VIDEO_ID       = 'mLkFAJyu3tI';
const INTRO_DURATION = 6000;
const LOOP_END       = 50; // seconds

export function LoadingScreen({ onDone }) {
  const [started, setStarted] = useState(false);
  const [visible, setVisible] = useState(true);
  const [videoReady, setVideoReady] = useState(false);
  const timerRef    = useRef(null);
  const playerRef   = useRef(null);
  const playerDivId = 'yt-intro-player';

  useEffect(() => {
    timerRef.current = setTimeout(() => handleStart(), INTRO_DURATION);
    return () => clearTimeout(timerRef.current);
  }, []);

  // Fade in video after brief moment
  useEffect(() => {
    const t = setTimeout(() => setVideoReady(true), 600);
    return () => clearTimeout(t);
  }, []);

  // Load YouTube IFrame API + create player with 0–50s loop
  useEffect(() => {
    function createPlayer() {
      playerRef.current = new window.YT.Player(playerDivId, {
        videoId: VIDEO_ID,
        playerVars: {
          autoplay:        1,
          mute:            1,
          controls:        0,
          rel:             0,
          showinfo:        0,
          modestbranding:  1,
          iv_load_policy:  3,
          disablekb:       1,
          playsinline:     1,
          start:           0,
          end:             LOOP_END,
        },
        events: {
          onStateChange(e) {
            // YT.PlayerState.ENDED = 0 — seek back to start and keep playing
            if (e.data === 0) {
              e.target.seekTo(0);
              e.target.playVideo();
            }
          },
        },
      });
    }

    if (window.YT && window.YT.Player) {
      createPlayer();
    } else {
      // Script not loaded yet — attach to the global callback
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        prev?.();
        createPlayer();
      };

      if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(tag);
      }
    }

    return () => {
      try { playerRef.current?.destroy(); } catch (_) {}
    };
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

  // No click interaction — purely automatic

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9999] overflow-hidden select-none"
          exit={{ y: '-100%' }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* ── YouTube background ──────────────────────────────────── */}
          <motion.div
            className="absolute inset-0 z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: videoReady ? 1 : 0 }}
            transition={{ duration: 1.2 }}
          >
            {/* YT IFrame API mounts here — oversized to fill viewport without letterboxing */}
            <div
              id={playerDivId}
              className="absolute"
              style={{
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '177.78vh',
                minWidth: '100vw',
                height: '56.25vw',
                minHeight: '100vh',
              }}
            />
            {/* Transparent shield — sits on top of the iframe and swallows all
                pointer events so YouTube never shows its pause/hover UI */}
            <div className="absolute inset-0" style={{ pointerEvents: 'all' }} />
          </motion.div>

          {/* ── Dark overlay so text is always readable ─────────────── */}
          <div className="absolute inset-0 z-10 bg-primary-black/60" />

          {/* ── Red vignette edges ──────────────────────────────────── */}
          <div className="absolute inset-0 z-10"
               style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(10,0,0,0.75) 100%)' }} />

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
