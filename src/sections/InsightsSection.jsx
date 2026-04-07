import { motion } from "framer-motion";
import { EmptyState } from "../components/EmptyState";
import { ErrorState } from "../components/ErrorState";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { StatCard } from "../components/StatCard";

export function InsightsSection({ insightsState }) {
  const { data, loading, error } = insightsState;

  const insightCards = data
    ? [
        ["Best finish", data.bestFinish.value, data.bestFinish.detail],
        ["Highest-scoring race", data.highestScoringRace.value, data.highestScoringRace.detail],
        ["Average finish", data.averageFinish.value, data.averageFinish.detail],
        ["Strongest driver", data.strongestDriver.value, data.strongestDriver.detail],
      ]
    : [];

  return (
    <section id="insights" className="py-24 md:py-32">
      <div className="site-container">

        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 flex items-center gap-4"
        >
          <span className="section-number">07</span>
          <div className="h-px flex-1 bg-white/8" />
          <span className="text-[0.62rem] uppercase tracking-[0.3em] text-white/25">Season highlights</span>
        </motion.div>

        <div className="mb-10">
          <h2
            className="font-display uppercase text-white leading-[0.88]"
            style={{ fontSize: "clamp(2.8rem, 5vw, 4.5rem)", letterSpacing: "0.02em" }}
          >
            Insights
          </h2>
        </div>

        {loading && <LoadingSkeleton rows={4} className="grid gap-0 md:grid-cols-2 xl:grid-cols-4" />}
        {error && <ErrorState message={error.message} />}

        {!loading && !error && !insightCards.length && (
          <EmptyState
            title="Insights unavailable"
            message="Insight cards will appear after Ferrari race data has been normalized."
          />
        )}

        {!loading && !error && insightCards.length > 0 && (
          <div className="grid md:grid-cols-2 xl:grid-cols-4 divide-x divide-white/8">
            {insightCards.map(([label, value, detail], index) => (
              <div key={label} className="px-0 md:px-8 md:first:pl-0 md:last:pr-0">
                <StatCard label={label} value={value} detail={detail} index={index} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
