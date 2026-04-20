import { getFerrariDataset } from "../services/ferrariService.js";

function sanitizeLimit(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return 20;
  // Allow 10 / 20 / 50 — clamp anything else to 50
  return Math.min(Math.floor(parsed), 50);
}

function sanitizePage(value) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return 1;
  }

  return Math.floor(parsed);
}

export async function getOverview(req, res, next) {
  try {
    const dataset = await getFerrariDataset(req.query.season);
    res.json(dataset.constructor);
  } catch (error) {
    next(error);
  }
}

export async function getDrivers(req, res, next) {
  try {
    const dataset = await getFerrariDataset(req.query.season);
    res.json({
      season: dataset.season,
      drivers: dataset.drivers,
    });
  } catch (error) {
    next(error);
  }
}

export async function getResults(req, res, next) {
  try {
    const dataset  = await getFerrariDataset(req.query.season);
    const page     = sanitizePage(req.query.page);
    const limit    = sanitizeLimit(req.query.limit);
    const search   = `${req.query.search || ""}`.trim();
    const isRegex  = req.query.regex === "true";
    const boolMode = req.query.bool === "or" ? "or" : "and"; // default AND

    function haystack(row) {
      return [row.grandPrix, row.circuit, row.date, row.driver,
              String(row.round), String(row.finish), String(row.points)]
        .join(" ");
    }

    let matchFn;

    if (!search) {
      matchFn = () => true;

    } else if (isRegex) {
      // Regex mode — invalid pattern falls back to plain includes
      let re;
      try { re = new RegExp(search, "i"); } catch { re = null; }

      if (re) {
        matchFn = (row) => re.test(haystack(row));
      } else {
        const lower = search.toLowerCase();
        matchFn = (row) => haystack(row).toLowerCase().includes(lower);
      }

    } else {
      // Boolean AND / OR — split on whitespace
      const terms = search.toLowerCase().split(/\s+/).filter(Boolean);
      matchFn = (row) => {
        const h = haystack(row).toLowerCase();
        return boolMode === "or"
          ? terms.some((t) => h.includes(t))
          : terms.every((t) => h.includes(t));
      };
    }

    const filteredRows = dataset.results.filter(matchFn);

    const totalRows = filteredRows.length;
    const totalPages = Math.max(1, Math.ceil(totalRows / limit));
    const currentPage = Math.min(page, totalPages);
    const startIndex = (currentPage - 1) * limit;

    res.json({
      rows: filteredRows.slice(startIndex, startIndex + limit),
      pagination: {
        page: currentPage,
        limit,
        totalRows,
        totalPages,
        hasPreviousPage: currentPage > 1,
        hasNextPage: currentPage < totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getCircuits(req, res, next) {
  try {
    const dataset = await getFerrariDataset(req.query.season);
    res.json({ season: dataset.season, circuits: dataset.circuits });
  } catch (error) {
    next(error);
  }
}

export async function getChart(req, res, next) {
  try {
    const dataset = await getFerrariDataset(req.query.season);
    res.json({
      season: dataset.season,
      chart: dataset.chart,
    });
  } catch (error) {
    next(error);
  }
}

export async function getInsights(req, res, next) {
  try {
    const dataset = await getFerrariDataset(req.query.season);
    res.json(dataset.insights);
  } catch (error) {
    next(error);
  }
}
