export function LoadingSkeleton({ rows = 3, className = "" }) {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className="h-24 animate-pulse rounded-[1.75rem] border border-white/[0.06] bg-white/[0.04]"
        />
      ))}
    </div>
  );
}
