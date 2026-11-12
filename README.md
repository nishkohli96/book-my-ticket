# BookMyTicket

## Getting Started

```bash
bash scripts/setup.sh
```

## Running with Docker (dev)

Starts every service (web, user-service, event-service, booking-service, Traefik gateway) with live-reload via bind mounts:

```bash
docker compose -f compose.dev.yml up --build
```

- `--build` only needed the first time or after changing a `Dockerfile.dev`/dependencies - plain `docker compose -f compose.dev.yml up` is enough otherwise.
- Web: [http://localhost:3000](http://localhost:3000)
- API (via Traefik gateway): `http://localhost/api/...`
- Source edits in `apps/*` hot-reload automatically. `packages/common` and `packages/service-kit` do not - after changing them, restart the affected services:
  ```bash
  docker compose -f compose.dev.yml restart user-service event-service booking-service web
  ```
- Stop with `Ctrl+C`, or `docker compose -f compose.dev.yml down` to also remove the containers.


## Services

| Service | Port | Public prefix | Owns |
| --- | --- | --- | --- |
| `user-service` | 8001 | `/api/user` | accounts, sessions, profile |
| `event-service` | 8002 | `/api/event` | events, seats, seat locks |
| `booking-service` | 8003 | `/api/booking` | seat holds, mock checkout, bookings |

- Each service keeps its tables in its own Postgres schema (`public`, `events`, `bookings`) and never reads another service's tables.
- `booking-service` changes seat state only through `event-service`'s `/internal/seats/*` routes, which the gateway does not expose.
- `packages/service-kit` holds the Node-only code the services share (app factory, auth middleware, logger). `packages/common` holds what the web app shares too (types, zod schemas).
- Each service needs its own `.env` - copy its `.env_sample`. `JWT_SECRET` must be the same in `user-service` and `booking-service`.

### Database and seed data

```bash
pnpm -F @book-my-ticket/event-service db:push
```

```bash
pnpm -F @book-my-ticket/booking-service db:push
```

```bash
pnpm seed
```

`pnpm seed` pulls upcoming US events from Ticketmaster (needs `TICKETMASTER_API_KEY` in `apps/event-service/.env`) and generates a seat map for each. Safe to re-run.

### Checkout is a mock

No real payment happens. Any card number works; `4000 0000 0000 0002` is declined on purpose.
