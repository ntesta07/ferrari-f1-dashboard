/**
 * CircuitSection.jsx — Chapter 07  "The Circuits"
 * Replaces GallerySection with live per-circuit race data.
 * Features: sort, driver filter, search, expand details, animated cards,
 *           circuit facts, points bar, featured best-race banner.
 */

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo } from 'react';
import { MapPin, Calendar, ChevronDown, ChevronUp, Trophy, Search, Gauge, CornerDownRight, Wind } from 'lucide-react';
import { EmptyState }     from '../components/EmptyState';
import { ErrorState }     from '../components/ErrorState';
import { LoadingSkeleton } from '../components/LoadingSkeleton';

// ── Country → flag emoji ──────────────────────────────────────────────
const FLAGS = {
  Australia: '🇦🇺', China: '🇨🇳', Japan: '🇯🇵', Bahrain: '🇧🇭',
  'Saudi Arabia': '🇸🇦', 'United States': '🇺🇸', USA: '🇺🇸',
  Italy: '🇮🇹', 'United Kingdom': '🇬🇧', 'Great Britain': '🇬🇧',
  Monaco: '🇲🇨', Spain: '🇪🇸', Canada: '🇨🇦', Austria: '🇦🇹',
  France: '🇫🇷', Hungary: '🇭🇺', Belgium: '🇧🇪', Netherlands: '🇳🇱',
  Singapore: '🇸🇬', Mexico: '🇲🇽', Brazil: '🇧🇷', UAE: '🇦🇪',
  'Abu Dhabi': '🇦🇪', Azerbaijan: '🇦🇿', Portugal: '🇵🇹',
  Germany: '🇩🇪', Switzerland: '🇨🇭',
};

function flag(country) {
  return FLAGS[country] ?? '🏁';
}

// ── Static circuit facts ──────────────────────────────────────────────
const CIRCUIT_FACTS = {
  albert_park:   { length: '5.278 km', corners: 16, drs: 4 },
  shanghai:      { length: '5.451 km', corners: 16, drs: 2 },
  suzuka:        { length: '5.807 km', corners: 18, drs: 2 },
  bahrain:       { length: '5.412 km', corners: 15, drs: 3 },
  jeddah:        { length: '6.174 km', corners: 27, drs: 3 },
  americas:      { length: '5.513 km', corners: 20, drs: 2 },
  monza:         { length: '5.793 km', corners: 11, drs: 2 },
  silverstone:   { length: '5.891 km', corners: 18, drs: 2 },
  monaco:        { length: '3.337 km', corners: 19, drs: 1 },
  catalunya:     { length: '4.657 km', corners: 14, drs: 2 },
  villeneuve:    { length: '4.361 km', corners: 14, drs: 2 },
  red_bull_ring: { length: '4.318 km', corners: 10, drs: 3 },
  hungaroring:   { length: '4.381 km', corners: 14, drs: 1 },
  spa:           { length: '7.004 km', corners: 19, drs: 2 },
  zandvoort:     { length: '4.259 km', corners: 14, drs: 2 },
  marina_bay:    { length: '4.940 km', corners: 23, drs: 3 },
  rodriguez:     { length: '4.304 km', corners: 17, drs: 2 },
  interlagos:    { length: '4.309 km', corners: 15, drs: 2 },
  yas_marina:    { length: '5.281 km', corners: 16, drs: 2 },
  baku:          { length: '6.003 km', corners: 20, drs: 2 },
  imola:         { length: '4.909 km', corners: 19, drs: 1 },
  losail:        { length: '5.380 km', corners: 16, drs: 2 },
  las_vegas:     { length: '6.201 km', corners: 17, drs: 2 },
};

// ── Circuit track layout image (F1 official CDN) ─────────────────────
const TRACK_IMGS = {
  albert_park:  'https://media.formula1.com/image/upload/f_auto/q_auto/v1677244985/content/dam/fom-website/2018-redesign-assets/Track%20symbols%20new/2023/Australia.png',
  shanghai:     'https://media.formula1.com/image/upload/f_auto/q_auto/v1677244985/content/dam/fom-website/2018-redesign-assets/Track%20symbols%20new/2023/China.png',
  suzuka:       'https://media.formula1.com/image/upload/f_auto/q_auto/v1677244985/content/dam/fom-website/2018-redesign-assets/Track%20symbols%20new/2023/Japan.png',
  bahrain:      'https://media.formula1.com/image/upload/f_auto/q_auto/v1677244985/content/dam/fom-website/2018-redesign-assets/Track%20symbols%20new/2023/Bahrain.png',
  jeddah:       'https://media.formula1.com/image/upload/f_auto/q_auto/v1677244985/content/dam/fom-website/2018-redesign-assets/Track%20symbols%20new/2023/Saudi_Arabia.png',
  americas:     'https://media.formula1.com/image/upload/f_auto/q_auto/v1677244985/content/dam/fom-website/2018-redesign-assets/Track%20symbols%20new/2023/USA.png',
  monza:        'https://media.formula1.com/image/upload/f_auto/q_auto/v1677244985/content/dam/fom-website/2018-redesign-assets/Track%20symbols%20new/2023/Italy.png',
  silverstone:  'https://media.formula1.com/image/upload/f_auto/q_auto/v1677244985/content/dam/fom-website/2018-redesign-assets/Track%20symbols%20new/2023/Great_Britain.png',
  monaco:       'https://media.formula1.com/image/upload/f_auto/q_auto/v1677244985/content/dam/fom-website/2018-redesign-assets/Track%20symbols%20new/2023/Monaco.png',
  catalunya:    'https://media.formula1.com/image/upload/f_auto/q_auto/v1677244985/content/dam/fom-website/2018-redesign-assets/Track%20symbols%20new/2023/Spain.png',
  villeneuve:   'https://media.formula1.com/image/upload/f_auto/q_auto/v1677244985/content/dam/fom-website/2018-redesign-assets/Track%20symbols%20new/2023/Canada.png',
  red_bull_ring:'https://media.formula1.com/image/upload/f_auto/q_auto/v1677244985/content/dam/fom-website/2018-redesign-assets/Track%20symbols%20new/2023/Austria.png',
  hungaroring:  'https://media.formula1.com/image/upload/f_auto/q_auto/v1677244985/content/dam/fom-website/2018-redesign-assets/Track%20symbols%20new/2023/Hungary.png',
  spa:          'https://media.formula1.com/image/upload/f_auto/q_auto/v1677244985/content/dam/fom-website/2018-redesign-assets/Track%20symbols%20new/2023/Belgium.png',
  zandvoort:    'https://media.formula1.com/image/upload/f_auto/q_auto/v1677244985/content/dam/fom-website/2018-redesign-assets/Track%20symbols%20new/2023/Netherlands.png',
  marina_bay:   'https://media.formula1.com/image/upload/f_auto/q_auto/v1677244985/content/dam/fom-website/2018-redesign-assets/Track%20symbols%20new/2023/Singapore.png',
  rodriguez:    'https://media.formula1.com/image/upload/f_auto/q_auto/v1677244985/content/dam/fom-website/2018-redesign-assets/Track%20symbols%20new/2023/Mexico.png',
  interlagos:   'https://media.formula1.com/image/upload/f_auto/q_auto/v1677244985/content/dam/fom-website/2018-redesign-assets/Track%20symbols%20new/2023/Brazil.png',
  yas_marina:   'https://media.formula1.com/image/upload/f_auto/q_auto/v1677244985/content/dam/fom-website/2018-redesign-assets/Track%20symbols%20new/2023/Abu_Dhabi.png',
  baku:         'https://media.formula1.com/image/upload/f_auto/q_auto/v1677244985/content/dam/fom-website/2018-redesign-assets/Track%20symbols%20new/2023/Azerbaijan.png',
  imola:        'https://media.formula1.com/image/upload/f_auto/q_auto/v1677244985/content/dam/fom-website/2018-redesign-assets/Track%20symbols%20new/2023/Emilia_Romagna.png',
};

// ── Finish badge ──────────────────────────────────────────────────────
function FinishBadge({ value }) {
  const n = parseInt(value, 10);
  if (isNaN(n)) return <span className="text-off-white/30 text-xs">{value}</span>;
  const color = n === 1 ? 'text-racing-red font-bold' : n <= 3 ? 'text-off-white' : 'text-off-white/55';
  return <span className={`font-display ${color}`} style={{ fontSize: '1.1rem' }}>P{n}</span>;
}

// ── Points progress bar ───────────────────────────────────────────────
function PointsBar({ points, max }) {
  const pct = max > 0 ? Math.round((points / max) * 100) : 0;
  return (
    <div className="mt-3">
      <div className="flex justify-between items-center mb-1">
        <span className="font-body text-[0.52rem] uppercase tracking-[0.2em] text-off-white/20">Race haul</span>
        <span className="font-body text-[0.52rem] text-off-white/25">{pct}% of best</span>
      </div>
      <div className="h-[2px] w-full bg-off-white/[0.06] rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: pct === 100 ? '#ff2800' : 'rgba(216,221,230,0.3)' }}
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        />
      </div>
    </div>
  );
}

// ── Featured best-race banner ─────────────────────────────────────────
function FeaturedRace({ circuit }) {
  const [trackImgOk, setTrackImgOk] = useState(true);
  const trackSrc = TRACK_IMGS[circuit.circuitId] || null;
  const winner = circuit.drivers.find(d => parseInt(d.finish, 10) === 1) || circuit.drivers[0];

  return (
    <motion.div
      className="mb-10 relative overflow-hidden border border-racing-red/30 bg-surface"
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Red top bar */}
      <div className="h-[3px] w-full bg-racing-red" />

      <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start md:items-center">
        {/* Track layout */}
        <div className="shrink-0 flex items-center justify-center w-28 h-28 opacity-60">
          {trackSrc && trackImgOk ? (
            <img
              src={trackSrc}
              alt={circuit.circuit}
              className="w-full h-full object-contain"
              style={{ filter: 'invert(1) sepia(1) saturate(5) hue-rotate(330deg)' }}
              onError={() => setTrackImgOk(false)}
            />
          ) : (
            <span className="font-display text-racing-red" style={{ fontSize: '3rem' }}>{circuit.round}</span>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Trophy size={13} className="text-racing-red" />
            <span className="font-body text-[0.58rem] uppercase tracking-[0.28em] text-racing-red/70">Best Result This Season</span>
          </div>
          <h3 className="font-display uppercase text-off-white leading-tight mb-1"
              style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', letterSpacing: '0.03em' }}>
            {circuit.raceName.replace(' Grand Prix', '')} <span className="text-racing-red">Grand Prix</span>
          </h3>
          <p className="font-body text-[0.65rem] text-off-white/35 mb-4">
            {circuit.circuit} · {flag(circuit.country)} {circuit.country}
          </p>

          {/* Driver result chips */}
          <div className="flex flex-wrap gap-3">
            {circuit.drivers.map(d => (
              <div key={d.name} className="flex items-center gap-2 border border-off-white/[0.08] bg-primary-black/40 px-3 py-2">
                <span className="font-body text-[0.58rem] text-racing-red/60">#{d.number}</span>
                <span className="font-body text-xs text-off-white/60">{d.name.split(' ').pop()}</span>
                <FinishBadge value={d.finish} />
                {d.points > 0 && (
                  <span className="font-display text-sm text-racing-red">+{d.points}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Big points number */}
        <div className="shrink-0 text-right">
          <p className="font-body text-[0.52rem] uppercase tracking-[0.24em] text-off-white/20 mb-1">Total Pts</p>
          <p className="font-display text-off-white leading-none" style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)', letterSpacing: '0.02em' }}>
            {circuit.totalPoints}
          </p>
          <p className="font-body text-[0.55rem] text-racing-red/60 uppercase tracking-[0.2em]">pts</p>
        </div>
      </div>
    </motion.div>
  );
}

// ── Single circuit card ───────────────────────────────────────────────
function CircuitCard({ circuit, index, driverFilter, maxPoints }) {
  const [expanded, setExpanded] = useState(false);
  const [trackImgOk, setTrackImgOk] = useState(true);

  const trackSrc = TRACK_IMGS[circuit.circuitId] || null;
  const facts    = CIRCUIT_FACTS[circuit.circuitId] || null;

  const visibleDrivers = driverFilter === 'all'
    ? circuit.drivers
    : circuit.drivers.filter(d => d.name.toLowerCase().includes(driverFilter));

  const bestFinish = Math.min(...circuit.drivers.map(d => parseInt(d.finish, 10)).filter(n => !isNaN(n)));
  const isWin = bestFinish === 1;
  const isPodium = bestFinish <= 3;

  return (
    <motion.div
      className="group border border-off-white/[0.07] bg-surface overflow-hidden transition-colors hover:border-off-white/20"
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay: index * 0.055, ease: [0.22, 1, 0.36, 1] }}
      layout
    >
      {/* Top accent — red for win, dimmer otherwise */}
      <div className="h-[2px] w-full transition-all duration-300"
           style={{ background: isWin ? '#ff2800' : isPodium ? 'rgba(255,40,0,0.35)' : 'rgba(216,221,230,0.05)' }} />

      {/* Track image banner */}
      <div className="relative flex items-center justify-center h-28 bg-primary-black/60 overflow-hidden border-b border-off-white/[0.05]">
        {trackSrc && trackImgOk ? (
          <img
            src={trackSrc}
            alt={circuit.circuit}
            className="h-20 w-auto object-contain opacity-30 group-hover:opacity-55 group-hover:scale-105 transition-all duration-500"
            style={{ filter: 'invert(1) sepia(1) saturate(5) hue-rotate(330deg)' }}
            onError={() => setTrackImgOk(false)}
          />
        ) : (
          <span className="font-display text-racing-red/20 group-hover:text-racing-red/40 transition-colors duration-300" style={{ fontSize: '4rem' }}>
            {circuit.round}
          </span>
        )}

        {/* Flag + round overlay */}
        <div className="absolute top-2.5 left-3 flex items-center gap-1.5">
          <span className="font-body text-[0.52rem] uppercase tracking-[0.26em] text-off-white/28">Rd {circuit.round}</span>
          <span className="text-xs">{flag(circuit.country)}</span>
        </div>

        {/* Win badge */}
        {isWin && (
          <div className="absolute top-2.5 right-3 flex items-center gap-1">
            <Trophy size={10} className="text-racing-red" />
            <span className="font-body text-[0.5rem] uppercase tracking-[0.2em] text-racing-red">Win</span>
          </div>
        )}
        {!isWin && isPodium && (
          <div className="absolute top-2.5 right-3">
            <span className="font-body text-[0.5rem] uppercase tracking-[0.2em] text-off-white/35">Podium</span>
          </div>
        )}
      </div>

      <div className="p-5">
        {/* Race name + location */}
        <div className="mb-4">
          <h3 className="font-display uppercase text-off-white leading-tight"
              style={{ fontSize: 'clamp(1.05rem, 1.8vw, 1.3rem)', letterSpacing: '0.03em' }}>
            {circuit.raceName.replace(' Grand Prix', '')}
          </h3>
          <div className="flex flex-wrap gap-x-3 mt-1">
            <span className="flex items-center gap-1 font-body text-[0.58rem] text-off-white/30">
              <MapPin size={9} /> {circuit.locality}, {circuit.country}
            </span>
            <span className="flex items-center gap-1 font-body text-[0.58rem] text-off-white/25">
              <Calendar size={9} /> {circuit.date}
            </span>
          </div>
        </div>

        {/* Circuit facts row */}
        {facts && (
          <div className="mb-4 grid grid-cols-3 gap-px bg-off-white/[0.04] border border-off-white/[0.04]">
            {[
              { icon: <Gauge size={8} />,           label: 'Length',  value: facts.length  },
              { icon: <CornerDownRight size={8} />,  label: 'Corners', value: facts.corners },
              { icon: <Wind size={8} />,             label: 'DRS',     value: `${facts.drs} zones` },
            ].map(({ icon, label, value }) => (
              <div key={label} className="bg-surface px-2 py-2 text-center">
                <div className="flex items-center justify-center gap-1 text-off-white/20 mb-0.5">{icon}
                  <span className="font-body text-[0.48rem] uppercase tracking-[0.18em] text-off-white/20">{label}</span>
                </div>
                <p className="font-display text-off-white/50 leading-none" style={{ fontSize: '0.75rem' }}>{value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Driver results */}
        <div className="space-y-2 mb-3">
          {visibleDrivers.map((d) => (
            <div key={d.name} className="flex items-center justify-between gap-2 py-1.5 border-b border-off-white/[0.05]">
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-body text-[0.58rem] text-racing-red/55 tabular-nums w-5 shrink-0">#{d.number}</span>
                <span className="font-body text-xs text-off-white/55 truncate">{d.name.split(' ').pop()}</span>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <FinishBadge value={d.finish} />
                <span className={`font-display tabular-nums text-sm ${d.points > 0 ? 'text-racing-red' : 'text-off-white/18'}`}>
                  {d.points > 0 ? `+${d.points}` : '—'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Points progress bar */}
        <PointsBar points={circuit.totalPoints} max={maxPoints} />

        {/* Expand button */}
        <button
          onClick={() => setExpanded(v => !v)}
          className="mt-4 w-full flex items-center justify-center gap-1.5 border-t border-off-white/[0.06] pt-3 font-body text-[0.56rem] uppercase tracking-[0.22em] text-off-white/22 hover:text-off-white/50 transition-colors"
        >
          {expanded ? <><ChevronUp size={10}/> Hide detail</> : <><ChevronDown size={10}/> Grid &amp; positions</>}
        </button>

        {/* Expanded: grid vs finish */}
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              key="expanded"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="pt-4 space-y-4">
                {circuit.drivers.map((d) => {
                  const grid   = parseInt(d.grid, 10);
                  const finish = parseInt(d.finish, 10);
                  const delta  = !isNaN(grid) && !isNaN(finish) ? grid - finish : null;

                  return (
                    <div key={d.name} className="border border-off-white/[0.05] p-3">
                      {/* Driver name */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-body text-[0.62rem] text-off-white/50">
                          <span className="text-racing-red/60">#{d.number}</span> {d.name}
                        </span>
                        {d.status && d.status !== 'Finished' && (
                          <span className="font-body text-[0.52rem] uppercase tracking-[0.18em] text-off-white/25 border border-off-white/[0.08] px-2 py-0.5">
                            {d.status}
                          </span>
                        )}
                      </div>

                      {/* Grid → Finish visual */}
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div>
                          <p className="font-body text-[0.5rem] uppercase tracking-[0.18em] text-off-white/20 mb-1">Qualified</p>
                          <p className="font-display text-off-white/55" style={{ fontSize: '1.1rem' }}>P{d.grid}</p>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                          <p className="font-body text-[0.5rem] uppercase tracking-[0.18em] text-off-white/15 mb-1">Δ</p>
                          <p className={`font-body text-base font-semibold ${
                            delta === null ? 'text-off-white/20'
                            : delta > 0 ? 'text-emerald-400/75'
                            : delta < 0 ? 'text-red-400/70'
                            : 'text-off-white/25'
                          }`}>
                            {delta === null ? '—' : delta > 0 ? `▲${delta}` : delta < 0 ? `▼${Math.abs(delta)}` : '='}
                          </p>
                        </div>
                        <div>
                          <p className="font-body text-[0.5rem] uppercase tracking-[0.18em] text-off-white/20 mb-1">Finished</p>
                          <FinishBadge value={d.finish} />
                        </div>
                      </div>

                      {/* Points earned */}
                      <div className="mt-3 flex items-center justify-between border-t border-off-white/[0.05] pt-2">
                        <span className="font-body text-[0.52rem] uppercase tracking-[0.18em] text-off-white/20">Points earned</span>
                        <span className={`font-display text-lg ${d.points > 0 ? 'text-racing-red' : 'text-off-white/20'}`}>
                          {d.points > 0 ? `+${d.points}` : '0'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ── Sort / filter controls ────────────────────────────────────────────
const SORTS = [
  { key: 'round',  label: 'Round'       },
  { key: 'points', label: 'Points'      },
  { key: 'finish', label: 'Best Finish' },
];

function ToggleBtn({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`font-body text-[0.6rem] uppercase tracking-[0.2em] px-3 py-2 border transition-all duration-150 ${
        active
          ? 'border-racing-red bg-racing-red/10 text-racing-red'
          : 'border-off-white/10 text-off-white/35 hover:border-off-white/25 hover:text-off-white/60'
      }`}
    >
      {children}
    </button>
  );
}

// ── Main section ──────────────────────────────────────────────────────
export function CircuitSection({ circuitsState }) {
  const { data, loading, error } = circuitsState;
  const circuits = data?.circuits || [];

  const [sortKey,      setSortKey]      = useState('round');
  const [driverFilter, setDriverFilter] = useState('all');
  const [search,       setSearch]       = useState('');

  // Best circuit (by totalPoints then best finish)
  const featuredCircuit = useMemo(() => {
    if (!circuits.length) return null;
    return [...circuits].sort((a, b) => {
      const bfA = Math.min(...a.drivers.map(d => parseInt(d.finish, 10)).filter(n => !isNaN(n)), 99);
      const bfB = Math.min(...b.drivers.map(d => parseInt(d.finish, 10)).filter(n => !isNaN(n)), 99);
      if (bfA !== bfB) return bfA - bfB;
      return b.totalPoints - a.totalPoints;
    })[0];
  }, [circuits]);

  const maxPoints = useMemo(() =>
    Math.max(...circuits.map(c => c.totalPoints), 1), [circuits]);

  // Unique driver last names for filter buttons
  const driverNames = useMemo(() => {
    const names = new Set();
    circuits.forEach(c => c.drivers.forEach(d => names.add(d.name.split(' ').pop().toLowerCase())));
    return Array.from(names);
  }, [circuits]);

  const filtered = useMemo(() => {
    let list = [...circuits];
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(c =>
        c.raceName.toLowerCase().includes(q) ||
        c.circuit.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q) ||
        c.locality.toLowerCase().includes(q)
      );
    }
    list.sort((a, b) => {
      if (sortKey === 'points') return b.totalPoints - a.totalPoints;
      if (sortKey === 'finish') {
        const bA = Math.min(...a.drivers.map(d => parseInt(d.finish,10)).filter(n=>!isNaN(n)), 99);
        const bB = Math.min(...b.drivers.map(d => parseInt(d.finish,10)).filter(n=>!isNaN(n)), 99);
        return bA - bB;
      }
      return a.round - b.round;
    });
    return list;
  }, [circuits, sortKey, search]);

  const totalPts = circuits.reduce((s, c) => s + c.totalPoints, 0);
  const wins     = circuits.filter(c => c.drivers.some(d => parseInt(d.finish,10) === 1)).length;
  const podiums  = circuits.filter(c => c.drivers.some(d => parseInt(d.finish,10) <= 3)).length;

  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-80px' },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  };

  return (
    <section
      id="gallery"
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
        07
      </motion.span>

      {/* Red line */}
      <motion.div className="mb-4 h-px w-16 bg-racing-red" {...fadeInUp} />

      {/* Heading */}
      <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <motion.p className="mb-2 font-body text-xs uppercase tracking-[0.32em] text-off-white/35"
            {...fadeInUp} transition={{ duration: 0.6, delay: 0.05 }}>
            2026 Season
          </motion.p>
          <motion.h2
            className="font-display uppercase text-off-white leading-[0.9]"
            style={{ fontSize: 'clamp(2.6rem, 5vw, 4.5rem)', letterSpacing: '0.02em' }}
            {...fadeInUp} transition={{ duration: 0.6, delay: 0.1 }}
          >
            The <span className="text-racing-red">Circuits</span>
          </motion.h2>
        </div>

        {/* Season summary pills */}
        {circuits.length > 0 && (
          <motion.div className="flex gap-px bg-off-white/[0.05] border border-off-white/[0.05]"
            {...fadeInUp} transition={{ duration: 0.6, delay: 0.2 }}>
            {[
              { label: 'Races',   value: circuits.length },
              { label: 'Wins',    value: wins },
              { label: 'Podiums', value: podiums },
              { label: 'Points',  value: totalPts },
            ].map(({ label, value }) => (
              <div key={label} className="bg-surface px-4 py-3 text-center">
                <p className="font-display text-off-white leading-none" style={{ fontSize: '1.4rem' }}>{value}</p>
                <p className="font-body text-[0.52rem] uppercase tracking-[0.2em] text-off-white/25 mt-0.5">{label}</p>
              </div>
            ))}
          </motion.div>
        )}
      </div>

      {loading && <LoadingSkeleton rows={3} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" />}
      {error   && <ErrorState message={error.message} />}
      {!loading && !error && !circuits.length && (
        <EmptyState title="No circuits yet" message="Circuit data appears once race results are available." />
      )}

      {/* Featured best result */}
      {!loading && !error && featuredCircuit && (
        <FeaturedRace circuit={featuredCircuit} />
      )}

      {/* Controls */}
      {circuits.length > 0 && (
        <motion.div
          className="mb-8 flex flex-wrap gap-3 items-center"
          {...fadeInUp} transition={{ duration: 0.6, delay: 0.25 }}
        >
          {/* Search */}
          <label className="relative flex-1 min-w-[180px] max-w-xs block">
            <Search size={13} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-off-white/25" />
            <input
              type="search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search circuits…"
              className="search-input pl-9 py-2 text-xs"
            />
          </label>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <span className="font-body text-[0.58rem] uppercase tracking-[0.22em] text-off-white/25">Sort</span>
            <div className="flex gap-1">
              {SORTS.map(s => (
                <ToggleBtn key={s.key} active={sortKey === s.key} onClick={() => setSortKey(s.key)}>
                  {s.label}
                </ToggleBtn>
              ))}
            </div>
          </div>

          {/* Driver filter */}
          <div className="flex items-center gap-2">
            <span className="font-body text-[0.58rem] uppercase tracking-[0.22em] text-off-white/25">Driver</span>
            <div className="flex gap-1">
              <ToggleBtn active={driverFilter === 'all'} onClick={() => setDriverFilter('all')}>All</ToggleBtn>
              {driverNames.map(name => (
                <ToggleBtn key={name} active={driverFilter === name} onClick={() => setDriverFilter(name)}>
                  {name}
                </ToggleBtn>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Circuit grid */}
      {!loading && !error && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((c, i) => (
              <CircuitCard
                key={c.circuitId || c.round}
                circuit={c}
                index={i}
                driverFilter={driverFilter}
                maxPoints={maxPoints}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && circuits.length > 0 && (
        <EmptyState title="No circuits match" message="Try a different search term." />
      )}

      {/* Quote */}
      <motion.div
        className="mt-16 border-t border-off-white/[0.07] pt-10 flex items-center justify-between gap-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <p className="font-editorial text-xl md:text-2xl leading-relaxed text-off-white/40 max-w-xl">
          "There are two religions in Italy. There's the Catholic Church and there's Ferrari."
        </p>
        <div className="hidden md:flex items-center gap-3 shrink-0">
          <div className="h-px w-8 bg-racing-red" />
          <span className="font-body text-[0.6rem] uppercase tracking-[0.3em] text-off-white/22">— Will Buxton</span>
        </div>
      </motion.div>
    </section>
  );
}
