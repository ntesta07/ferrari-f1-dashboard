import { motion } from "framer-motion";
import { ErrorState } from "../components/ErrorState";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { SectionHeading } from "../components/SectionHeading";
import { StatCard } from "../components/StatCard";

export function OverviewStats({ overviewState }) {
  const { data, loading, error } = overviewState;

  const cards = data
    ? [
        ["Standing", `P${data.standing}`, "Constructor championship rank"],
        ["Points", data.points, "Total points this season"],
        ["Wins", data.wins, "Race victories"],
        ["Podiums", data.podiums, "Combined podium finishes"],
        ["Rounds", data.racesProcessed, "Races processed"],
        ["Points Leader", data.leadingDriver, "Ferrari's top scorer"],
      ]
    : [];

  return (
    <section id="performance" className="py-24 md:py-32">
      <div className="site-container">

        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 flex items-center gap-4"
        >
          <span className="section-number">02</span>
          <div className="h-px flex-1 bg-white/8" />
          <span className="text-[0.62rem] uppercase tracking-[0.3em] text-white/25">Performance</span>
        </motion.div>

        <SectionHeading
          eyebrow="Season overview"
          title="By the numbers"
          description="Constructor standings, points haul, and race-by-race execution condensed into headline figures."
        />

        <div className="mt-12">
          {loading && <LoadingSkeleton rows={6} className="grid gap-0 md:grid-cols-3" />}
          {error && <ErrorState message={error.message} />}

          {!loading && !error && (
            <div className="grid md:grid-cols-2 xl:grid-cols-3">
              {cards.map(([label, value, detail], index) => (
                <div key={label} className="px-0 md:px-8 first:pl-0 md:[&:nth-child(3n+1)]:pl-0 md:[&:nth-child(3n)]:pr-0 border-r border-white/8 md:[&:nth-child(3n)]:border-r-0 last:border-r-0">
                  <StatCard label={label} value={value} detail={detail} index={index} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
