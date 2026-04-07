import { AnimatePresence, motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const navItems = [
  { label: "Team", href: "#team" },
  { label: "Stats", href: "#performance" },
  { label: "Drivers", href: "#drivers" },
  { label: "Results", href: "#results" },
  { label: "Chart", href: "#chart" },
  { label: "Insights", href: "#insights" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 60));

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-colors duration-300"
      style={{ background: scrolled ? "rgba(10,10,10,0.96)" : "transparent", borderBottom: scrolled ? "1px solid rgba(255,255,255,0.07)" : "none", backdropFilter: scrolled ? "blur(12px)" : "none" }}
    >
      <div className="site-container flex h-16 items-center justify-between">
        {/* Logo */}
        <a href="#hero" className="flex items-center gap-3 group">
          <div className="flex items-center gap-2">
            {/* Ferrari shield SVG */}
            <svg width="22" height="28" viewBox="0 0 22 28" fill="none">
              <path d="M0 0h22v18L11 28 0 18V0z" fill="#ff2800" />
              <path d="M4 7h3V4h2v3h4V4h2v3h3v2h-3v4h-2V9H9v4H7V9H4V7z" fill="white" />
            </svg>
            <span className="font-display text-xl uppercase tracking-[0.18em] text-white">Scuderia Ferrari</span>
          </div>
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-[0.72rem] uppercase tracking-[0.22em] text-white/50 transition-colors hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Live indicator */}
        <div className="hidden items-center gap-2 lg:flex">
          <span
            className="h-1.5 w-1.5 rounded-full bg-[var(--color-ferrari)]"
            style={{ animation: "pulse-dot 2s ease-in-out infinite" }}
          />
          <span className="text-[0.65rem] uppercase tracking-[0.28em] text-white/35">Live season</span>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setOpen((s) => !s)}
          className="grid h-10 w-10 place-items-center text-white/70 lg:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile nav */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-white/8 bg-[#0a0a0a]"
          >
            <div className="site-container py-6 flex flex-col gap-1">
              {navItems.map((item, i) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => setOpen(false)}
                  className="py-3 text-sm uppercase tracking-[0.22em] text-white/60 border-b border-white/5 transition-colors hover:text-white"
                >
                  {item.label}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
