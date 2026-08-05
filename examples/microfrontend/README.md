# Budibase Microfrontend authentication PoC

This is a route-level microfrontend host that supports:

- no OIDC bridge (Budibase handles auth)
- OIDC bridge mode (host/BFF handles OIDC and silently bridges to Budibase)
- multiple clients, each with its own IDS/OIDC provider and Budibase workspace

No iframe is used.

The multi-client mode is intended to demonstrate the recommended alternative to
sharing a Budibase username and password. Every person authenticates with their
own IDS identity and receives their own Budibase session. Budibase supports up
to three concurrent sessions per user; the fourth session invalidates that
user's oldest session.

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

## Mode 3: Multiple client identity providers

Use this mode when one host serves client-specific workspaces and each client
has a separate IDS instance.

1. Copy the examples:

   `cp .env.oidc.example .env`

   `cp client-config.example.json client-config.json`

2. Keep `client-config.json` outside source control. Add one allowlisted entry
   per client containing:

   - the exact published Budibase app path
   - that client's OIDC issuer, client ID, and client secret
   - the Budibase tenant ID and explicit Budibase OIDC configuration ID

3. Set the following in `.env`:

   `CLIENT_CONFIG_PATH=./client-config.json`

   `OIDC_REDIRECT_URI=http://127.0.0.1:5173/auth/callback`

4. Register the shared callback URL from `OIDC_REDIRECT_URI` with every client
   IDS. Configure the corresponding OIDC integration in Budibase and copy its
   configuration ID into the client map.

5. Run `yarn dev:multitenant`, then open a configured path such as
   `http://127.0.0.1:5174/app/client-a` or
   `http://127.0.0.1:5174/app/client-b` and click **Login**.

The browser supplies the requested app path. The BFF resolves that path against
the allowlisted client map and owns the corresponding IDS credentials, Budibase
tenant, and OIDC configuration. Duplicate or unknown app paths are rejected.

For a production host that selects clients by hostname or an existing server
session, derive the client key from that trusted context rather than accepting
it as a query parameter.

### What this proves

- Separate IDS issuers can be selected for separate client workspaces.
- OIDC Authorization Code with PKCE is completed by the BFF.
- Budibase establishes its normal user session before the MFE is mounted.
- MFE API and WebSocket requests use the session cookie through a same-origin
  reverse proxy.
- Users retain individual identities, roles, auditing, and independent
  three-session limits.

### PoC limitations

- BFF sessions and pending OIDC state are stored in memory. Use a shared,
  expiring server-side session store in production.
- Client secrets are shown in a JSON file for clarity. Use a secret manager in
  production.
- The PoC selects the client by its allowlisted app path. A production portal
  may instead derive it from a hostname or authenticated server-side routing
  context.
- A workspace is not automatically a separate Budibase identity boundary. Use
  separate Budibase tenants or installations where strict isolation is
  required.
- API keys and HTTP Basic authentication are not end-user MFE authentication
  mechanisms. Signed JWT authentication is currently intended for iframe
  embeds, not this non-iframe MFE flow.

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
