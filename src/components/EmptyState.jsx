export function EmptyState({ title, message }) {
  return (
    <div className="rounded-[2rem] border border-dashed border-white/12 bg-white/[0.03] p-10 text-center">
      <p className="font-display text-4xl uppercase tracking-[0.08em] text-white">{title}</p>
      <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/56">{message}</p>
    </div>
  );
}
