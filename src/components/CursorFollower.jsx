/**
 * CursorFollower.jsx — Custom spring cursor
 *
 * Ported directly from zkatz-website CursorFollower.jsx:
 * - Only renders on pointer-fine (mouse) devices
 * - useMotionValue + useSpring for smooth lag-based tracking
 * - Scales up when hovering links / buttons / [data-hover]
 * - mix-blend-difference so it stays visible on any background
 * - Racing red circle, 32px, 2px border
 */

import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';

export function CursorFollower() {
  // Bail out on touch devices — no cursor to follow
  const hasMouse =
    typeof window !== 'undefined' &&
    window.matchMedia('(pointer: fine)').matches;

  const [hovered, setHovered] = useState(false);

  // useMotionValue avoids re-renders on every mouse move
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Spring wrapping makes motion feel physical instead of instant
  const springX = useSpring(mouseX, { stiffness: 500, damping: 28 });
  const springY = useSpring(mouseY, { stiffness: 500, damping: 28 });

  useEffect(() => {
    if (!hasMouse) return;

    const onMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const onEnter = (e) => {
      if (e.target.closest('a, button, [data-hover]')) setHovered(true);
    };
    const onLeave = (e) => {
      if (e.target.closest('a, button, [data-hover]')) setHovered(false);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onEnter);
    window.addEventListener('mouseout', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onEnter);
      window.removeEventListener('mouseout', onLeave);
    };
  }, [hasMouse, mouseX, mouseY]);

  if (!hasMouse) return null;

  return (
    <motion.div
      className="pointer-events-none fixed z-[9998] h-8 w-8 rounded-full border-2 border-racing-red"
      style={{
        x: springX,
        y: springY,
        translateX: '-50%',
        translateY: '-50%',
        mixBlendMode: 'difference',
        scale: hovered ? 1.5 : 1,
        transition: 'scale 200ms ease',
      }}
    />
  );
}
