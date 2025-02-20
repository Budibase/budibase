if (process.env.DD_APM_ENABLED) {
  require("./ddApm")
}

// need to load environment first
import env from "./environment"
import Application from "koa"
import { bootstrap } from "global-agent"
import * as db from "./db"
import { sdk as proSdk } from "@budibase/pro"
import {
  auth,
  logging,
  events,
  middleware,
  queue,
  env as coreEnv,
  timers,
  redis,
  cache,
  features,
} from "@budibase/backend-core"

db.init()
import koaBody from "koa-body"
import http from "http"
import api from "./api"

const koaSession = require("koa-session")

import { userAgent } from "koa-useragent"

import destroyable from "server-destroy"
import { initPro } from "./initPro"
import { handleScimBody } from "./middleware/handleScimBody"

if (coreEnv.ENABLE_SSO_MAINTENANCE_MODE) {
  console.warn(
    "Warning: ENABLE_SSO_MAINTENANCE_MODE is set. It is recommended this flag is disabled if maintenance is not in progress"
  )
}

// this will setup http and https proxies form env variables
bootstrap()

const app: Application = new Application()

app.keys = ["secret", "key"]
app.proxy = true

// set up top level koa middleware
app.use(handleScimBody)
app.use(koaBody({ multipart: true }))

app.use(koaSession(app))
app.use(middleware.correlation)
app.use(middleware.pino)
app.use(middleware.ip)
if (!coreEnv.DISABLE_CONTENT_SECURITY_POLICY) {
  app.use(middleware.csp)
}
app.use(userAgent)

// authentication
app.use(auth.passport.initialize())
app.use(auth.passport.session())

// api routes
app.use(api.routes())

const server = http.createServer(app.callback())
destroyable(server)

let shuttingDown = false,
  errCode = 0
server.on("close", async () => {
  if (shuttingDown) {
    return
  }
  shuttingDown = true
  console.log("Server Closed")
  timers.cleanup()
  events.shutdown()
  await redis.clients.shutdown()
  await queue.shutdown()
  if (!env.isTest()) {
    process.exit(errCode)
  }
})

const shutdown = () => {
  server.close()
  server.destroy()
}

export default server.listen(parseInt(env.PORT || "4002"), async () => {
  let startupLog = `Worker running on ${JSON.stringify(server.address())}`
  if (env.BUDIBASE_ENVIRONMENT) {
    startupLog = `${startupLog} - environment: "${env.BUDIBASE_ENVIRONMENT}"`
  }
  console.log(startupLog)

  await initPro()
  await redis.clients.init()
  features.init()
  cache.docWritethrough.init()
  // configure events to use the pro audit log write
  // can't integrate directly into backend-core due to cyclic issues
  await events.processors.init(proSdk.auditLogs.write)
})

process.on("uncaughtException", err => {
  errCode = -1
  logging.logAlert("Uncaught exception.", err)
  shutdown()
})

process.on("SIGTERM", () => {
  shutdown()
})

process.on("SIGINT", () => {
  shutdown()
})
