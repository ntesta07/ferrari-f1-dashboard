import { motion } from "framer-motion";
import { startTransition, useDeferredValue, useState } from "react";
import { useFerrariData } from "../app/useFerrariData";
import { EmptyState } from "../components/EmptyState";
import { ErrorState } from "../components/ErrorState";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { PaginationControls } from "../components/PaginationControls";
import { SearchBar } from "../components/SearchBar";

const COLS = ["Rd", "Grand Prix", "Circuit", "Date", "Driver", "Grid", "Finish", "Pts"];

export function ResultsTableSection() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const deferredSearch = useDeferredValue(search);
  const resultsState = useFerrariData(
    `/ferrari/results?page=${page}&limit=20&search=${encodeURIComponent(deferredSearch)}`
  );

  const handleSearchChange = (e) => {
    startTransition(() => {
      setSearch(e.target.value);
      setPage(1);
    });
  };

  const rows = resultsState.data?.rows || [];
  const pagination = resultsState.data?.pagination;

  return (
    <section id="results" className="py-24 md:py-32">
      <div className="site-container">

        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 flex items-center gap-4"
        >
          <span className="section-number">04</span>
          <div className="h-px flex-1 bg-white/8" />
          <span className="text-[0.62rem] uppercase tracking-[0.3em] text-white/25">Race archive</span>
        </motion.div>

        <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <h2
            className="font-display uppercase text-white leading-[0.88]"
            style={{ fontSize: "clamp(2.8rem, 5vw, 4.5rem)", letterSpacing: "0.02em" }}
          >
            Results
          </h2>
          <div className="w-full max-w-sm">
            <SearchBar value={search} onChange={handleSearchChange} />
          </div>
        </div>

        {resultsState.loading && <LoadingSkeleton rows={5} />}
        {resultsState.error && <ErrorState message={resultsState.error.message} />}

        {!resultsState.loading && !resultsState.error && !rows.length && (
          <EmptyState
            title="No results match"
            message="Try broadening your search."
          />
        )}

        {!resultsState.loading && !resultsState.error && rows.length > 0 && (
          <>
            <div className="overflow-x-auto border border-white/8">
              <table className="data-table">
                <thead>
                  <tr>
                    {COLS.map((col) => (
                      <th key={col}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id} className="group">
                      <td className="text-white/35 tabular-nums">{row.round}</td>
                      <td className="font-medium text-white">{row.grandPrix}</td>
                      <td>{row.circuit}</td>
                      <td className="tabular-nums">{row.date}</td>
                      <td>{row.driver}</td>
                      <td className="tabular-nums">{row.grid}</td>
                      <td className="tabular-nums">{row.finish}</td>
                      <td className="tabular-nums font-semibold text-[var(--color-ferrari)]">{row.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <PaginationControls
              pagination={pagination}
              onPrevious={() => setPage((p) => Math.max(1, p - 1))}
              onNext={() => setPage((p) => (pagination?.hasNextPage ? p + 1 : p))}
            />
          </>
        )}
      </div>
    </section>
  );
}
