# Acme Helpdesk

A small demo ticketing system for a fictional company: a public ticket form, a REST API and a PostgreSQL database. All data is invented.

**Stack:** static HTML/CSS/JS form, Fastify 4, Prisma 5, PostgreSQL 17, Zod, TypeScript.

## Run locally

```bash
docker compose up -d                 # Postgres on localhost:5499
cd backend
cp .env.example .env
npm install
npx prisma migrate deploy
npm run db:seed                      # optional demo tickets
npm run dev                          # API on http://localhost:4100
```

Set `SUPPORT_API_KEY` to a strong secret and `CORS_ORIGIN` (comma-separated origins) if serving the form from another origin. Open `public/index.html` in a browser (or serve it with `npx serve public`). The API URL is the `BACKEND_API_URL` constant at the top of the script in that file.

## API

- `GET /health` - liveness check.
- `POST /tickets` - public, rate limited (10/min per IP); `ticketId` must look like `AC-123456` (prefix AC, BL, BG or FR); create a ticket (`ticketId`, `category` Account|Billing|Bug report|Feature request, `name`, `phone`, `email`, `address?`, `priority` Low|Medium|High, `issue`).
- `GET /tickets` - requires `Authorization: Bearer <SUPPORT_API_KEY>`; optional `?category=` and `?status=` filters.
- `GET /tickets/:id` - requires API key.
- `PATCH /tickets/:id` - requires API key; body `{ "status": "open" | "in-progress" | "resolved" }`.
