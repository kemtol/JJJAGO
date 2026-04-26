# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

JAGOALGO.id is an algo-trading education platform for Indonesian traders. It is hosted on Cloudflare Workers and serves static HTML pages alongside a thin API that proxies and caches class data from goakal.com (the LMS backend). The school slug on goakal.com is `jagoalgoid`.

## Commands

All commands run from `workers/www/`:

```bash
# Local dev (Wrangler local mode — serves static + worker)
npx wrangler dev

# Deploy to Cloudflare production
npx wrangler deploy

# Manually force a KV sync of class data (requires SYNC_TOKEN env var)
curl -X POST "https://<worker-domain>/api/classes/sync" \
  -H "x-sync-token: <SYNC_TOKEN>"
```

There are no build steps, transpilation, or test suite configured. `package.json` lists only `@cloudflare/kv-asset-handler` as a dependency; no framework tooling is needed.

## Architecture

```
workers/www/
├── src/index.js      # Single Cloudflare Worker entry point (ES modules)
├── public/           # Static assets served via kv-asset-handler
│   ├── index.html    # Landing page
│   ├── kelas-ai.html # AI/ML class listing page
│   ├── daftar.html   # Registration page
│   ├── machine-learning-report.html  # ML strategy report viewer
│   ├── style.css
│   ├── data/
│   │   ├── goakal-classes.json   # Static fallback for /api/classes
│   │   └── ml-reports.json       # Report metadata consumed by report page
│   └── reports/      # PNG charts + markdown reports rendered client-side
└── wrangler.toml     # Worker config: KV binding, cron trigger, vars
```

### Worker (`src/index.js`) — three responsibilities

1. **Static asset serving** — `getAssetFromKV` handles all non-API routes, serving files from `public/` using the `__STATIC_CONTENT` namespace auto-bound by Wrangler.

2. **`GET /api/classes`** — returns class/pricing data for a goakal.com school. Cache-first: reads from KV (`goakal:classes:<schoolId>`); falls back to live scrape; falls back to static `data/goakal-classes.json`. Accepts `?refresh=1` to bypass cache and `?school=<id>` to query a different school.

3. **`POST /api/classes/sync`** — protected by `x-sync-token` header matching the `SYNC_TOKEN` environment secret; triggers a fresh scrape and writes to KV.

4. **Scheduled cron** (`0 * * * *`) — runs `syncClassesData` hourly to keep KV warm.

### KV namespace

Binding: `CLASSES_KV` (id `558c84d2...`). Keys follow the pattern `goakal:classes:<schoolId>`. Cache TTL is effectively the hourly cron cadence.

### Data flow for class data

```
Cron / POST sync → goakal.com REST API → scrapeClassesSnapshot() → CLASSES_KV
GET /api/classes → CLASSES_KV hit → return (x-data-source: kv-cache)
                 → CLASSES_KV miss → live scrape → CLASSES_KV write → return
                 → scrape failure → CLASSES_KV stale → return
                                  → static JSON fallback → return
```

## Frontend Stack

- Bootstrap 5.3 (CDN), Bootstrap Icons 1.11 (CDN)
- Google Fonts — Inter (400–900)
- No JS framework; vanilla JS / jQuery where needed
- Brand: primary `#7c6fcd` (purple), accent `#5dbfb0` (mint), dark bg `#0d0d1a`

## Environment Variables

Defined in `.env` (local) and via Wrangler secrets in production:

| Variable | Purpose |
|---|---|
| `CF_TOKEN` | Cloudflare API token for Wrangler |
| `CF_ACCOUNT_ID` | Cloudflare account ID |
| `GOAKAL_SCHOOL_ID` | School slug passed to goakal.com API (default: `jagoalgoid`) |
| `SYNC_TOKEN` | Bearer token protecting `POST /api/classes/sync` |

`CF_NAMESPACE_ID_REKO` and `INGEST_TOKEN` appear in `.env` but are not currently wired into the worker.

## Key Files

- `workers/www/src/index.js` — the entire backend; all API logic lives here
- `workers/www/wrangler.toml` — KV bindings, cron schedule, env vars
- `workers/www/public/data/goakal-classes.json` — static fallback; regenerate by hitting `/api/classes?refresh=1` and saving the response
- `workers/www/public/reports/` — report charts and markdown files rendered in `machine-learning-report.html`; add new reports by dropping PNGs + updating `data/ml-reports.json`
