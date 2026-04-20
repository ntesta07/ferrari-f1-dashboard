const PAGE_SIZES = [10, 20, 50];

const btnBase =
  'border px-3 py-2.5 font-body text-[0.65rem] uppercase tracking-[0.18em] transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-25';
const btnGhost  = `${btnBase} border-off-white/12 text-off-white/45 enabled:hover:border-off-white/30 enabled:hover:text-off-white`;
const btnActive = `${btnBase} border-racing-red bg-racing-red text-white enabled:hover:bg-racing-red-deep`;

export function PaginationControls({ pagination, onFirst, onPrevious, onNext, onLast, limit, onLimitChange }) {
  const { page, totalPages, totalRows } = pagination;

  return (
    <div className="mt-6 flex flex-col gap-4 border-t border-off-white/[0.07] pt-5 md:flex-row md:items-center md:justify-between">

      {/* Left: info + rows-per-page */}
      <div className="flex flex-wrap items-center gap-4">
        <p className="font-body text-[0.72rem] tabular-nums text-off-white/28">
          Page <span className="text-off-white/50">{page}</span> of{' '}
          <span className="text-off-white/50">{totalPages}</span>
          &ensp;·&ensp;
          <span className="text-off-white/50">{totalRows}</span> results
        </p>

        {/* Rows per page */}
        <div className="flex items-center gap-2">
          <span className="font-body text-[0.62rem] uppercase tracking-[0.2em] text-off-white/28">Rows</span>
          <div className="flex border border-off-white/10 overflow-hidden">
            {PAGE_SIZES.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => onLimitChange(size)}
                className={`px-3 py-1.5 font-body text-[0.62rem] tracking-wide transition-all duration-150 ${
                  limit === size
                    ? 'bg-racing-red text-white'
                    : 'text-off-white/35 hover:text-off-white/60'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right: navigation */}
      <div className="flex gap-2">
        {/* Jump to beginning */}
        <button type="button" onClick={onFirst} disabled={!pagination.hasPreviousPage} className={btnGhost} title="First page">
          ⟨⟨
        </button>

        {/* Previous */}
        <button type="button" onClick={onPrevious} disabled={!pagination.hasPreviousPage} className={btnGhost}>
          ← Prev
        </button>

        {/* Next */}
        <button type="button" onClick={onNext} disabled={!pagination.hasNextPage} className={btnActive}>
          Next →
        </button>

        {/* Jump to end */}
        <button type="button" onClick={onLast} disabled={!pagination.hasNextPage} className={btnGhost} title="Last page">
          ⟩⟩
        </button>
      </div>
    </div>
  );
}
