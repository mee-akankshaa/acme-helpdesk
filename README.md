# Acme Helpdesk

A small ticketing system: a public form where someone describes a problem, a REST API that stores it, and a PostgreSQL database behind it. I built it to practise the full path from a browser form to a persisted record, with the security details a real support tool needs.

All data is invented. It's a demo rebuild of a system I originally worked on, redone so the code can be shown publicly.

## What's inside

- A static HTML, CSS and JavaScript form with a category picker (Account, Billing, Bug report, Feature request), priority selection and accessible error handling.
- A Fastify API that accepts tickets from the public form and lets staff list, read and update them.
- A Prisma schema with a migration, plus a seed script with a handful of demo tickets.

## Details worth a look

- **Public endpoint, hardened.** `POST /tickets` is open by design, so it's rate limited (10 per minute per IP), validated with Zod, length-capped, and never echoes personal data back in the response.
- **Staff endpoints use a constant-time key check.** Everything except creating a ticket and the health check needs a bearer API key, compared with `timingSafeEqual`.
- **No leaky errors.** A global handler returns a generic 500, and unique-constraint or missing-record cases return proper 409 and 404 responses.
- **Safe rendering.** The form writes with `textContent` only. I tested a script payload and it's stored and shown as plain text.

## Stack

Static HTML/CSS/JS, Fastify 4, Prisma 5, PostgreSQL 17, Zod, TypeScript.

## Run it

```bash
docker compose up -d          # Postgres on localhost:5499
cd backend
cp .env.example .env
npm install
npx prisma migrate deploy
npm run db:seed               # optional demo tickets
npm run dev                   # API on http://localhost:4100
```

Then open `public/index.html` in a browser, or serve it with `npx serve public`. The form reads the API address from the `BACKEND_API_URL` constant at the top of its script.

Before you run it anywhere real, set `SUPPORT_API_KEY` to a strong secret, and set `CORS_ORIGIN` (comma-separated) if the form is served from another origin.

## API

| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/health` | none | liveness check |
| POST | `/tickets` | none, rate limited | creates a ticket |
| GET | `/tickets` | API key | optional `?category=` and `?status=` |
| GET | `/tickets/:id` | API key | single ticket |
| PATCH | `/tickets/:id` | API key | body `{ "status": "open" \| "in-progress" \| "resolved" }` |

A new ticket needs `ticketId` (like `AC-123456`, with prefix AC, BL, BG or FR), `category`, `name`, `phone`, `email`, `priority` (Low, Medium, High) and `issue`. `address` is optional.

## How it was built

I built this with AI-assisted development (Claude Code), then reviewed, tested and fixed it myself.
