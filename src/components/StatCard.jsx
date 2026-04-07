import { motion } from "framer-motion";

export function StatCard({ label, value, detail, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className="group border-t border-white/8 pt-6 pb-8 transition-colors hover:border-[var(--color-ferrari)]"
    >
      <p className="mb-4 text-[0.63rem] uppercase tracking-[0.3em] text-white/35">{label}</p>
      <p
        className="font-display uppercase leading-none text-white group-hover:text-[var(--color-ferrari)] transition-colors"
        style={{ fontSize: "clamp(3.5rem, 6vw, 5.5rem)", letterSpacing: "0.02em" }}
      >
        {value}
      </p>
      {detail && (
        <p className="mt-4 text-[0.82rem] leading-6 text-white/30 max-w-[24ch]">{detail}</p>
      )}
    </motion.div>
  );
}
