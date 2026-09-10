# Phase 01 - Runtime Contract

Fixed operational values shared by both applications. Later phases must not invent
alternatives - change them here first.

## Ports

| Application | Port | URL |
|---|---|---|
| Backend (Express) | 4000 | http://localhost:4000 |
| Frontend (Next.js) | 3000 | http://localhost:3000 |

Both run on `localhost`, so browser cookies are same-site despite the differing ports
(cookies are not port-scoped). This keeps `SameSite=Lax` workable in development.

## Environment Variables

### backend/.env

| Variable | Default | Purpose |
|---|---|---|
| `PORT` | `4000` | HTTP listen port |
| `NODE_ENV` | `development` | Standard environment flag |
| `CORS_ORIGIN` | `http://localhost:3000` | Allowed browser origin (credentials enabled) |
| `SESSION_TTL_MINUTES` | `30` | Demo session lifetime |
| `DEMO_EMAIL` | `demo@fleetpulse.com` | Demo account identity |
| `DEMO_PASSWORD` | `password123` | Demo account secret |
| `TELEMETRY_INTERVAL_MS` | `2000` | Generator tick interval |
| `HISTORY_LIMIT` | `3000` | Retained telemetry events |

`DEMO_EMAIL` and `DEMO_PASSWORD` are read from the environment with the documented
values as fallbacks. This satisfies the rule against hardcoded secrets while keeping
`npm run dev` zero-configuration for assessment.

### frontend/.env.local

| Variable | Default | Purpose |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:4000` | Backend base URL for fetch and EventSource |

Each application ships a committed `.env.example`. Real `.env` files are gitignored.

## CORS

```ts
cors({ origin: process.env.CORS_ORIGIN, credentials: true })
```

`credentials: true` is mandatory - the session cookie will not be sent otherwise.
A wildcard origin is invalid in combination with credentials.

Every frontend request must set `credentials: 'include'`, and the EventSource must be
constructed with `{ withCredentials: true }`.

## Session Cookie

| Attribute | Value |
|---|---|
| Name | `fp_session` |
| httpOnly | `true` |
| sameSite | `lax` |
| secure | `false` in development, `true` in production |
| path | `/` |
| maxAge | `SESSION_TTL_MINUTES` |

The cookie carries an opaque session id. Session records live in backend memory and
are never exposed to JavaScript.

## API Base Path

All backend routes are namespaced under `/api`, except the health check.

## Commands

### Backend

```bash
cd backend
npm install
npm run dev        # tsx watch src/server.ts
npm run build      # tsc
npm start          # node dist/server.js
npm run lint
npm run typecheck  # tsc --noEmit
```

### Frontend

```bash
cd frontend
npm install
npm run dev
npm run build
npm start
npm run lint
npm run typecheck
```

## Startup Order

The backend must be running before the frontend is opened in a browser. The frontend
degrades to a reconnecting state rather than crashing if the backend is unavailable,
but no data renders.

## Toolchain

| Tool | Version |
|---|---|
| Node.js | 24.x (pinned via `.nvmrc`) |
| npm | 11.x |

## Verification

The contract holds when:

```bash
curl http://localhost:4000/health
# {"status":"ok","uptime":<n>}

curl -i http://localhost:4000/api/dashboard/summary
# HTTP/1.1 401 Unauthorized

curl -i -X POST http://localhost:4000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"demo@fleetpulse.com","password":"password123"}'
# HTTP/1.1 200 OK  +  Set-Cookie: fp_session=...; HttpOnly; SameSite=Lax; Path=/
```
