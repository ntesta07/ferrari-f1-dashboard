/**
 * ResultsTableSection.jsx — Chapter 04
 * zkatz patterns: ghost chapter number, red line, fadeInUp heading
 */

import { motion } from 'framer-motion';
import { startTransition, useDeferredValue, useState } from 'react';
import { useFerrariData } from '../app/useFerrariData';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { PaginationControls } from '../components/PaginationControls';
import { SearchBar } from '../components/SearchBar';

const COLS = ['Rd', 'Grand Prix', 'Circuit', 'Date', 'Driver', 'Grid', 'Finish', 'Pts'];

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.6 },
};

export function ResultsTableSection() {
  const [search, setSearch] = useState('');
  const [page,   setPage]   = useState(1);
  const deferred = useDeferredValue(search);

  const resultsState = useFerrariData(
    `/ferrari/results?page=${page}&limit=20&search=${encodeURIComponent(deferred)}`
  );

  const handleChange = (e) => {
    startTransition(() => { setSearch(e.target.value); setPage(1); });
  };

  const rows       = resultsState.data?.rows || [];
  const pagination = resultsState.data?.pagination;

  return (
    <section
      id="results"
      className="relative px-6 py-24 md:px-12 lg:px-24 md:py-32 bg-primary-black"
    >
      {/* Ghost chapter number */}
      <motion.span
        className="pointer-events-none absolute right-8 top-8 select-none font-display leading-none text-off-white/[0.03] md:right-16"
        style={{ fontSize: 'clamp(6rem, 14vw, 12rem)' }}
        initial={{ opacity: 0, x: 80 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        04
      </motion.span>

      {/* Red line */}
      <motion.div className="mb-12 h-px w-16 bg-racing-red" {...fadeInUp} />

      <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <motion.h2
          className="font-display uppercase text-off-white leading-[0.9]"
          style={{ fontSize: 'clamp(2.6rem, 5vw, 4.5rem)', letterSpacing: '0.02em' }}
          {...fadeInUp}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Results
        </motion.h2>
        <motion.div
          className="w-full max-w-sm"
          {...fadeInUp}
          transition={{ duration: 0.6, delay: 0.18 }}
        >
          <SearchBar value={search} onChange={handleChange} />
        </motion.div>
      </div>

      {resultsState.loading && <LoadingSkeleton rows={5} />}
      {resultsState.error   && <ErrorState message={resultsState.error.message} />}

      {!resultsState.loading && !resultsState.error && !rows.length && (
        <EmptyState title="No results match" message="Try broadening your search." />
      )}

      {!resultsState.loading && !resultsState.error && rows.length > 0 && (
        <motion.div
          {...fadeInUp}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="overflow-x-auto border border-off-white/[0.07]">
            <table className="data-table">
              <thead>
                <tr>{COLS.map((c) => <th key={c}>{c}</th>)}</tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id}>
                    <td className="text-off-white/28 tabular-nums">{row.round}</td>
                    <td className="font-medium text-off-white">{row.grandPrix}</td>
                    <td>{row.circuit}</td>
                    <td className="tabular-nums">{row.date}</td>
                    <td>{row.driver}</td>
                    <td className="tabular-nums">{row.grid}</td>
                    <td className="tabular-nums">{row.finish}</td>
                    <td className="tabular-nums font-semibold text-racing-red">{row.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <PaginationControls
            pagination={pagination}
            onPrevious={() => setPage((p) => Math.max(1, p - 1))}
            onNext={()     => setPage((p) => pagination?.hasNextPage ? p + 1 : p)}
          />
        </motion.div>
      )}
    </section>
  );
}
