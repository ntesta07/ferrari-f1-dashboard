import { isDatabaseReady } from "../config/database.js";
import { FerrariSnapshot } from "../models/FerrariSnapshot.js";

const API_BASE_URL = process.env.F1_API_BASE_URL || "https://api.jolpi.ca/ergast/f1";
const DEFAULT_SEASON = process.env.F1_SEASON || "current";
const CACHE_TTL_MINUTES = Number(process.env.FERRARI_CACHE_TTL_MINUTES || 30);
const CACHE_TTL_MS = CACHE_TTL_MINUTES * 60 * 1000;
const FERRARI_CONSTRUCTOR_ID = "ferrari";
const memoryCache = new Map();

// In-flight deduplication: if a fetch for a season is already running,
// every concurrent caller gets the same promise instead of firing new requests.
const pendingRequests = new Map();

function isFresh(timestamp) {
  return Date.now() - timestamp < CACHE_TTL_MS;
}

function toNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toFinishValue(position) {
  const parsed = Number(position);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function formatAverage(values) {
  if (!values.length) {
    return null;
  }

  const average = values.reduce((sum, value) => sum + value, 0) / values.length;
  return Number(average.toFixed(1));
}

function buildShortRaceName(raceName) {
  return raceName
    .replace("Grand Prix", "")
    .replace("Saudi Arabian", "Saudi")
    .replace("Emilia Romagna", "Imola")
    .trim();
}

function buildAxisRaceName(raceName) {
  return raceName
    .replace("Grand Prix", "GP")
    .replace("Saudi Arabian", "Saudi Arabian")
    .replace("Emilia Romagna", "Emilia-Romagna")
    .trim();
}

function isFerrariEntry(result) {
  return (
    result?.Constructor?.constructorId === FERRARI_CONSTRUCTOR_ID ||
    result?.Constructor?.name?.toLowerCase().includes("ferrari")
  );
}

async function requestF1(path, params = {}) {
  const url = new URL(path.replace(/^\//, ""), API_BASE_URL.endsWith("/") ? API_BASE_URL : `${API_BASE_URL}/`);

  Object.entries({ format: "json", ...params }).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
    signal: AbortSignal.timeout(12000),
  });

  if (!response.ok) {
    throw new Error(`F1 API request failed with status ${response.status}`);
  }

  return response.json();
}

async function getCachedPayload(cacheKey) {
  const inMemory = memoryCache.get(cacheKey);

  if (inMemory && isFresh(inMemory.timestamp)) {
    return inMemory.payload;
  }

  if (!isDatabaseReady()) {
    return null;
  }

  const snapshot = await FerrariSnapshot.findOne({ key: cacheKey }).lean();

  if (!snapshot) {
    return null;
  }

  const updatedAt = new Date(snapshot.updatedAt).getTime();

  if (!isFresh(updatedAt)) {
    return null;
  }

  memoryCache.set(cacheKey, {
    payload: snapshot.payload,
    timestamp: updatedAt,
  });

  return snapshot.payload;
}

async function storeCachedPayload(cacheKey, season, payload) {
  memoryCache.set(cacheKey, {
    payload,
    timestamp: Date.now(),
  });

  if (!isDatabaseReady()) {
    return;
  }

  await FerrariSnapshot.findOneAndUpdate(
    { key: cacheKey },
    {
      key: cacheKey,
      season,
      payload,
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    }
  );
}

function normalizeFerrariData(standingsResponse, resultsResponse, season) {
  const standings =
    standingsResponse?.MRData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings || [];
  const races = resultsResponse?.MRData?.RaceTable?.Races || [];
  const ferrariStanding = standings.find((entry) => entry?.Constructor?.constructorId === FERRARI_CONSTRUCTOR_ID);

  const driverMap = new Map();
  const results = [];
  const chart = [];
  const circuits = [];
  let cumulativePoints = 0;

  races.forEach((race) => {
    const ferrariResults = (race?.Results || []).filter(isFerrariEntry);

    if (!ferrariResults.length) {
      return;
    }

    const racePoints = ferrariResults.reduce((sum, result) => sum + toNumber(result.points), 0);
    cumulativePoints += racePoints;

    // Per-circuit summary for the Circuit Map section
    circuits.push({
      round:      toNumber(race.round),
      raceName:   race.raceName || "Unknown Grand Prix",
      circuitId:  race?.Circuit?.circuitId || "",
      circuit:    race?.Circuit?.circuitName || "Unknown Circuit",
      locality:   race?.Circuit?.Location?.locality || "",
      country:    race?.Circuit?.Location?.country || "",
      date:       race?.date || "TBD",
      totalPoints: racePoints,
      drivers: ferrariResults.map((r) => ({
        name:     `${r.Driver?.givenName || ""} ${r.Driver?.familyName || ""}`.trim(),
        number:   r.Driver?.permanentNumber || "N/A",
        grid:     r.grid || "N/A",
        finish:   r.positionText || r.position || r.status || "N/A",
        points:   toNumber(r.points),
        status:   r.status || "",
      })),
    });

    chart.push({
      round: toNumber(race.round),
      raceName: race.raceName || "Unknown Grand Prix",
      shortLabel: buildShortRaceName(race.raceName || `Round ${race.round}`),
      axisLabel: buildAxisRaceName(race.raceName || `Round ${race.round}`),
      points: racePoints,
      cumulativePoints,
    });

    ferrariResults.forEach((result) => {
      const driver = result.Driver || {};
      const driverId = driver.driverId || `${driver.givenName || ""}-${driver.familyName || ""}`;
      const driverName = `${driver.givenName || ""} ${driver.familyName || ""}`.trim() || "Unknown Driver";
      const finishValue = toFinishValue(result.position);
      const currentDriver = driverMap.get(driverId) || {
        id: driverId,
        name: driverName,
        number: driver.permanentNumber || "N/A",
        nationality: driver.nationality || "Unknown",
        points: 0,
        wins: 0,
        podiums: 0,
        finishes: [],
      };

      currentDriver.points += toNumber(result.points);
      currentDriver.wins += finishValue === 1 ? 1 : 0;
      currentDriver.podiums += finishValue !== null && finishValue <= 3 ? 1 : 0;

      if (finishValue !== null) {
        currentDriver.finishes.push(finishValue);
      }

      driverMap.set(driverId, currentDriver);

      results.push({
        id: `${race.round}-${driverId}`,
        round: toNumber(race.round),
        grandPrix: race.raceName || "Unknown Grand Prix",
        circuit: race?.Circuit?.circuitName || "Unknown Circuit",
        date: race?.date || "TBD",
        driver: driverName,
        grid: result.grid || "N/A",
        finish: result.positionText || result.position || result.status || "N/A",
        points: toNumber(result.points),
      });
    });
  });

  const drivers = Array.from(driverMap.values())
    .map((driver) => ({
      ...driver,
      averageFinish: formatAverage(driver.finishes),
    }))
    .sort((a, b) => b.points - a.points || (a.averageFinish || 99) - (b.averageFinish || 99));

  const totalPoints = chart.reduce((sum, race) => sum + race.points, 0);
  const strongestDriver = drivers[0] || null;
  const numericFinishes = results.map((result) => toFinishValue(result.finish)).filter(Boolean);
  const bestFinish = results
    .filter((result) => toFinishValue(result.finish) !== null)
    .sort((a, b) => toFinishValue(a.finish) - toFinishValue(b.finish))[0];
  const highestScoringRace = [...chart].sort((a, b) => b.points - a.points)[0];

  return {
    season:
      ferrariStanding?.season ||
      standingsResponse?.MRData?.StandingsTable?.season ||
      season,
    constructor: {
      name: ferrariStanding?.Constructor?.name || "Ferrari",
      standing: ferrariStanding?.position || "N/A",
      points: toNumber(ferrariStanding?.points, totalPoints),
      wins: toNumber(ferrariStanding?.wins, drivers.reduce((sum, driver) => sum + driver.wins, 0)),
      podiums: drivers.reduce((sum, driver) => sum + driver.podiums, 0),
      racesProcessed: chart.length,
      leadingDriver: strongestDriver?.name || "TBD",
      currentRound: toNumber(standingsResponse?.MRData?.StandingsTable?.round),
    },
    drivers,
    results: results.sort((a, b) => a.round - b.round || a.driver.localeCompare(b.driver)),
    circuits,
    chart,
    insights: {
      bestFinish: bestFinish
        ? {
            value: `P${toFinishValue(bestFinish.finish)}`,
            detail: `${bestFinish.driver} at ${bestFinish.grandPrix}`,
          }
        : {
            value: "N/A",
            detail: "No classified Ferrari finish available yet.",
          },
      highestScoringRace: highestScoringRace
        ? {
            value: `${highestScoringRace.points} pts`,
            detail: highestScoringRace.raceName,
          }
        : {
            value: "N/A",
            detail: "Race totals will appear once results arrive.",
          },
      averageFinish: {
        value: numericFinishes.length ? formatAverage(numericFinishes) : "N/A",
        detail: "Average classified finish across all Ferrari race entries.",
      },
      strongestDriver: strongestDriver
        ? {
            value: strongestDriver.name,
            detail: `${strongestDriver.points} points, ${strongestDriver.podiums} podiums`,
          }
        : {
            value: "TBD",
            detail: "Driver rankings update as Ferrari races are processed.",
          },
    },
  };
}

export async function getFerrariDataset(season = DEFAULT_SEASON) {
  const cacheKey = `ferrari-${season}`;

  // 1. Serve from cache if still fresh
  const cachedPayload = await getCachedPayload(cacheKey);
  if (cachedPayload) {
    return cachedPayload;
  }

  // 2. If a fetch is already in-flight, reuse it instead of firing new requests.
  //    This is the fix for the thundering-herd 429: all 4 endpoints hit this
  //    function at the same time on startup, but only ONE set of API calls goes out.
  if (pendingRequests.has(cacheKey)) {
    return pendingRequests.get(cacheKey);
  }

  // 3. No cache, no pending — start the actual fetch and register it.
  const fetchPromise = (async () => {
    try {
      const [standingsResponse, resultsResponse] = await Promise.all([
        requestF1(`${season}/constructorstandings/`, { limit: 50 }),
        requestF1(`${season}/results/`, { limit: 1000 }),
      ]);

      const payload = normalizeFerrariData(standingsResponse, resultsResponse, season);
      await storeCachedPayload(cacheKey, season, payload);
      return payload;
    } finally {
      // Always remove the pending entry so failed requests can be retried.
      pendingRequests.delete(cacheKey);
    }
  })();

  pendingRequests.set(cacheKey, fetchPromise);
  return fetchPromise;
}
