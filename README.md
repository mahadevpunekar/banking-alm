# Banking ALM Platform

Modular ALM stack. **Current focus: Module 1 — Data Integration & Management.**

## Prerequisites

- Python 3.11+
- **Database:** defaults to **SQLite** (`banking_alm_local.db` in the project root). Use PostgreSQL in production (set `DATABASE_URL` — see `.env.example`).

## Quick start (Module 1)

```bash
cd "banking-alm"
python -m venv .venv
source .venv/bin/activate
pip install -e ".[dev]"

# Optional: copy .env and set DATABASE_URL for Postgres
# cp .env.example .env

# Run API
uvicorn banking_alm.main:app --reload --host 0.0.0.0 --port 8000
```

Open `http://localhost:8000/docs` for OpenAPI.

## Frontend (React + Vite + Tailwind)

ALM console: dashboard, liquidity, IRRBB, stress testing, reports, settings, and data integration. Mock APIs (`/api/dashboard`, `/api/liquidity`, `/api/irrbb`, `/api/stress`, `/api/reports`) are used when `VITE_API_MOCK` is not `false` (see `frontend/.env.example`).

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` — you are sent to **`/login`** until signed in. Sample users (password **`Demo@2026`** for all): `cfo.mehta`, `risk.iyer`, `treasury.kapoor` (see `frontend/src/auth/sampleUsers.ts`). Session is stored in `localStorage` for refresh.

The dev server proxies `/api` to FastAPI on `http://127.0.0.1:8000` for paths that exist (e.g. data integration). CORS is enabled for `http://localhost:5173` on the API.

**Reports → PDF / Excel:** sample downloads use **jsPDF** and **ExcelJS** with the wordmark `frontend/src/assets/assimilate_logo.png` (replace to match your institution).

## Module roadmap

1. Data Integration & Management (this repo)  
2. Transformation Engine → 3. Liquidity → 4. IRRBB → … (see `banking_alm/modules/`).

## Docker (PostgreSQL only)

```bash
docker compose up -d postgres
```
