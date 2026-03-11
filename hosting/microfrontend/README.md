# Budibase App Microfrontend React PoC

## Run

1. Ensure Budibase is available locally at `http://localhost:10000`.

2. In this folder:

`npm install`

`npm run dev`

3. Open:

`http://localhost:5173`

The host app imports `/app/mfe/budibase-client.js` through the Vite proxy and mounts a published Budibase app.

## Optional env

Set a custom remote module URL:

`VITE_BUDIBASE_MFE_URL=/app/mfe/budibase-client.js`

Set a custom published app URL to mount:

`VITE_BUDIBASE_APP_URL=/app/my-workspace#/employees`
