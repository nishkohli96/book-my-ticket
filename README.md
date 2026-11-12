# BookMyTicket

## Getting Started

```bash
bash scripts/setup.sh
```

## Running with Docker (dev)

Starts every service (web, user-service, Traefik gateway) with live-reload via bind mounts:

```bash
docker compose -f compose.dev.yml up --build
```

- `--build` only needed the first time or after changing a `Dockerfile.dev`/dependencies - plain `docker compose -f compose.dev.yml up` is enough otherwise.
- Web: [http://localhost:3000](http://localhost:3000)
- API (via Traefik gateway): `http://localhost/api/...`
- Source edits in `apps/web` and `apps/user-service` hot-reload automatically. `packages/common` does not - after changing it, restart the affected service:
  ```bash
  docker compose -f compose.dev.yml restart user-service web
  ```
- Stop with `Ctrl+C`, or `docker compose -f compose.dev.yml down` to also remove the containers.
