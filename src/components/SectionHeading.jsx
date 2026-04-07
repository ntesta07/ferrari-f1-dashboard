import { motion } from "framer-motion";

export function SectionHeading({ eyebrow, title, description, align = "left", number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={`${align === "center" ? "text-center mx-auto" : ""} max-w-3xl`}
    >
      <div className={`mb-5 flex items-center gap-4 ${align === "center" ? "justify-center" : ""}`}>
        {number && (
          <span className="font-body text-[0.62rem] text-[var(--color-ferrari)] tabular-nums" style={{ letterSpacing: "0.2em" }}>
            {number}
          </span>
        )}
        {number && <div className="h-px w-8 bg-[var(--color-ferrari)]" />}
        <span className="text-[0.65rem] uppercase tracking-[0.32em] text-white/38">{eyebrow}</span>
      </div>

      <h2
        className="font-display uppercase text-white leading-[0.88]"
        style={{ fontSize: "clamp(2.8rem, 5vw, 4.5rem)", letterSpacing: "0.02em" }}
      >
        {title}
      </h2>

      {description && (
        <p className="mt-5 text-[0.95rem] leading-7 text-white/45 max-w-xl">
          {description}
        </p>
      )}
    </motion.div>
  );
}
