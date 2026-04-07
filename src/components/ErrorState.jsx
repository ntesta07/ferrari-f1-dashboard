export function ErrorState({ message }) {
  return (
    <div className="rounded-[2rem] border border-[var(--color-ferrari)]/22 bg-[var(--color-ferrari)]/8 p-8 text-center">
      <p className="text-[0.72rem] uppercase tracking-[0.34em] text-[var(--color-ferrari)]">System Alert</p>
      <p className="mt-4 text-lg text-white">Ferrari data could not be loaded.</p>
      <p className="mt-3 text-sm leading-7 text-white/58">{message}</p>
    </div>
  );
}
