import { getFerrariDataset } from "../services/ferrariService.js";

function sanitizeLimit(value) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return 20;
  }

  return Math.min(Math.floor(parsed), 20);
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
    const dataset = await getFerrariDataset(req.query.season);
    const page = sanitizePage(req.query.page);
    const limit = sanitizeLimit(req.query.limit);
    const search = `${req.query.search || ""}`.trim().toLowerCase();

    const filteredRows = dataset.results.filter((row) => {
      if (!search) {
        return true;
      }

      return [row.grandPrix, row.circuit, row.date, row.driver, String(row.round), String(row.finish)]
        .join(" ")
        .toLowerCase()
        .includes(search);
    });

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
