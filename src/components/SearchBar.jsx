import { Search } from 'lucide-react';

export function SearchBar({ value, onChange, isRegex, onRegexToggle, boolMode, onBoolToggle }) {
  return (
    <div className="flex gap-2">
      {/* Search input */}
      <label className="relative flex-1 block">
        <Search
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-off-white/25"
          size={15}
        />
        <input
          type="search"
          value={value}
          onChange={onChange}
          placeholder={isRegex ? 'Regex pattern…' : 'Search grand prix, driver, circuit…'}
          className="search-input pl-10"
        />
      </label>

      {/* Regex toggle */}
      <button
        type="button"
        onClick={onRegexToggle}
        title={isRegex ? 'Regex ON — click to switch to plain text' : 'Click to enable regex search'}
        className={`shrink-0 border px-3 font-body text-[0.68rem] tracking-wide transition-all duration-150 ${
          isRegex
            ? 'border-racing-red bg-racing-red/10 text-racing-red'
            : 'border-off-white/10 text-off-white/35 hover:border-off-white/25 hover:text-off-white/60'
        }`}
        style={{ fontFamily: 'monospace', letterSpacing: 0 }}
      >
        .*
      </button>

      {/* AND / OR toggle — only meaningful in plain-text mode */}
      {!isRegex && (
        <div className="flex shrink-0 border border-off-white/10 overflow-hidden">
          {['and', 'or'].map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => onBoolToggle(mode)}
              className={`px-3 py-0 font-body text-[0.62rem] uppercase tracking-[0.18em] transition-all duration-150 ${
                boolMode === mode
                  ? 'bg-racing-red text-white'
                  : 'text-off-white/35 hover:text-off-white/60'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
