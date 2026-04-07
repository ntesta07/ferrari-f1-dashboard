const footerLinks = [
  { label: "Team", href: "#team" },
  { label: "Stats", href: "#performance" },
  { label: "Drivers", href: "#drivers" },
  { label: "Results", href: "#results" },
  { label: "Chart", href: "#chart" },
  { label: "Insights", href: "#insights" },
];

export function Footer() {
  return (
    <footer className="border-t border-white/8 py-12">
      <div className="site-container">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <svg width="18" height="22" viewBox="0 0 22 28" fill="none">
                <path d="M0 0h22v18L11 28 0 18V0z" fill="#ff2800" />
                <path d="M4 7h3V4h2v3h4V4h2v3h3v2h-3v4h-2V9H9v4H7V9H4V7z" fill="white" />
              </svg>
              <p className="font-display text-2xl uppercase tracking-[0.14em] text-white">Scuderia Ferrari</p>
            </div>
            <p className="text-[0.68rem] uppercase tracking-[0.28em] text-white/25">
              Ferrari, translated into data.
            </p>
          </div>

          {/* Nav */}
          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {footerLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[0.68rem] uppercase tracking-[0.22em] text-white/30 transition-colors hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 border-t border-white/8 pt-6 flex items-center justify-between text-[0.62rem] uppercase tracking-[0.22em] text-white/18">
          <span>Hack4Impact BU · 2025</span>
          <a href="#hero" className="transition-colors hover:text-white/50">Back to top ↑</a>
        </div>
      </div>
    </footer>
  );
}
