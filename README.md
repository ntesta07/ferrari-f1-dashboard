# Scuderia Ferrari Performance Dashboard

A full-stack Ferrari Formula 1 single-page experience built for the Hack4Impact BU Fall 2026 technical assessment. The product combines a cinematic Ferrari brand site with a live analytics dashboard powered by external F1 data and filtered to Ferrari only.

## Stack

- Frontend: React, Vite, Tailwind CSS, Framer Motion, Recharts
- Backend: Node.js, Express, MongoDB, Mongoose
- External data: Jolpica F1 API (Ergast-compatible)

## Folder Structure

```text
.
├── server
│   ├── app.js
│   ├── server.js
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── services/
├── src
│   ├── app/
│   ├── components/
│   ├── sections/
│   └── styles/
├── .env.example
├── package.json
└── vite.config.js
```

## Features

- Premium chapter-based Ferrari single-page UI
- External API integration with Ferrari-only normalization
- Express API routes for overview, drivers, results, chart, and insights
- Searchable Ferrari race results table
- Pagination capped at 20 rows per page
- Responsive Recharts line chart for Ferrari race points
- Mongo-backed snapshot cache with graceful fallback when Mongo is unavailable
- Motion-driven section reveals and premium dark styling

## API Routes

- `GET /api/ferrari/overview`
- `GET /api/ferrari/drivers`
- `GET /api/ferrari/results?page=1&limit=20&search=monza`
- `GET /api/ferrari/chart`
- `GET /api/ferrari/insights`

## Environment

Copy `.env.example` to `.env` and update values as needed.

```bash
cp .env.example .env
```

## Run Commands

Install dependencies:

```bash
npm install
```

Start frontend and backend together:

```bash
npm run dev
```

Start backend only:

```bash
npm run server:dev
```

Start frontend only:

```bash
npm run client:dev
```

Create a production frontend build:

```bash
npm run build
```

Run the production server:

```bash
npm start
```

## Architecture Notes

- `server/services/ferrariService.js` is the normalization layer. It fetches constructor standings and race results from the external API, filters to Ferrari, computes overview stats, driver summaries, chart points, and editorial insights, then caches the normalized payload.
- `server/controllers/ferrariController.js` handles pagination, search, and response shaping for each endpoint.
- `src/App.jsx` composes the single-page experience from chapter sections.
- `src/app/useFerrariData.js` centralizes frontend data fetching and loading/error state management.
- `src/sections/ResultsTableSection.jsx` owns the required search + pagination UI and requests backend-filtered rows.

## Notes

- MongoDB is optional at runtime. If `MONGO_URI` is not available, the backend still works using in-memory caching.
- The project defaults to `current` season data, so the exact Ferrari standings/results will update as the external API changes.
