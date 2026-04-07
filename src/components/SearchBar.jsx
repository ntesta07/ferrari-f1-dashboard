import { Search } from "lucide-react";

export function SearchBar({ value, onChange }) {
  return (
    <label className="relative block">
      <Search
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/25"
        size={16}
      />
      <input
        type="search"
        value={value}
        onChange={onChange}
        placeholder="Search grand prix, driver, circuit..."
        className="search-input pl-11"
      />
    </label>
  );
}
