# Budibase Microfrontend PoC (Single Example)

This is a single route-level microfrontend host that supports both:

- no OIDC bridge (Budibase handles auth)
- OIDC bridge mode (host/BFF handles OIDC and silently bridges to Budibase)

No iframe is used.

## What this PoC does

- Mounts Budibase as a non-iframe microfrontend.
- Keeps app routes (`/app/*`, `/app-chat/*`) owned by the host shell.
- Resolves app metadata from:
  - `GET /api/microfrontend/bootstrap?appPath=/app/<workspace-url>`
- Supports deep links and host/browser navigation with hash routes.

Note: bootstrap endpoint is available only for Enterprise licensing.

## Configure app target

Set `window.__BUDIBASE_APP_URL__` in `index.html`.

Default:

```js
window.__BUDIBASE_APP_URL__ = `${window.location.origin}/app/microfrontend`
```

Requirements:

- absolute URL
- same origin as host shell
- path starts with `/app/` or `/app-chat/`

## Mode 1: No OIDC bridge (default)

Use this when Budibase login/session handling is enough.

1. Ensure Budibase is running at `http://localhost:10000`.
2. Run:

`yarn install`

`yarn dev`

3. Open:

`http://localhost:5173`

## Mode 2: OIDC bridge mode

Use this when users must log in through your platform OIDC and be silently bridged into Budibase.

1. Ensure Budibase is running at `http://localhost:10000`.
2. Create env file:

`cp .env.oidc.example .env`

3. Set required values in `.env`:

- `OIDC_ISSUER`
- `OIDC_CLIENT_ID`
- `OIDC_CLIENT_SECRET`

4. Run:

`yarn install`

`yarn dev:oidc`

5. Open:

`http://localhost:5174`

This starts:

- Host shell (Vite) on `5173`
- BFF bridge on `5174`

In OIDC mode, the shell shows `Login`/`Logout` actions and uses `/auth/*` endpoints from `bff.server.mjs`.

## Dev proxy behavior

Vite proxies to Budibase:

- `/api/*`
- `/socket/*`
- `/builder/*`

BFF (`bff.server.mjs`) proxies:

- `/api/global/auth/*` to Budibase auth endpoints
- everything else to host shell

When using `nginx.root.conf` in OIDC mode, ensure nginx routes these to BFF:

- `/auth/*`
- `/api/global/auth/*`

## Important OIDC note

For bridge mode, set Budibase platform URL to the BFF public URL (for local: `http://localhost:5174`).
This prevents Budibase OIDC redirects from sending users to `:10000`.

## Optional reverse proxy sample

- `nginx.root.conf` demonstrates same-domain path routing and `Referer` forwarding.
