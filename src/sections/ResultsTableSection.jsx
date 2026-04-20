/**
 * ResultsTableSection.jsx — Chapter 04
 */

import { motion, AnimatePresence } from 'framer-motion';
import { startTransition, useDeferredValue, useState } from 'react';
import { useFerrariData } from '../app/useFerrariData';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { PaginationControls } from '../components/PaginationControls';
import { SearchBar } from '../components/SearchBar';

const COLS = [
  { key: 'round',    label: 'Rd',        cls: 'w-10' },
  { key: 'grandPrix', label: 'Grand Prix', cls: 'min-w-[160px]' },
  { key: 'circuit',  label: 'Circuit',    cls: 'min-w-[140px] hidden md:table-cell' },
  { key: 'date',     label: 'Date',       cls: 'hidden lg:table-cell' },
  { key: 'driver',   label: 'Driver',     cls: '' },
  { key: 'grid',     label: 'Grid',       cls: 'text-center hidden sm:table-cell' },
  { key: 'finish',   label: 'Finish',     cls: 'text-center' },
  { key: 'points',   label: 'Pts',        cls: 'text-right' },
];

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.6 },
};

// Color-code finish positions
function FinishBadge({ value }) {
  const num = parseInt(value, 10);
  const isWin    = num === 1;
  const isPodium = num <= 3 && num > 1;
  const isDNF    = isNaN(num);

  let style = 'font-display tabular-nums text-off-white/60';
  let label = value;

  if (isWin) {
    style = 'font-display tabular-nums text-racing-red font-bold';
    label = 'P1';
  } else if (isPodium) {
    style = 'font-display tabular-nums text-off-white';
    label = `P${num}`;
  } else if (!isDNF && num <= 10) {
    style = 'font-display tabular-nums text-off-white/75';
    label = `P${num}`;
  }

  return (
    <span className={style} style={{ letterSpacing: '0.04em' }}>
      {label}
    </span>
  );
}

// Show arrow if gained/lost positions vs grid
function Delta({ grid, finish }) {
  const g = parseInt(grid, 10);
  const f = parseInt(finish, 10);
  if (isNaN(g) || isNaN(f)) return null;
  const diff = g - f; // positive = gained
  if (diff === 0) return <span className="text-off-white/20 text-xs">—</span>;
  return (
    <span className={`text-[0.65rem] font-body ${diff > 0 ? 'text-emerald-400/70' : 'text-red-400/70'}`}>
      {diff > 0 ? `▲${diff}` : `▼${Math.abs(diff)}`}
    </span>
  );
}

function ResultRow({ row, index }) {
  const isWin = parseInt(row.finish, 10) === 1;

  return (
    <motion.tr
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay: index * 0.03, ease: [0.22, 1, 0.36, 1] }}
      className={`group border-b border-off-white/[0.04] transition-colors hover:bg-racing-red/[0.04] ${isWin ? 'bg-racing-red/[0.03]' : ''}`}
    >
      {/* Round */}
      <td className="px-4 py-4 font-body text-xs text-off-white/25 tabular-nums">{row.round}</td>

      {/* Grand Prix */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-2">
          {isWin && <span className="h-1.5 w-1.5 rounded-full bg-racing-red shrink-0" />}
          <span className="font-body text-sm font-medium text-off-white group-hover:text-off-white transition-colors">
            {row.grandPrix.replace(' Grand Prix', ' GP')}
          </span>
        </div>
      </td>

      {/* Circuit */}
      <td className="hidden md:table-cell px-4 py-4 font-body text-xs text-off-white/40">{row.circuit}</td>

      {/* Date */}
      <td className="hidden lg:table-cell px-4 py-4 font-body text-xs text-off-white/30 tabular-nums">{row.date}</td>

      {/* Driver */}
      <td className="px-4 py-4">
        <span className="font-body text-sm text-off-white/70">{row.driver.split(' ').pop()}</span>
      </td>

      {/* Grid + delta */}
      <td className="hidden sm:table-cell px-4 py-4 text-center">
        <div className="flex flex-col items-center gap-0.5">
          <span className="font-body text-xs text-off-white/35 tabular-nums">{row.grid}</span>
          <Delta grid={row.grid} finish={row.finish} />
        </div>
      </td>

      {/* Finish */}
      <td className="px-4 py-4 text-center">
        <FinishBadge value={row.finish} />
      </td>

      {/* Points */}
      <td className="px-4 py-4 text-right">
        <span className={`font-display tabular-nums ${row.points > 0 ? 'text-racing-red' : 'text-off-white/20'}`}
              style={{ fontSize: '1.1rem', letterSpacing: '0.02em' }}>
          {row.points > 0 ? row.points : '—'}
        </span>
      </td>
    </motion.tr>
  );
}

export function ResultsTableSection() {
  const [search,   setSearch]   = useState('');
  const [page,     setPage]     = useState(1);
  const [limit,    setLimit]    = useState(20);
  const [isRegex,  setIsRegex]  = useState(false);
  const [boolMode, setBoolMode] = useState('and');
  const deferred = useDeferredValue(search);

  const resultsState = useFerrariData(
    `/ferrari/results?page=${page}&limit=${limit}&search=${encodeURIComponent(deferred)}&regex=${isRegex}&bool=${boolMode}`
  );

  const handleChange = (e) => {
    startTransition(() => { setSearch(e.target.value); setPage(1); });
  };

  const handleLimitChange = (newLimit) => {
    startTransition(() => { setLimit(newLimit); setPage(1); });
  };

  const handleBoolToggle = (mode) => {
    startTransition(() => { setBoolMode(mode); setPage(1); });
  };

  const handleRegexToggle = () => {
    startTransition(() => { setIsRegex(v => !v); setPage(1); });
  };

  const totalPages = resultsState.data?.pagination?.totalPages ?? 1;

  const rows       = resultsState.data?.rows || [];
  const pagination = resultsState.data?.pagination;

  // Quick summary stats from current page
  const pageWins   = rows.filter(r => parseInt(r.finish, 10) === 1).length;
  const pagePts    = rows.reduce((s, r) => s + (r.points || 0), 0);

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

      {/* Header row */}
      <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <motion.h2
          className="font-display uppercase text-off-white leading-[0.9]"
          style={{ fontSize: 'clamp(2.6rem, 5vw, 4.5rem)', letterSpacing: '0.02em' }}
          {...fadeInUp}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Race <span className="text-racing-red">Results</span>
        </motion.h2>
        <motion.div
          className="w-full max-w-xl"
          {...fadeInUp}
          transition={{ duration: 0.6, delay: 0.18 }}
        >
          <SearchBar
            value={search}
            onChange={handleChange}
            isRegex={isRegex}
            onRegexToggle={handleRegexToggle}
            boolMode={boolMode}
            onBoolToggle={handleBoolToggle}
          />
        </motion.div>
      </div>

      {resultsState.loading && <LoadingSkeleton rows={5} />}
      {resultsState.error   && <ErrorState message={resultsState.error.message} />}

      {!resultsState.loading && !resultsState.error && !rows.length && (
        <EmptyState title="No results match" message="Try broadening your search." />
      )}

      {!resultsState.loading && !resultsState.error && rows.length > 0 && (
        <motion.div {...fadeInUp} transition={{ duration: 0.6, delay: 0.2 }}>

          {/* Table */}
          <div className="overflow-x-auto border border-off-white/[0.07] bg-surface">
            {/* Legend strip */}
            <div className="flex items-center gap-6 border-b border-off-white/[0.05] px-4 py-2.5">
              <span className="flex items-center gap-1.5 font-body text-[0.58rem] uppercase tracking-[0.22em] text-off-white/30">
                <span className="h-1.5 w-1.5 rounded-full bg-racing-red" /> Win
              </span>
              <span className="font-body text-[0.58rem] uppercase tracking-[0.22em] text-off-white/30">
                ▲ Positions gained&nbsp;&nbsp;▼ Lost
              </span>
              <span className="ml-auto font-body text-[0.58rem] uppercase tracking-[0.22em] text-off-white/20">
                {rows.length} entries · {pageWins} win{pageWins !== 1 ? 's' : ''} · {pagePts} pts shown
              </span>
            </div>

            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-off-white/[0.07]">
                  {COLS.map((c) => (
                    <th key={c.key}
                        className={`px-4 py-3 font-body text-[0.6rem] uppercase tracking-[0.24em] text-off-white/30 font-normal text-left ${c.cls}`}>
                      {c.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="wait">
                  {rows.map((row, i) => (
                    <ResultRow key={row.id} row={row} index={i} />
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          <PaginationControls
            pagination={pagination}
            onFirst={    () => setPage(1)}
            onPrevious={ () => setPage((p) => Math.max(1, p - 1))}
            onNext={     () => setPage((p) => pagination?.hasNextPage ? p + 1 : p)}
            onLast={     () => setPage(totalPages)}
            limit={limit}
            onLimitChange={handleLimitChange}
          />
        </motion.div>
      )}
    </section>
  );
}
