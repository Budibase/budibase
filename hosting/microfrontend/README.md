# Budibase App Microfrontend React PoC

## Run

1. Ensure Budibase is available locally at `http://localhost:10000`.

2. In this folder:

`npm install`

`npm run dev`

3. Open:

`http://localhost:5173`

The host app resolves the published app, fetches `/api/applications/:appId/appPackage`, then imports `clientLibPath` from that response before mounting the app.

## Optional env

Set a custom published app URL to mount:

`VITE_BUDIBASE_APP_URL=http://localhost:10000/app/my-workspace#/employees`
