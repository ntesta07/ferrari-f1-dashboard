export function PaginationControls({ pagination, onPrevious, onNext }) {
  return (
    <div className="mt-6 flex flex-col gap-4 border-t border-white/8 pt-5 md:flex-row md:items-center md:justify-between">
      <p className="text-[0.78rem] text-white/30 tabular-nums">
        Page {pagination.page} of {pagination.totalPages} &mdash; {pagination.totalRows} results
      </p>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onPrevious}
          disabled={!pagination.hasPreviousPage}
          className="border border-white/12 px-6 py-2.5 text-[0.7rem] uppercase tracking-[0.22em] text-white/50 transition enabled:hover:border-white/30 enabled:hover:text-white disabled:cursor-not-allowed disabled:opacity-25"
        >
          ← Prev
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!pagination.hasNextPage}
          className="border border-[var(--color-ferrari)] bg-[var(--color-ferrari)] px-6 py-2.5 text-[0.7rem] uppercase tracking-[0.22em] text-white transition enabled:hover:bg-[var(--color-ferrari-deep)] disabled:cursor-not-allowed disabled:opacity-25"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
