# Budibase API + Next.js example

This is an example of how Budibase can be used as a backend for a Postgres database for a Next.js sales app. You will 
need to follow the walk-through that has been published in the Budibase docs to set up your Budibase app for this example.

## Pre-requisites

To use this example you will need:
1. [Docker](https://www.docker.com/)
2. [Docker Compose](https://docs.docker.com/compose/) 
3. [Node.js](https://nodejs.org/en/)
4. A self-hosted Budibase installation

## Getting Started

The first step is to set up the database - you can do this by going to the `db/` directory and running the command:

```bash
docker-compose up
```

The next step is to follow the example walk-through and set up a Budibase app as it describes. Once you've done
this you can configure the settings in `next.config.js`, specifically the `apiKey`, `host` and `appName`.

Finally, you can start the dev server with the following command:

```bash
npm run dev
# or
yarn dev
```

## Accessing the app

Open [http://localhost:3001](http://localhost:3001) with your browser to see the sales app.

Look in the API routes (`pages/api/sales.ts` and `pages/api/salespeople.ts`) to see how this is integrated with Budibase.
There is also a utility file where some core functions and types have been defined, in `utilities/index.ts`.

## Attribution
This example was set up using [Next.js](https://nextjs.org/) and bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).
