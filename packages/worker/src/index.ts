// need to load environment first
const env = require("./environment")

// enable APM if configured
if (process.env.ELASTIC_APM_ENABLED) {
  const apm = require("elastic-apm-node").start({
    serviceName: process.env.SERVICE,
    environment: process.env.BUDIBASE_ENVIRONMENT,
  })
}

import { Scope } from "@sentry/node"
import { Event } from "@sentry/types/dist/event"
import Application from "koa"
import { bootstrap } from "global-agent"
import db from "./db"
db.init()
const Koa = require("koa")
const destroyable = require("server-destroy")
const koaBody = require("koa-body")
const koaSession = require("koa-session")
const { passport } = require("@budibase/backend-core/auth")
const { logAlert } = require("@budibase/backend-core/logging")
const logger = require("koa-pino-logger")
const http = require("http")
const api = require("./api")
const redis = require("./utilities/redis")
const Sentry = require("@sentry/node")
import { events, pinoSettings } from "@budibase/backend-core"

// this will setup http and https proxies form env variables
bootstrap()

const app: Application = new Koa()

app.keys = ["secret", "key"]

// set up top level koa middleware
app.use(koaBody({ multipart: true }))
app.use(koaSession(app))
app.use(logger(pinoSettings()))

// authentication
app.use(passport.initialize())
app.use(passport.session())

// api routes
app.use(api.routes())

// sentry
if (env.isProd()) {
  Sentry.init()

  app.on("error", (err, ctx) => {
    Sentry.withScope(function (scope: Scope) {
      scope.addEventProcessor(function (event: Event) {
        return Sentry.Handlers.parseRequest(event, ctx.request)
      })
      Sentry.captureException(err)
    })
  })
}

const server = http.createServer(app.callback())
destroyable(server)

let shuttingDown = false,
  errCode = 0
server.on("close", async () => {
  if (shuttingDown) {
    return
  }
  shuttingDown = true
  if (!env.isTest()) {
    console.log("Server Closed")
  }
  await redis.shutdown()
  await events.shutdown()
  if (!env.isTest()) {
    process.exit(errCode)
  }
})

const shutdown = () => {
  server.close()
  server.destroy()
}

module.exports = server.listen(parseInt(env.PORT || 4002), async () => {
  console.log(`Worker running on ${JSON.stringify(server.address())}`)
  await redis.init()
})

process.on("uncaughtException", err => {
  errCode = -1
  logAlert("Uncaught exception.", err)
  shutdown()
})

process.on("SIGTERM", () => {
  shutdown()
})
