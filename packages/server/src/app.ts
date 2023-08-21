import Sentry from "@sentry/node"

if (process.env.DD_APM_ENABLED) {
  require("./ddApm")
}

// need to load environment first
import env from "./environment"
import * as db from "./db"
db.init()
import { ServiceType } from "@budibase/types"
import { env as coreEnv } from "@budibase/backend-core"
coreEnv._set("SERVICE_TYPE", ServiceType.APPS)
import { apiEnabled } from "./features"
import createKoaApp from "./koa"
import Koa from "koa"
import { Server } from "http"
import { startup } from "./startup"

let app: Koa, server: Server

async function start() {
  // if API disabled, could run automations instead
  if (apiEnabled()) {
    const koa = createKoaApp()
    app = koa.app
    server = koa.server
  }
  // startup includes automation runner - if enabled
  await startup(app, server)
  if (env.isProd()) {
    env._set("NODE_ENV", "production")
    Sentry.init()
  }
}

start().catch(err => {
  console.error(`Failed server startup - ${err.message}`)
})

export function getServer() {
  return server
}
