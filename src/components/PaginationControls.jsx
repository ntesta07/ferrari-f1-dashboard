export function PaginationControls({ pagination, onPrevious, onNext }) {
  return (
    <div className="mt-6 flex flex-col gap-4 border-t border-off-white/[0.07] pt-5 md:flex-row md:items-center md:justify-between">
      <p className="font-body text-[0.75rem] tabular-nums text-off-white/28">
        Page {pagination.page} of {pagination.totalPages} &mdash; {pagination.totalRows} results
      </p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onPrevious}
          disabled={!pagination.hasPreviousPage}
          className="border border-off-white/12 px-6 py-2.5 font-body text-[0.68rem] uppercase tracking-[0.22em] text-off-white/45 transition enabled:hover:border-off-white/30 enabled:hover:text-off-white disabled:cursor-not-allowed disabled:opacity-25"
        >
          ← Prev
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!pagination.hasNextPage}
          className="bg-racing-red border border-racing-red px-6 py-2.5 font-body text-[0.68rem] uppercase tracking-[0.22em] text-white transition enabled:hover:bg-racing-red-deep disabled:cursor-not-allowed disabled:opacity-25"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
